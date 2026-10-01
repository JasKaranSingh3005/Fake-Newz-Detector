"""
Text cleaning and feature extraction for the WELFake dataset.
"""
import re
import string

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split


def clean_text(text: str) -> str:
    """Lowercase, strip punctuation/numbers/extra whitespace."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"<.*?>+", "", text)
    text = re.sub(r"[%s]" % re.escape(string.punctuation), "", text)
    text = re.sub(r"\n", " ", text)
    text = re.sub(r"\w*\d\w*", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_and_clean(csv_path: str) -> pd.DataFrame:
    """
    Load the WELFake CSV and produce a cleaned dataframe with
    columns: text, label (0 = real, 1 = fake).
    """
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["text"])

    # WELFake ships with separate title/text columns in some releases;
    # combine them if both are present for a stronger signal.
    if "title" in df.columns:
        df["text"] = df["title"].fillna("") + " " + df["text"]

    df["clean_text"] = df["text"].apply(clean_text)
    df = df[df["clean_text"].str.len() > 0]
    return df


def vectorize(df: pd.DataFrame, max_features: int = 5000):
    """Split into train/test and fit a TF-IDF vectorizer on the train set."""
    X_train, X_test, y_train, y_test = train_test_split(
        df["clean_text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )

    vectorizer = TfidfVectorizer(max_features=max_features, stop_words="english")
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    return X_train_vec, X_test_vec, y_train, y_test, vectorizer


if __name__ == "__main__":
    df = load_and_clean("data/WELFake_Dataset.csv")
    print(f"Loaded {len(df)} cleaned articles")
    print(df["label"].value_counts())
