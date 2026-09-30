from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np


app = FastAPI(
    title="Energy Consumption Forecasting API",
    description="API for energy consumption prediction and 24-hour forecasting",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load trained model
# -----------------------------
model = joblib.load("models/xgboost_energy_model.pkl")


# -----------------------------
# Load historical energy data
# -----------------------------
df = pd.read_csv("data/PJME_hourly.csv")

df["Datetime"] = pd.to_datetime(df["Datetime"])

# Handle duplicate timestamps
df = (
    df.groupby("Datetime", as_index=False)["PJME_MW"]
    .mean()
    .sort_values("Datetime")
    .reset_index(drop=True)
)


# -----------------------------
# Features used by ML model
# -----------------------------
features = [
    "Hour",
    "DayOfWeek",
    "Month",
    "DayOfYear",
    "Hour_sin",
    "Hour_cos",
    "Month_sin",
    "Month_cos",
    "Lag_1",
    "Lag_24",
    "Lag_168"
]


# -----------------------------
# Helper function
# -----------------------------
def create_features(timestamp, lag_1, lag_24, lag_168):

    hour = timestamp.hour
    day_of_week = timestamp.dayofweek
    month = timestamp.month
    day_of_year = timestamp.dayofyear

    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)

    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)

    return [[
        hour,
        day_of_week,
        month,
        day_of_year,
        hour_sin,
        hour_cos,
        month_sin,
        month_cos,
        lag_1,
        lag_24,
        lag_168
    ]]


# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "Energy Consumption Forecasting API is running!"
    }


# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": "XGBoost"
    }
@app.get("/metrics")
def metrics():

    return {
        "model": "XGBoost",
        "mae": 300.79,
        "rmse": 405.80,
        "r2": 0.9961
    }


# -----------------------------
# Single Prediction
# -----------------------------
class PredictionInput(BaseModel):
    Hour: int
    DayOfWeek: int
    Month: int
    DayOfYear: int
    Hour_sin: float
    Hour_cos: float
    Month_sin: float
    Month_cos: float
    Lag_1: float
    Lag_24: float
    Lag_168: float


@app.post("/predict")
def predict(data: PredictionInput):

    input_data = [[
        data.Hour,
        data.DayOfWeek,
        data.Month,
        data.DayOfYear,
        data.Hour_sin,
        data.Hour_cos,
        data.Month_sin,
        data.Month_cos,
        data.Lag_1,
        data.Lag_24,
        data.Lag_168
    ]]

    prediction = model.predict(input_data)[0]

    return {
        "predicted_energy_consumption_MW": round(float(prediction), 2)
    }


# -----------------------------
# 24-Hour Forecast
# -----------------------------
@app.get("/forecast")
def forecast():

    # Get last 168 historical consumption values
    history = df["PJME_MW"].tolist()

    last_timestamp = df["Datetime"].iloc[-1]

    predictions = []

    # Generate next 24 hours
    for i in range(1, 25):

        future_timestamp = last_timestamp + pd.Timedelta(hours=i)

        lag_1 = history[-1]
        lag_24 = history[-24]
        lag_168 = history[-168]

        input_features = create_features(
            future_timestamp,
            lag_1,
            lag_24,
            lag_168
        )

        prediction = model.predict(input_features)[0]

        prediction = float(prediction)

        predictions.append({
            "datetime": future_timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "predicted_MW": round(prediction, 2)
        })

        # Add prediction to history
        # so next hour can use it as Lag_1
        history.append(prediction)

    return {
        "forecast_horizon": "24 hours",
        "last_historical_timestamp": str(last_timestamp),
        "forecast": predictions
    }