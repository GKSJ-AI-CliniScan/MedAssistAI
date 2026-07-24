import os
import numpy as np
from PIL import Image
import tensorflow as tf

IMAGE_SIZE = (224, 224)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

MODEL_FOLDER = os.path.join(PROJECT_ROOT, "models")

MODELS = {
    "glaucoma": "glaucoma_model.keras",
    "brain_stroke": "brain_stroke_model.keras",
    "diabetic_retinopathy": "diabetic_retinopathy_model.keras",
    "heart_attack": "heart_attack_model.keras"
}
CLASS_NAMES = {

    "glaucoma": {
        0: "Normal",
        1: "Glaucoma"
    },

    "brain_stroke": {
        0: "Normal",
        1: "Brain Stroke"
    },

    "diabetic_retinopathy": {
        0: "No Diabetic Retinopathy",
        1: "Diabetic Retinopathy"
    },

    "heart_attack": {
         0: "Heart Attack",
         1: "Normal"
}

}

def load_disease_model(disease_name):

    disease_name = disease_name.lower()

    if disease_name not in MODELS:
        raise ValueError(f"Unsupported disease: {disease_name}")

    model_path = os.path.join(
        MODEL_FOLDER,
        MODELS[disease_name]
    )

    model = tf.keras.models.load_model(model_path)

    return model


def preprocess_image(image_path):

    image = Image.open(image_path).convert("RGB")

    image = image.resize(IMAGE_SIZE)

    image = np.array(image) / 255.0

    image = np.expand_dims(image, axis=0)

    return image


def predict_image(disease_name, image_path):

    model = load_disease_model(disease_name)

    image = preprocess_image(image_path)

    probability = model.predict(image, verbose=0)[0][0]

    prediction = int(probability > 0.5)

    confidence = probability if prediction == 1 else 1 - probability

    return {
    "disease": disease_name,
    "prediction": CLASS_NAMES[disease_name][prediction],
    "confidence": round(float(confidence), 4)
}


import sys

if __name__ == "__main__":

    import sys

    if len(sys.argv) != 3:
        print("Usage: python src/predict.py <disease> <image_path>")
        sys.exit(1)

    try:
        disease = sys.argv[1]
        image_path = sys.argv[2]

        result = predict_image(disease, image_path)
        print(result)

    except Exception as e:
        print(f"Error: {e}")
