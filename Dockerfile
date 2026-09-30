FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt fastapi "uvicorn[standard]" pydantic

COPY src/ ./src/
COPY api.py .
COPY models/ ./models/

# The API needs trained model + vectorizer .pkl files present in
# models/ at build time — run `python src/train.py` and commit the
# resulting files before building this image. See README.

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT}"]
