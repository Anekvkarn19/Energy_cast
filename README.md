# ⚡ EnergyCast — Energy Consumption Forecasting Platform

An end-to-end electricity consumption forecasting platform that combines
time-series machine learning, FastAPI, and React to generate and visualize
24-hour energy demand forecasts.

## 📌 Overview

EnergyCast uses historical electricity consumption data to learn temporal
patterns and predict future energy demand.

The project includes:

- Time-series data preprocessing
- Temporal and lag-based feature engineering
- Random Forest and XGBoost model comparison
- Recursive 24-hour energy forecasting
- FastAPI REST APIs for model inference
- Interactive React dashboard
- Forecast analytics and visualization
- Manual energy consumption prediction

## 🏗️ Architecture

```text
Historical Energy Data
        ↓
Data Cleaning & Preprocessing
        ↓
Feature Engineering
        ↓
Chronological Train/Test Split
        ↓
Random Forest + XGBoost
        ↓
Model Evaluation
        ↓
Saved XGBoost Model
        ↓
FastAPI Backend
        ↓
React Frontend
        ↓
Dashboard / Forecast / Prediction / Analytics

## 🤖 Machine Learning Approach

### Dataset

The project uses the **PJM Hourly Energy Consumption** dataset containing
historical hourly electricity consumption data.

The dataset includes:

- `Datetime` — timestamp of the observation
- `PJME_MW` — electricity consumption in megawatts (MW)

### Data Preprocessing

The following preprocessing steps were performed:

- Converted timestamps into datetime format
- Sorted observations chronologically
- Checked and handled duplicate timestamps
- Verified missing values
- Aggregated duplicate timestamps caused by daylight-saving-time transitions

### Feature Engineering

Temporal, cyclic, and lag-based features were created to capture
electricity consumption patterns.

**Temporal Features**
- Hour
- Day of Week
- Month
- Day of Year

**Cyclic Features**
- Hour sine/cosine encoding
- Month sine/cosine encoding

**Lag Features**
- `Lag_1` — previous hour consumption
- `Lag_24` — consumption 24 hours earlier
- `Lag_168` — consumption 168 hours earlier (one week)

### Train-Test Strategy

Since this is a time-series forecasting problem, the data was split
chronologically rather than randomly.

- **80%** historical data → training
- **20%** later data → testing

This preserves the temporal relationship between past and future
observations and avoids future-data leakage.

### Models

Two regression models were evaluated:

1. **Random Forest Regressor**
2. **XGBoost Regressor**

Both models were trained using the same engineered features and
chronological train-test split.

### Model Selection

XGBoost achieved lower MAE and RMSE and a slightly higher R² on the
one-step-ahead test evaluation, so it was selected for deployment.

## 📊 Model Performance

The models were evaluated using three standard regression metrics:

- **MAE (Mean Absolute Error)** — measures the average absolute prediction error.
- **RMSE (Root Mean Squared Error)** — penalizes larger prediction errors more heavily.
- **R² Score** — measures how much of the variation in energy consumption is explained by the model.

### Results

| Model | MAE (MW) | RMSE (MW) | R² Score |
|---|---:|---:|---:|
| Random Forest | 315.07 | 428.57 | 0.9956 |
| XGBoost | **300.79** | **405.80** | **0.9961** |

XGBoost was selected as the deployed model based on its performance on the chronological test set.

> **Note:** These metrics represent one-step-ahead predictions on the historical test set, where actual lag values are available. The deployed 24-hour forecast uses recursive prediction, where each predicted value is fed into subsequent forecasting steps.

## 🚀 Application Features

### 📊 Dashboard

Provides an overview of the forecasting system with:

- Model performance metrics
- Average forecasted demand
- 24-hour forecast visualization
- Peak demand insights
- Hourly forecast table
- Backend API health status

### 📈 24-Hour Forecast

Generates a recursive forecast for the next 24 hours using the deployed
XGBoost model.

The forecast includes:

- Interactive demand chart
- Peak consumption
- Minimum consumption
- Average consumption
- Hour-by-hour predictions

### 🔮 Manual Prediction

Allows users to enter temporal and lag-based features and obtain an
individual energy consumption prediction through the FastAPI backend.

### 📊 Model Performance

Provides a comparison between Random Forest and XGBoost using:

- MAE
- RMSE
- R² Score

### 📉 Analytics

Provides additional insights into energy consumption patterns, including:

- Average demand
- Peak demand
- Minimum demand
- Hourly demand distribution
- Historical demand patterns

## 🔌 API Endpoints

EnergyCast uses FastAPI to expose the trained machine learning model
through REST APIs.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Returns basic API information |
| GET | `/health` | Checks backend and model health |
| GET | `/metrics` | Returns model evaluation metrics |
| GET | `/forecast` | Generates the next 24 hours of energy consumption forecasts |
| POST | `/predict` | Predicts energy consumption for the provided input features |

### Example Prediction Response

```json
{
  "predicted_energy_consumption_MW": 45949.31
}

## 🛠️ Tech Stack

### Machine Learning & Data Science

- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Matplotlib
- Seaborn
- Joblib

### Backend

- FastAPI
- Uvicorn
- Pydantic

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts
- Axios
- React Router
- Lucide React

### Development & Version Control

- Git
- GitHub
- Jupyter Notebook

## 📁 Project Structure

```text
Energy-Consumption-Forecasting/
│
├── backend/
│   └── main.py
│
├── data/
│   └── PJME_hourly.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── models/
│   ├── xgboost_energy_model.pkl
│   └── feature_info.pkl
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   └── 02_model_comparison.ipynb
│
├── src/
│
├── .gitignore
├── README.md
└── requirements.txt
```

## ▶️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Anekvkarn19/Energy_cast.git
cd Energy_cast
```

### 2. Backend Setup

Create and activate the Python virtual environment:

```bash
python -m venv venv
```

On Windows:

```cmd
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn backend.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 🔄 Forecasting Workflow

The deployed forecasting pipeline works as follows:

```text
Historical Energy Data
        ↓
Feature Engineering
        ↓
Trained XGBoost Model
        ↓
Predict Next Hour
        ↓
Use Prediction as New Lag Value
        ↓
Predict Next Hour
        ↓
Repeat for 24 Hours
        ↓
24-Hour Energy Forecast
```

This recursive approach allows the system to generate a multi-step
24-hour forecast from the latest available historical observations.

## 🔮 Future Enhancements

Potential future improvements include:

- Actual vs Predicted demand visualization
- Peak demand alerts
- Historical trend analysis
- CSV forecast export
- Weather-based forecasting features
- Automated model retraining
- Improved uncertainty estimation

## 👩‍💻 Author

**Anekvarna**

B.Tech — Computer Science & Engineering

Interested in Machine Learning, Full-Stack Development, and Data-Driven Applications.

---

⭐ If you find this project useful, consider giving the repository a star!
