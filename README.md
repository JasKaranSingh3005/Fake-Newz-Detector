# Fake News Detection

A machine learning pipeline that classifies news articles as **real** or **fake**, trained on the [WELFake dataset](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) — a merged corpus of ~72,000 articles from four popular fake-news datasets (Kaggle, McIntire, Reuters, BuzzFeed Political).

## Overview

This project compares three classical ML approaches for text classification:

| Model | Notes |
|---|---|
| Logistic Regression | Baseline linear classifier on TF-IDF features |
| Random Forest | Ensemble method, handles non-linear feature interactions |
| Passive Aggressive Classifier | Online learning algorithm, well-suited to text streams |

## Project Structure

```
fake-news-detector/
├── data/                   # Place WELFake_Dataset.csv here (not tracked by git)
├── models/                 # Saved trained models (.pkl) - not tracked by git
├── notebooks/
│   └── exploration.ipynb   # EDA and experimentation
├── src/
│   ├── preprocess.py       # Text cleaning + TF-IDF vectorization
│   ├── train.py            # Trains all three models, saves metrics
│   ├── evaluate.py         # Generates confusion matrix, ROC, classification report
│   └── predict.py          # CLI to classify a single headline/article
├── app.py                  # Streamlit demo app
├── requirements.txt
└── README.md
```

## Setup

```bash
git clone https://github.com/<your-username>/fake-news-detector.git
cd fake-news-detector
pip install -r requirements.txt
```

Download the [WELFake dataset](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) and place `WELFake_Dataset.csv` inside `data/`.

## Usage

**Train all models:**
```bash
python src/train.py
```

**Evaluate on the held-out test set:**
```bash
python src/evaluate.py --model logistic_regression
```

**Classify a single article from the command line:**
```bash
python src/predict.py --text "Scientists confirm the moon is made of cheese"
```

**Run the interactive demo:**
```bash
streamlit run app.py
```

## Results

| Model | Accuracy | F1-score |
|---|---|---|
| Logistic Regression | _fill in_ | _fill in_ |
| Random Forest | _fill in_ | _fill in_ |
| Passive Aggressive | _fill in_ | _fill in_ |

*(Fill this table in with your actual numbers after running `train.py` — or pull them from your original assignment report.)*

## Future Improvements

- Swap TF-IDF for transformer embeddings (BERT / DistilBERT)
- Add explainability (SHAP/LIME) to show which words drove a prediction
- Deploy as a public API (FastAPI + Docker)

## License

MIT
