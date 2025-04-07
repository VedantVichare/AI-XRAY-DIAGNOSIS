# 🧠 AI-XRAY-DIAGNOSIS

## 📌 Abstract
Pneumonia is a critical global health concern, especially in regions lacking expert radiologists and diagnostic tools. This project introduces a **hybrid AI-based diagnostic system** that integrates **Transfer Learning** and **Reinforcement Learning** to detect pneumonia from chest X-ray images.

A pre-trained **DenseNet CNN** was fine-tuned on a dataset of **5,216 labeled chest X-rays**, achieving **96% training accuracy** and **93% test accuracy**. In addition, a **Deep Q-Network (DQN)** was employed to optimize decision-making, enhancing the system’s diagnostic confidence. This intelligent tool accelerates and automates pneumonia detection, providing reliable support in resource-constrained clinical environments.

---

## 🌟 Features

1. **Image Classification**: Accurately classifies chest X-rays into _Normal_ or _Pneumonia_ using a fine-tuned DenseNet model.  
2. **Reinforcement Learning Optimization**: Utilizes **DQN** to intelligently improve the diagnostic decision-making process.  
3. **Web-Based Platform**: Clean and responsive interface for uploading X-rays and receiving instant AI-driven predictions.  
4. **Saliency Visualizations**: Highlights critical regions in the X-ray influencing the model’s decision through Grad-CAM heatmaps.  
5. **Secure Data Storage**: Stores X-rays, predictions, and user history using **MongoDB**.  
6. **Authentication with Auth0**: Ensures secure login and signup functionality.  
7. **Prediction History Tracking**: Logged-in users can view previous uploads along with time-stamped diagnosis results.  
8. **Patient History Graphs**: Visualizes diagnostic trends over time using dynamic graphs for better clinical insight.

---

## 🛠 Technologies Used

- **Frameworks**: TensorFlow, Flask  
- **Backend**: MongoDB for secure data storage  
- **Frontend**: HTML, CSS, JavaScript  
- **Model**: Custom CNN layers and fine-tuned **DenseNet (Transfer Learning)**  
- **Reinforcement Learning**: **Deep Q-Network (DQN)** for intelligent optimization  
- **Visualization**: Saliency maps via Grad-CAM for interpretability  

---

## 📊 Results

- **Training Accuracy**: 96%  
- **Test Accuracy**: 93%  
- **Performance Metrics**: Balanced sensitivity & specificity, strong real-world applicability

---

## 🖼 Output Visuals

![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/d61de5e4adfce2c76554e6565e16f418339a408b/Project_Pictures/Screenshot%202024-11-11%20091504.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/62b4027d26bce073e63c95f1220adb9eaa2085dc/Project_Pictures/Screenshot%202025-04-08%20001217.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/e5cb7a4d69a89e621eddf5eda8c64453c87c303e/Project_Pictures/Screenshot%202025-04-08%20001309.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/e5cb7a4d69a89e621eddf5eda8c64453c87c303e/Project_Pictures/Screenshot%202025-04-08%20001347.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/e5cb7a4d69a89e621eddf5eda8c64453c87c303e/Project_Pictures/Screenshot%202025-04-08%20001406.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/7b2148f35aed8f07fa8b149b71e7ac72d32e200b/Project_Pictures/Screenshot%202025-04-08%20002221.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/7b2148f35aed8f07fa8b149b71e7ac72d32e200b/Project_Pictures/Screenshot%202025-04-08%20002240.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/6653637057d66e6bd17902af00cda579ab4a7014/Project_Pictures/Screenshot%202025-04-08%20002650.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/d61de5e4adfce2c76554e6565e16f418339a408b/Project_Pictures/Screenshot%202024-11-11%20092109.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/d61de5e4adfce2c76554e6565e16f418339a408b/Project_Pictures/Screenshot%202024-11-11%20091741.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/d61de5e4adfce2c76554e6565e16f418339a408b/Project_Pictures/Screenshot%202024-11-11%20091800.png)
![Screenshot](https://github.com/VedantVichare/AI-XRAY-DIAGNOSIS/blob/d61de5e4adfce2c76554e6565e16f418339a408b/Project_Pictures/Screenshot%202024-11-11%20091811.png)

---

## 📬 Contact

For queries or collaboration: **Vedant Vichare**  
GitHub: [VedantVichare](https://github.com/VedantVichare)  

