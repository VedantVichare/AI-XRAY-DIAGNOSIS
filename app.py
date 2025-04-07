def compute_saliency_map(model, image_array):
    image_tensor = tf.convert_to_tensor(image_array, dtype=tf.float32)
    with tf.GradientTape() as tape:
        tape.watch(image_tensor)
        predictions = model(image_tensor, training=False)
        pred_index = tf.argmax(predictions[0])
        pred_output = predictions[0][pred_index]
        grads = tape.gradient(pred_output, image_tensor)
        saliency_map = tf.reduce_max(tf.abs(grads), axis=-1)[0].numpy()
    return saliency_map / np.max(saliency_map)

def apply_custom_colormap(saliency_map):
    colors = ["blue", "yellow", "red"]
    n_bins = 100
    cmap_name = "custom_blue_yellow_red"
    custom_cmap = mcolors.LinearSegmentedColormap.from_list(cmap_name, colors, N=n_bins)
    
    saliency_map_resized = cv2.resize(saliency_map, (saliency_map.shape[1], saliency_map.shape[0]))
    saliency_map_resized = np.uint8(255 * saliency_map_resized)
    colormap_img = custom_cmap(saliency_map_resized / 255.0)
    
    return (colormap_img[:, :, :3] * 255).astype(np.uint8)

def overlay_saliency_map(image, saliency_map, alpha=0.4):
    saliency_map_colored = apply_custom_colormap(saliency_map)
    overlayed_image = saliency_map_colored * alpha + image
    return np.uint8(overlayed_image)


from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from keras.preprocessing.image import load_img, img_to_array
import matplotlib.colors as mcolors
import cv2
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename
import os
from pymongo import MongoClient
import datetime
from stable_baselines3 import DQN  

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = 'static/images'
SALIENT_FOLDER = 'static/saliency_folder'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SALIENT_FOLDER, exist_ok=True)



cnn_model = tf.keras.models.load_model("model_4.h5")




rl_model = DQN.load("rl_agent_model_4")  


client = MongoClient("mongodb://localhost:27017/")
db = client['Doctor']  

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_and_preprocess_image(image_path, target_size=(150, 150)):
    img = load_img(image_path, target_size=target_size)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    img_np = np.array(img)
    return img_np, img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'imagefile' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    imagefile = request.files['imagefile']
    if imagefile.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(imagefile.filename):
        return jsonify({'error': 'File type not allowed. Only images are accepted.'}), 400

    # Retrieve additional user information from the request
    user_info = request.form
    name = user_info.get('name')
    surname = user_info.get('surname')
    age = user_info.get('age')
    mobile_no = user_info.get('mobile')
    doctor_email = user_info.get('doctor_email')

    # Check for missing fields
    missing_fields = [field for field in ['doctor_email', 'name', 'surname', 'age', 'mobile'] if user_info.get(field) is None]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    # Save the uploaded image
    image_filename = secure_filename(imagefile.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
    imagefile.save(image_path)

    # Preprocess and predict using CNN
    original_img, processed_img = load_and_preprocess_image(image_path)
    cnn_prediction = cnn_model.predict(processed_img)[0]
    pneumonia_percentage = cnn_prediction[0] * 100
    normal_percentage = (1 - cnn_prediction[0]) * 100
    confidence = max(pneumonia_percentage, normal_percentage)
 
    if confidence < 63: 
        obs = np.array([[confidence]])  
        action, _ = rl_model.predict(obs, deterministic=True)
        result = 'Pneumonia' if action == 1 else 'Normal'
        model_used = "Reinforcement Learning Model"
    else:
        result = "PNEUMONIA" if cnn_prediction[0] >= 0.5 else "NORMAL"
        model_used = "CNN Model"


    pneumonia_percentage = f"{pneumonia_percentage:.2f}"
    normal_percentage = f"{normal_percentage:.2f}"

    
    saliency_map = compute_saliency_map(cnn_model, processed_img)
    overlayed_image = overlay_saliency_map(original_img, saliency_map)

    saliency_map_filename = image_filename.replace('.jpeg', '_saliency.png').replace('.jpg', '_saliency.png').replace('.png', '_saliency.png')
    saliency_map_path = os.path.join(SALIENT_FOLDER, saliency_map_filename)
    cv2.imwrite(saliency_map_path, cv2.cvtColor(overlayed_image, cv2.COLOR_RGB2BGR))

 
    image_url = f"{request.url_root}{UPLOAD_FOLDER}/{image_filename}"
    saliency_map_url = f"{request.url_root}{SALIENT_FOLDER}/{saliency_map_filename}"

    
    db[doctor_email].insert_one({
        'name': name,
        'surname': surname,
        'age': int(age),
        'mobile_no': mobile_no,
        'prediction': result,
        'pneumonia_percentage': pneumonia_percentage,
        'normal_percentage': normal_percentage,
        'date': datetime.datetime.now(),
        'saliency_map_url': saliency_map_url,
        'image_url': image_url
    })

    # Prepare and return response
    response = {
        'prediction': result,
        'pneumonia_percentage': pneumonia_percentage,
        'normal_percentage': normal_percentage,
        'saliency_map_url': saliency_map_url,
        'image_url': image_url,
        'model_used': model_used,
        'confidence':confidence
    }

    return jsonify(response)

# Route to serve uploaded images
@app.route('/static/images/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to fetch prediction history
@app.route('/history', methods=['GET'])
def history():
    try:
        records = list(db.collection.find())
        return jsonify(records), 200
    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({"error": "Unable to fetch history"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)















