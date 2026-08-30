"""
Classify a single headline/article from the command line using a
saved model.

Example:
    python src/predict.py --text "Scientists confirm the moon is made of cheese" \
        --model logistic_regression
"""
import argparse
import os

import joblib

from preprocess import clean_text


def predict(text: str, model_name: str, models_dir: str = "models"):
    vectorizer = joblib.load(os.path.join(models_dir, "vectorizer.pkl"))
    model = joblib.load(os.path.join(models_dir, f"{model_name}.pkl"))

    cleaned = clean_text(text)
    vec = vectorizer.transform([cleaned])
    pred = model.predict(vec)[0]

    label = "FAKE" if pred == 1 else "REAL"

    # Not every model exposes predict_proba (e.g. PassiveAggressiveClassifier doesn't)
    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = model.predict_proba(vec).max()

    return label, confidence


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="Headline or article text to classify")
    parser.add_argument("--model", default="logistic_regression",
                         choices=["logistic_regression", "random_forest", "passive_aggressive"])
    args = parser.parse_args()

    label, confidence = predict(args.text, args.model)

    if confidence is not None:
        print(f"Prediction: {label}  (confidence: {confidence:.2%})")
    else:
        print(f"Prediction: {label}")
