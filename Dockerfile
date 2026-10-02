FROM python:3.11-slim

WORKDIR /app

# git-lfs is required because models/random_forest.pkl is stored via
# Git LFS — Render's default Docker build context only checks out
# LFS *pointer* files, not the real binaries, so we resolve them
# explicitly below.
RUN apt-get update && apt-get install -y --no-install-recommends git git-lfs \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt fastapi "uvicorn[standard]" pydantic

#COPY . .
#RUN git lfs install --local \
#    && (git lfs pull || echo "git lfs pull failed or repo has no .git context — see README if models/*.pkl are pointer stubs")

# The API needs trained model + vectorizer .pkl files present in
# models/ at build time — run `python src/train.py` and commit the
# resulting files before building this image. See README.

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT}"]
