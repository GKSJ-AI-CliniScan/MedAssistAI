# 🏥 MedAssist AI
### Medical Symptom Analysis & Disease Prediction System

![Status](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Flask-black)
![ML](https://img.shields.io/badge/ML-Disease%20Prediction-orange)
![Deep Learning](https://img.shields.io/badge/DL-MobileNetV2-red)

---

## 📌 Overview

**MedAssist AI** is an AI-powered healthcare application that provides
symptom-based disease prediction, medical image analysis, and patient
health management features.

The system combines a **React frontend**, **Flask backend**, machine
learning models, and deep learning models.

---

## ✨ Features

- 🔐 User Authentication
- 🩺 Symptom-Based Disease Prediction
- 🖼️ Medical Image Classification
- 📄 Medical Report Analysis
- 📅 Appointment Management
- 🏥 Patient Management

---

## 🧠 Machine Learning

### Symptom-Based Prediction

A machine learning model is used to predict diseases based on the
symptoms provided by the user.

### Medical Image Classification

**MobileNetV2 Transfer Learning** is used for medical image
classification.

Supported diseases:

| Disease | Model |
|---|---|
| Glaucoma | MobileNetV2 |
| Brain Stroke | MobileNetV2 |
| Diabetic Retinopathy | MobileNetV2 |
| Heart Attack | MobileNetV2 |

**Input:** 224 × 224 RGB images

---

## 🏗️ System Architecture

```text
User
  ↓
React Frontend
  ↓
Flask Backend
  ↓
┌───────────────────────┐
│ Disease Prediction    │
│ Image Classification  │
│ Report Analysis       │
│ Patient Management    │
└───────────────────────┘
  ↓
Database / ML Models