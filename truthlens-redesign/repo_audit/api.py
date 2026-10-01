"""
FastAPI service for the fake news detector.

Run locally with:
    uvicorn api:app --reload

Endpoints:
    GET  /            - health check
    GET  /models       - list available models
    POST /predict      - classify a piece of text
"""
import os
from typing import Optional

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.preprocess import clean_text

MODELS_DIR = os.environ.get("MODELS_DIR", "models")
AVAILABLE_MODELS = ["logistic_regression", "random_forest", "passive_aggressive"]
MAX_TEXT_LENGTH = 20000

# Comma-separated list of allowed origins, e.g. "https://truthlens.vercel.app,http://localhost:5173"
# Defaults to "*" for local development — restrict this in production.
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
allow_origins = (
    ["*"]
    if CORS_ORIGINS.strip() == "*"
    else [o.strip().rstrip("/") for o in CORS_ORIGINS.split(",")]
)

app = FastAPI(
    title="Fake News Detector API",
    description="Classifies news text as real or fake using classical ML models trained on WELFake.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

_vectorizer = None
_models = {}


def get_vectorizer():
    global _vectorizer
    if _vectorizer is None:
        path = os.path.join(MODELS_DIR, "vectorizer.pkl")
        if not os.path.exists(path):
            raise HTTPException(
                status_code=503,
                detail="Vectorizer not found. Train the models with `python src/train.py` first.",
            )
        _vectorizer = joblib.load(path)
    return _vectorizer


def get_model(name: str):
    if name not in _models:
        path = os.path.join(MODELS_DIR, f"{name}.pkl")
        if not os.path.exists(path):
            raise HTTPException(status_code=404, detail=f"Model '{name}' not found")
        _models[name] = joblib.load(path)
    return _models[name]


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)
    model: Optional[str] = "logistic_regression"


class PredictResponse(BaseModel):
    label: str
    confidence: Optional[float] = None
    model_used: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Fake News Detector API is running"}


@app.get("/models")
def list_models():
    return {"available_models": AVAILABLE_MODELS}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="`text` must not be empty")

    if req.model not in AVAILABLE_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"`model` must be one of {AVAILABLE_MODELS}",
        )

    vectorizer = get_vectorizer()
    model = get_model(req.model)

    cleaned = clean_text(req.text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]
    # WELFake convention: label 0 = fake, label 1 = real
    label = "FAKE" if pred == 1 else "REAL"

    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = float(model.predict_proba(vec).max())

    return PredictResponse(label=label, confidence=confidence, model_used=req.model)
