"""
Trains Logistic Regression, Random Forest, and Passive Aggressive
classifiers on the WELFake dataset and saves each model + the
vectorizer to models/.
"""
import argparse
import os
import time

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression, PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, f1_score

from preprocess import load_and_clean, vectorize

MODELS = {
    "logistic_regression": LogisticRegression(max_iter=1000),
    "random_forest": RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1),
    "passive_aggressive": PassiveAggressiveClassifier(max_iter=1000, random_state=42),
}


def main(data_path: str, models_dir: str):
    os.makedirs(models_dir, exist_ok=True)

    print("Loading and cleaning data...")
    df = load_and_clean(data_path)

    print("Vectorizing (TF-IDF)...")
    X_train, X_test, y_train, y_test, vectorizer = vectorize(df)
    joblib.dump(vectorizer, os.path.join(models_dir, "vectorizer.pkl"))

    results = {}
    for name, model in MODELS.items():
        print(f"\nTraining {name}...")
        start = time.time()
        model.fit(X_train, y_train)
        elapsed = time.time() - start

        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        f1 = f1_score(y_test, preds)

        print(f"  accuracy={acc:.4f}  f1={f1:.4f}  time={elapsed:.1f}s")
        results[name] = {"accuracy": acc, "f1": f1}

        joblib.dump(model, os.path.join(models_dir, f"{name}.pkl"))

    print("\nSummary:")
    for name, metrics in results.items():
        print(f"  {name}: {metrics}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/WELFake_Dataset.csv")
    parser.add_argument("--models_dir", default="models")
    args = parser.parse_args()
    main(args.data, args.models_dir)
