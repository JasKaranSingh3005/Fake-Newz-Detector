"""
Lightweight drift monitoring for the fake news detector.

Two things this script does:
1. `--log-training-run`: appends accuracy/F1 for the latest training
   run to metrics_log.csv (called by the retrain workflow).
2. `--check-drift`: compares the predicted-label distribution on a
   fresh batch of text against a stored baseline distribution and
   flags if it has shifted beyond a threshold (a cheap proxy for
   data/concept drift without needing new ground-truth labels).
"""
import argparse
import csv
import json
import os
from datetime import datetime, timezone

import joblib

from src.preprocess import clean_text, load_and_clean, vectorize

METRICS_LOG = "metrics_log.csv"
BASELINE_PATH = "models/baseline_distribution.json"


def log_training_run(models_dir: str = "models", data_path: str = "data/WELFake_Dataset.csv"):
    """Re-evaluate freshly trained models on the test split and append to the log."""
    from sklearn.metrics import accuracy_score, f1_score

    df = load_and_clean(data_path)
    _, X_test, _, y_test, _ = vectorize(df)
    vectorizer = joblib.load(os.path.join(models_dir, "vectorizer.pkl"))

    rows = []
    timestamp = datetime.now(timezone.utc).isoformat()

    for name in ["logistic_regression", "random_forest", "passive_aggressive"]:
        model_path = os.path.join(models_dir, f"{name}.pkl")
        if not os.path.exists(model_path):
            continue
        model = joblib.load(model_path)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        rows.append([timestamp, name, f"{acc:.4f}", f"{f1:.4f}"])

    file_exists = os.path.exists(METRICS_LOG)
    with open(METRICS_LOG, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["timestamp", "model", "accuracy", "f1"])
        writer.writerows(rows)

    print(f"Logged {len(rows)} rows to {METRICS_LOG}")


def check_drift(texts: list, model_name: str = "logistic_regression",
                 models_dir: str = "models", threshold: float = 0.15):
    """
    Compares the FAKE-prediction rate on `texts` against the stored
    baseline. Flags drift if the rate has moved by more than `threshold`.
    """
    vectorizer = joblib.load(os.path.join(models_dir, "vectorizer.pkl"))
    model = joblib.load(os.path.join(models_dir, f"{model_name}.pkl"))

    cleaned = [clean_text(t) for t in texts]
    vecs = vectorizer.transform(cleaned)
    preds = model.predict(vecs)
    current_fake_rate = sum(preds) / len(preds)

    if os.path.exists(BASELINE_PATH):
        with open(BASELINE_PATH) as f:
            baseline = json.load(f)
        baseline_rate = baseline.get("fake_rate", current_fake_rate)
    else:
        baseline_rate = current_fake_rate

    drift = abs(current_fake_rate - baseline_rate)
    is_drifting = drift > threshold

    print(f"Baseline fake-rate: {baseline_rate:.2%}")
    print(f"Current fake-rate:  {current_fake_rate:.2%}")
    print(f"Drift: {drift:.2%}  {'⚠️  DRIFT DETECTED' if is_drifting else '✅ within threshold'}")

    # Update baseline for next comparison
    os.makedirs(os.path.dirname(BASELINE_PATH), exist_ok=True)
    with open(BASELINE_PATH, "w") as f:
        json.dump({"fake_rate": current_fake_rate,
                    "updated_at": datetime.now(timezone.utc).isoformat()}, f)

    return is_drifting, drift


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--log-training-run", action="store_true")
    parser.add_argument("--check-drift", action="store_true")
    args = parser.parse_args()

    if args.log_training_run:
        log_training_run()
    elif args.check_drift:
        # Example batch — in practice, feed this real incoming API traffic
        sample_texts = [
            "The government announced a new policy today.",
            "Aliens confirmed to be living among us, insider reveals.",
        ]
        check_drift(sample_texts)
