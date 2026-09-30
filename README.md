# TruthLens — AI Fake News Detector

Classifies news headlines and articles as **REAL** or **FAKE**, trained on the [WELFake dataset](https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification) (~72,000 articles merged from Kaggle, McIntire, Reuters, and BuzzFeed Political).

## Architecture

```
React + TypeScript (Vite/Tailwind)  →  FastAPI backend  →  scikit-learn models
        frontend/                         api.py              models/*.pkl
```

Three interchangeable models are available at request time:

| Model | Notes |
|---|---|
| Logistic Regression | TF-IDF based linear classifier — baseline |
| Random Forest | Ensemble method, captures nonlinear patterns |
| Passive Aggressive | Online-learning classifier for large-scale text |

*Evaluation metrics (accuracy/F1) are not yet published in this README — pull them from your own training run's output, or run `src/evaluate.py`, and fill in the table above.*

## Project Structure

```
.
├── frontend/                # React + TS + Vite + Tailwind app
│   ├── src/components/      # Hero, Detector, Models, HowItWorks, About, Footer
│   ├── src/lib/api.ts       # Typed client for the FastAPI backend
│   └── .env.example
├── src/
│   ├── preprocess.py        # Text cleaning + TF-IDF vectorization
│   ├── train.py             # Trains all three models
│   └── evaluate.py          # Classification report + confusion matrix
├── tests/                   # pytest suite for preprocessing + API
├── api.py                   # FastAPI backend (CORS-enabled)
├── app.py                   # Streamlit demo (kept alongside the React app)
├── Dockerfile                # Backend container
├── render.yaml                # Render deployment config for the backend
├── .env.example                # Backend environment variables
└── .github/workflows/ci.yml   # Tests backend + builds frontend on every push
```

## Local Development

### Backend

```bash
pip install -r requirements.txt
uvicorn api:app --reload     # http://localhost:8000, docs at /docs
```

Trained models are already committed in `models/`. To retrain from scratch: `python src/train.py` (requires the WELFake CSV in `data/`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:8000
npm run dev                  # http://localhost:5173
```

## Environment Variables

**Backend** (`.env`, see `.env.example`):
- `CORS_ORIGINS` — comma-separated allowed origins, or `*` for local dev
- `MODELS_DIR` — defaults to `models`

**Frontend** (`frontend/.env`, see `frontend/.env.example`):
- `VITE_API_URL` — the backend's base URL

## Docker

```bash
docker build -t truthlens-api .
docker run -p 8000:8000 -e CORS_ORIGINS="*" truthlens-api
```

*Note: the image needs `models/*.pkl` present at build time — see Limitations.*

## Deployment

**Backend → Render** (`render.yaml` included): connect the repo, Render builds from the `Dockerfile`. Set `CORS_ORIGINS` to your deployed frontend URL.

<<<<<<< HEAD
**Frontend → Vercel/Netlify**: point at `frontend/`, build command `npm run build`, output directory `frontend/dist`. Set `VITE_API_URL` to your deployed backend URL.

*Deployed URLs are not filled in below — this repo has not been deployed yet. Fill these in after you deploy:*
- API URL: `_not yet deployed_`
- Frontend URL: `_not yet deployed_`
=======
| Model | Accuracy | F1-score |
|---|---|---|
| Logistic Regression | 0.9370231654875849 | 0.9391991428954064 |
| Random Forest | 0.949993064225274 | 0.9521280127481575 |
| Passive Aggressive | 0.9368844499930642 | 0.9393090569561158 |
>>>>>>> 40bd556601ad2ab5b91185aa08f138fd6a3e133e

## API Endpoints

- `GET /` — health check
- `GET /models` — list available models
- `POST /predict` — `{"text": "...", "model": "logistic_regression"}` → `{"label": "REAL"|"FAKE", "confidence": 0.0-1.0, "model_used": "..."}`

Interactive docs at `/docs` once the backend is running.

## Limitations

- **No evaluation metrics are published yet** — the Models section intentionally shows no accuracy/F1 numbers until you fill them in from your own training run.
- **`models/random_forest.pkl` is tracked with Git LFS** (~150MB, over GitHub's 100MB plain-file limit). Run `git lfs install` before cloning/pulling, or the file will come through as a pointer stub instead of the real model.
- **scikit-learn is pinned to `1.8.0`** in `requirements.txt` to match the version the committed models were trained with — bumping it may print `InconsistentVersionWarning` or change prediction behavior subtly. Retrain and re-pin if you upgrade.
- This tool provides probabilistic ML classifications and does not independently verify factual claims. Confidence reflects the model's prediction probability, not factual certainty.

## License

MIT
