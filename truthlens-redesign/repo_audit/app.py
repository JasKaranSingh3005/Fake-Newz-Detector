"""
Streamlit demo — paste a headline/article and see the model's verdict.

Run with: streamlit run app.py
"""
import os

import joblib
import streamlit as st

from src.preprocess import clean_text

st.set_page_config(page_title="Fake News Detector", page_icon="📰")

MODELS_DIR = "models"
MODEL_CHOICES = ["logistic_regression", "random_forest", "passive_aggressive"]


@st.cache_resource
def load_artifacts(model_name: str):
    vectorizer = joblib.load(os.path.join(MODELS_DIR, "vectorizer.pkl"))
    model = joblib.load(os.path.join(MODELS_DIR, f"{model_name}.pkl"))
    return vectorizer, model


st.title("📰 Fake News Detector")
st.caption("Trained on the WELFake dataset (~72k articles) using classical ML models.")

model_name = st.selectbox("Model", MODEL_CHOICES)
text_input = st.text_area("Paste a headline or article body:", height=200)

if st.button("Classify", type="primary") and text_input.strip():
    try:
        vectorizer, model = load_artifacts(model_name)
    except FileNotFoundError:
        st.error("No trained models found. Run `python src/train.py` first.")
    else:
        cleaned = clean_text(text_input)
        vec = vectorizer.transform([cleaned])
        pred = model.predict(vec)[0]
        label = "🚩 FAKE" if pred == 1 else "✅ REAL"

        st.subheader(label)

        if hasattr(model, "predict_proba"):
            conf = model.predict_proba(vec).max()
            st.progress(float(conf))
            st.write(f"Confidence: {conf:.1%}")
