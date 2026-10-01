"""
Loads a saved model and produces a classification report + confusion
matrix plot for the held-out test split.
"""
import argparse
import os

import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

from preprocess import load_and_clean, vectorize


def main(model_name: str, data_path: str, models_dir: str):
    df = load_and_clean(data_path)
    _, X_test, _, y_test, _ = vectorize(df)

    # Re-vectorize test set with the saved vectorizer for consistency
    vectorizer = joblib.load(os.path.join(models_dir, "vectorizer.pkl"))
    model = joblib.load(os.path.join(models_dir, f"{model_name}.pkl"))

    preds = model.predict(X_test)

    # WELFake convention: label 0 = fake, label 1 = real — sklearn orders
    # by sorted label value, so index 0 here must be "Fake", not "Real".
    print(classification_report(y_test, preds, target_names=["Real", "Fake"]))

    cm = confusion_matrix(y_test, preds)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["Real", "Fake"], yticklabels=["Real", "Fake"])
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title(f"Confusion Matrix — {model_name}")
    plt.tight_layout()

    out_path = f"models/{model_name}_confusion_matrix.png"
    plt.savefig(out_path)
    print(f"Saved confusion matrix to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True,
                         choices=["logistic_regression", "random_forest", "passive_aggressive"])
    parser.add_argument("--data", default="data/WELFake_Dataset.csv")
    parser.add_argument("--models_dir", default="models")
    args = parser.parse_args()
    main(args.model, args.data, args.models_dir)
