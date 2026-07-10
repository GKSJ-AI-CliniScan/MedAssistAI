# Medical Image Classification Module

This module is a part of the **MedAssistAI** project and focuses on disease prediction using medical images. It uses deep learning with transfer learning to classify medical images for multiple diseases.

---

## Diseases Supported

- Glaucoma
- Brain Stroke
- Diabetic Retinopathy
- Heart Attack

---

## Model Architecture

- MobileNetV2 (Transfer Learning)
- Global Average Pooling
- Dropout
- Dense Output Layer (Binary Classification)

---

## Image Specifications

- Input Size: **224 × 224**
- Color Mode: RGB
- Image Normalization: Pixel values scaled before training

---

## Framework & Libraries

- TensorFlow
- Keras
- NumPy
- Pandas
- Matplotlib
- Pillow
- Scikit-learn

---

## Dataset

The datasets were obtained from **Roboflow**.

Supported dataset formats:
- CSV-based datasets
- Folder-based datasets

The training pipeline automatically detects the dataset type and loads it accordingly.

---

## Project Structure

```
Image_Model/
│
├── models/
│   ├── glaucoma_model.keras
│   ├── brain_stroke_model.keras
│   ├── diabetic_retinopathy_model.keras
│   └── heart_attack_model.keras
│
├── notebooks/
│   └── train_classifier.ipynb
│
├── src/
│   └── predict.py
│
├── README.md
├── requirements.txt
└── .gitignore
```

---

## Trained Models

| Disease | Status |
|---------|--------|
| Glaucoma | ✅ Completed |
| Brain Stroke | ✅ Completed |
| Diabetic Retinopathy | ✅ Completed |
| Heart Attack | ✅ Completed |

---

## How to Train

1. Select the disease name in the notebook.
2. Run the preprocessing pipeline.
3. Train the MobileNetV2 model.
4. The best model is automatically saved in the `models/` folder.

---

## Model Prediction

The reusable prediction module can be executed using:

```bash
python src/predict.py <disease_name> <image_path>
```

Example:

```bash
python src/predict.py glaucoma sample_images/glaucoma.jpg
```

---

## Model Storage

All trained models are stored in the `models/` directory as `.keras` files and can be directly integrated into the backend inference pipeline.

---

## Current Status

- ✅ Reusable preprocessing pipeline implemented
- ✅ Automatic dataset type detection
- ✅ Four disease classification models trained
- ✅ Standalone prediction module implemented
- ✅ Models ready for backend integration
