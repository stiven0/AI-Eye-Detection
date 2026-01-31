# 🧠📸 AI Eye Detection — Dual-Model Eye Condition Classifier

## Overview

**AI Eye Detection** is a hackathon project that uses deep learning models to analyze eye images and classify possible eye conditions.

The system provides two analysis modes:

- 🔍 **Quick Scan Mode** — fast screening model for general users  
- 🩺 **Specialist Mode** — advanced clinical model for deeper analysis

Users can upload or capture an eye image from the browser. The AI backend processes the image and returns class probabilities and confidence scores.

---

# 🚀 Features

- Camera capture with circular eye overlay
- Automatic crop to eye region
- Image upload support
- Dual-model inference pipeline
- Probability breakdown per class
- Confidence percentage output
- Styled result cards
- Angular standalone frontend
- FastAPI inference backend
- TensorFlow SavedModel loading via TFSMLayer

---

# 🧱 Tech Stack

## Frontend

- Angular (standalone)
- Angular Material
- TypeScript
- Browser Camera API

## Backend

- FastAPI
- TensorFlow / Keras
- TFSMLayer (SavedModel inference)
- Pillow
- NumPy

---

# 🤖 Models Used

## Quick Scan Model

model_multiclass_eye_detection_resnet50_version1

Classes:

- cellulitis
- conjunctivitis
- healthy
- stye

---

## Specialist Model

model_multiclass_specialized_resnet50_version1

Classes:

- amd
- cataract
- diabetic_retinopathy
- normal
- retinal_detachment

---

# ⚠️ Model Files (Important)

Model folders are **not included in this repository** due to size limits.

Place them at the same level as `main.py`:

```
api-python/
 ├── main.py
 ├── model_multiclass_eye_detection_resnet50_version1/
 ├── model_multiclass_specialized_resnet50_version1/
 ├── labels_quick.json
 ├── labels_specialist.json
 └── requirements.txt
```

---

# 🛠 Backend Setup — FastAPI

## 1️⃣ Create virtual environment

```bash
cd api-python
python -m venv venv
```

### Activate environment

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

---

## 2️⃣ Install dependencies

Create file:

```
requirements.txt
```

Content:

```txt
fastapi
uvicorn[standard]
tensorflow
numpy
pillow
python-multipart
```

Install packages:

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Run API server

```bash
uvicorn main:app --reload
```

Server runs at:

```
http://localhost:8000
```

Swagger docs available at:

```
http://localhost:8000/docs
```

---

# 🔌 API Endpoints

## Quick Mode

```
POST /analyze/quick
```

Uses general screening model.

---

## Specialist Mode

```
POST /analyze/specialist
```

Uses advanced specialist model.

---

## Request Format

```
multipart/form-data
field name: file
```

---

## Example Response

```json
{
  "mode": "quick",
  "top": {
    "index": 2,
    "label": "healthy",
    "confidence": 99.7
  },
  "classes": [
    { "label": "cellulitis", "percentage": 0.1 },
    { "label": "conjunctivitis", "percentage": 0.1 },
    { "label": "healthy", "percentage": 99.7 },
    { "label": "stye", "percentage": 0.1 }
  ]
}
```

---

# 🎨 Frontend Setup — Angular

## Install dependencies

```bash
cd detection-disease-eye-ai
npm install
```

---

## Run development server

```bash
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

## Frontend → Backend Connection

API base URL:

```
http://localhost:8000
```

Endpoints used:

```
/analyze/quick
/analyze/specialist
```

Requests are sent using Axios with multipart file upload.

---

# 📂 Project Structure

```
project-root/
 ├── detection-disease-eye-ai/
 │   └── src/...
 │
 ├── api-python/
 │   ├── main.py
 │   ├── requirements.txt
 │   ├── labels_quick.json
 │   ├── labels_specialist.json
 │   ├── model_multiclass_eye_detection_resnet50_version1/
 │   └── model_multiclass_specialized_resnet50_version1/
 │
 └── README.md
```

---

# 🎥 Demo Capabilities

- Live camera capture
- Eye-region overlay guide
- Dual AI models
- Class probability display
- Confidence scoring
- Real-time inference

---

# ⚠️ Disclaimer

This system is **not a medical diagnosis tool**.  
Results are experimental and for demonstration purposes only.  
Always consult a qualified medical professional.