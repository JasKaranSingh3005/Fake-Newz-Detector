from fastapi.testclient import TestClient

from api import app

client = TestClient(app)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_models():
    response = client.get("/models")
    assert response.status_code == 200
    assert "logistic_regression" in response.json()["available_models"]


def test_predict_empty_text_rejected():
    response = client.post("/predict", json={"text": "", "model": "logistic_regression"})
    assert response.status_code in (400, 422)  # 422 from Pydantic min_length


def test_predict_invalid_model_rejected():
    # If models aren't trained yet, get_vectorizer() 503s before the model-name
    # check would run — both are valid "can't fulfill this" responses.
    response = client.post("/predict", json={"text": "some news", "model": "not_a_real_model"})
    assert response.status_code in (400, 503)


def test_predict_missing_model_file():
    # Requesting a model name that IS in AVAILABLE_MODELS but has no .pkl
    # committed yet should 503 (vectorizer missing) or 404 (model missing),
    # never crash with a 500.
    response = client.post("/predict", json={"text": "some news", "model": "logistic_regression"})
    assert response.status_code in (200, 404, 503)


# Full success-path test — requires trained model artifacts, which are
# now committed to models/.
def test_predict_success():
    response = client.post(
        "/predict",
        json={"text": "Scientists confirm the moon is made of cheese", "model": "logistic_regression"},
    )
    assert response.status_code == 200
    assert response.json()["label"] in ["REAL", "FAKE"]


def test_predict_all_models_respond():
    for model_name in ["logistic_regression", "random_forest", "passive_aggressive"]:
        response = client.post(
            "/predict",
            json={"text": "The city council approved the annual budget on Tuesday.", "model": model_name},
        )
        assert response.status_code == 200
        assert response.json()["label"] in ["REAL", "FAKE"]
        assert response.json()["model_used"] == model_name
