# AI-XRAY-DIAGNOSIS

## Abstract:
Pneumonia is a leading cause of global morbidity, particularly in regions with limited access to diagnostic facilities. This project presents a machine learning-based system for automated pneumonia detection using chest X-ray images. By leveraging a convolutional neural network (CNN) and a dataset of 5,216 X-ray images, the system achieved 90.3% test accuracy. It serves as a diagnostic aid in resource-limited settings, enabling faster and more reliable diagnosis.

## Features
1] Image Classification: Differentiates between normal and pneumonia-affected lungs.<br>
2] Web-Based Platform: Provides a user-friendly interface for healthcare professionals to upload X-rays and receive diagnostic predictions.<br>
3] Saliency Visualizations: Highlights regions in X-ray images contributing to the model's decision.<br>
4] Data Storage: Securely stores patient data, including images and diagnostic results, using MongoDB.<br>
5] Auth0: Use for authentication provide secure login and signup.<br>

## Technologies Used
Frameworks: TensorFlow, Flask<br>
Backend: MongoDB for data storage<br>
Frontend: HTML, CSS, JavaScript for web interface<br>
Model: Own CNN model layer structure<br>
Visualization: Saliency map for interpretability<br>

## Results
Training Accuracy: 90.27%<br>
Test Accuracy: 90.3%<br>
Performance Metrics: Balanced sensitivity and specificity for robust diagnostic capability.<br>
