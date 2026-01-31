import json
import numpy as np
import tensorflow as tf

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO

# -------------------------
# CONFIG
# -------------------------

IMG_SIZE = (224, 224)

QUICK_MODEL_PATH = "model_multiclass_eye_detection_resnet50_version1"
SPEC_MODEL_PATH = "model_multiclass_specialized_resnet50_version1"

QUICK_LABELS_PATH = "labels_quick.json"
SPEC_LABELS_PATH = "labels_specialist.json"

# -------------------------
# APP
# -------------------------

app = FastAPI(title="Eye AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# LOAD LABELS
# -------------------------

with open(QUICK_LABELS_PATH) as f:
    QUICK_LABELS = json.load(f)

with open(SPEC_LABELS_PATH) as f:
    SPEC_LABELS = json.load(f)

# -------------------------
# LOAD MODELS (TFSMLayer)
# -------------------------

quick_layer = tf.keras.layers.TFSMLayer(
    QUICK_MODEL_PATH,
    call_endpoint="serving_default"
)

spec_layer = tf.keras.layers.TFSMLayer(
    SPEC_MODEL_PATH,
    call_endpoint="serving_default"
)

# wrap as keras models (más cómodo para predict)
quick_model = tf.keras.Sequential([quick_layer])
spec_model = tf.keras.Sequential([spec_layer])

print("✅ Models loaded")

# -------------------------
# IMAGE PREPROCESS
# -------------------------

def preprocess_image(image_bytes: bytes):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)

    arr = np.array(img).astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)

    return arr


def run_model(model, labels, arr):
    outputs = model(arr)

    if isinstance(outputs, dict):
        outputs = list(outputs.values())[0]

    preds = outputs.numpy()[0]

    idx = int(np.argmax(preds))

    predictions = []
    for i, prob in enumerate(preds):
        predictions.append({
            "index": i,
            "label": labels[str(i)],
            "percentage": round(float(prob) * 100, 1)
        })

    return {
        "index": idx,
        "label": labels[str(idx)],
        "confidence": predictions[idx]["percentage"],
        "predictions": predictions
    }

# -------------------------
# ENDPOINTS
# -------------------------

@app.post("/analyze/quick")
async def analyze_quick(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Invalid image")

    data = await file.read()
    arr = preprocess_image(data)

    result = run_model(quick_model, QUICK_LABELS, arr)

    return {
        "mode": "quick",
        "result": result
    }


@app.post("/analyze/specialist")
async def analyze_specialist(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Invalid image")

    data = await file.read()
    arr = preprocess_image(data)

    result = run_model(spec_model, SPEC_LABELS, arr)

    return {
        "mode": "specialist",
        "result": result
    }
