from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from typing import List, Dict, Any, Optional
import json

app = FastAPI(title="Typhoon Casualty Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (frontend)
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Global variables to store loaded model components
model_components = {
    'model': None,
    'scaler': None,
    'feature_names': None,
    'target_names': None,
    'encoders': None,
    'model_info': None
}

# Pydantic models for request/response
class WeatherInput(BaseModel):
    typhoon_name: str = "SAMPLE"
    region: str = "Region II"
    province: str = "CAGAYAN"
    city_municipality: str = "APARRI"
    distance_km: float = 10.0
    max_24hr_rainfall_mm: float = 150.0
    total_storm_rainfall_mm: float = 300.0
    min_pressure_hpa: float = 950.0
    max_sustained_wind_kph: float = 200.0
    duration_in_par_hours: float = 120.0

class PredictionResponse(BaseModel):
    predictions: Dict[str, float]
    interpretation: Dict[str, str]
    risk_level: str
    recommendations: List[str]

class ModelStatus(BaseModel):
    loaded: bool
    model_type: Optional[str] = None
    features_count: Optional[int] = None
    targets_count: Optional[int] = None
    timestamp: Optional[str] = None

def load_model_components(model_dir: str):
    """Load all model components from a directory"""
    global model_components
    
    try:
        # Find the most recent model directory
        model_dirs = [d for d in os.listdir("../models") if d.startswith("MOR_trial1_")]
        if not model_dirs:
            raise Exception("No model directories found")
        
        latest_model_dir = os.path.join("../models", sorted(model_dirs)[-1])
        
        # Load model info first
        model_info_files = [f for f in os.listdir(latest_model_dir) if f.startswith("model_info_")]
        if model_info_files:
            model_info_path = os.path.join(latest_model_dir, model_info_files[0])
            model_components['model_info'] = joblib.load(model_info_path)
            
            # Load other components based on model info
            info = model_components['model_info']
            
            model_path = os.path.join(latest_model_dir, info['model_file'])
            scaler_path = os.path.join(latest_model_dir, info['scaler_file'])
            features_path = os.path.join(latest_model_dir, info['feature_names_file'])
            targets_path = os.path.join(latest_model_dir, info['target_names_file'])
            encoders_path = os.path.join(latest_model_dir, info['encoders_file'])
            
            model_components['model'] = joblib.load(model_path)
            model_components['scaler'] = joblib.load(scaler_path)
            model_components['feature_names'] = joblib.load(features_path)
            model_components['target_names'] = joblib.load(targets_path)
            model_components['encoders'] = joblib.load(encoders_path)
            
            return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def preprocess_input(weather_data: WeatherInput) -> np.ndarray:
    """Preprocess input data to match model expectations"""
    if not all([model_components['scaler'], model_components['feature_names'], model_components['encoders']]):
        raise HTTPException(status_code=500, detail="Model components not properly loaded")
    
    # Create a dictionary with the input data
    data = {
        'Distance_km': weather_data.distance_km,
        'Max_24hr_Rainfall_mm': weather_data.max_24hr_rainfall_mm,
        'Total_Storm_Rainfall_mm': weather_data.total_storm_rainfall_mm,
        'Min_Pressure_hPa': weather_data.min_pressure_hpa,
        'Max_Sustained_Wind_kph': weather_data.max_sustained_wind_kph,
        'Duration_in_PAR_Hours': weather_data.duration_in_par_hours
    }
    
    # Add categorical encodings (simplified for demo)
    encoders = model_components['encoders']
    try:
        # Encode categorical variables
        if 'Typhoon Name' in encoders:
            data['Typhoon Name_encoded'] = 0  # Default encoding for unknown typhoons
        if 'Region' in encoders:
            data['Region_encoded'] = 0  # Default encoding
        if 'Province' in encoders:
            data['Province_encoded'] = 0  # Default encoding
        if 'City/Municipality' in encoders:
            data['City/Municipality_encoded'] = 0  # Default encoding
    except:
        pass
    
    # Add engineered features (using the same logic from the notebook)
    # Wind-based features
    wind_speed = data['Max_Sustained_Wind_kph']
    data['wind_intensity_category'] = 4 if wind_speed > 184 else (3 if wind_speed > 117 else (2 if wind_speed > 88 else (1 if wind_speed > 61 else 0)))
    data['is_super_typhoon'] = 1 if wind_speed > 184 else 0
    data['is_typhoon_plus'] = 1 if wind_speed > 117 else 0
    
    # Rainfall-based features
    rainfall = data['Total_Storm_Rainfall_mm']
    data['rainfall_intensity'] = 4 if rainfall > 400 else (3 if rainfall > 200 else (2 if rainfall > 100 else (1 if rainfall > 50 else 0)))
    data['extreme_rainfall'] = 1 if rainfall > 300 else 0
    
    # Pressure-based features
    pressure = data['Min_Pressure_hPa']
    data['pressure_intensity'] = 1013 - pressure
    data['very_low_pressure'] = 1 if pressure < 950 else 0
    
    # Distance-based features
    distance = data['Distance_km']
    data['is_direct_hit'] = 1 if distance < 10 else 0
    data['is_nearby'] = 1 if distance < 50 else 0
    data['distance_category'] = 4 if distance > 100 else (3 if distance > 50 else (2 if distance > 25 else (1 if distance > 10 else 0)))
    
    # Duration-based features
    duration = data['Duration_in_PAR_Hours']
    data['long_duration'] = 1 if duration > 100 else 0
    data['very_long_duration'] = 1 if duration > 150 else 0
    
    # Interaction features
    data['wind_impact_score'] = wind_speed / (distance + 1)
    data['rainfall_rate'] = rainfall / (duration + 1)
    data['combined_threat_score'] = (wind_speed / 200) + (rainfall / 400)
    
    # Add any missing features with default values
    feature_names = model_components['feature_names']
    for feature in feature_names:
        if feature not in data:
            data[feature] = 0
    
    # Create DataFrame and ensure correct order
    df = pd.DataFrame([data])
    df = df.reindex(columns=feature_names, fill_value=0)
    
    # Scale the features
    scaled_features = model_components['scaler'].transform(df)
    
    return scaled_features

def interpret_predictions(predictions: np.ndarray) -> Dict[str, Any]:
    """Interpret prediction results and provide recommendations"""
    target_names = model_components['target_names']
    pred_dict = {target_names[i]: float(predictions[0][i]) for i in range(len(target_names))}
    
    # Calculate total casualties
    total_casualties = pred_dict.get('Dead', 0) + pred_dict.get('Injured/Ill', 0) + pred_dict.get('Missing', 0)
    affected_families = pred_dict.get('Families', 0)
    
    # Determine risk level
    if total_casualties > 50 or affected_families > 10000:
        risk_level = "EXTREME"
    elif total_casualties > 20 or affected_families > 5000:
        risk_level = "HIGH"
    elif total_casualties > 5 or affected_families > 1000:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"
    
    # Generate interpretation
    interpretation = {}
    for target, value in pred_dict.items():
        if target == 'Dead':
            interpretation[target] = f"Expected fatalities: {value:.0f}"
        elif target == 'Injured/Ill':
            interpretation[target] = f"Expected injuries/illnesses: {value:.0f}"
        elif target == 'Missing':
            interpretation[target] = f"Expected missing persons: {value:.0f}"
        elif target == 'Families':
            interpretation[target] = f"Expected affected families: {value:.0f}"
    
    # Generate recommendations
    recommendations = []
    if risk_level == "EXTREME":
        recommendations.extend([
            "Immediate evacuation of high-risk areas",
            "Deploy emergency response teams",
            "Activate all disaster response protocols",
            "Coordinate with national emergency services",
            "Prepare mass casualty response"
        ])
    elif risk_level == "HIGH":
        recommendations.extend([
            "Issue evacuation warnings for vulnerable areas",
            "Prepare emergency shelters",
            "Alert medical facilities",
            "Position rescue equipment"
        ])
    elif risk_level == "MODERATE":
        recommendations.extend([
            "Issue safety advisories",
            "Prepare emergency supplies",
            "Monitor weather conditions closely"
        ])
    else:
        recommendations.extend([
            "Continue monitoring weather conditions",
            "Ensure emergency preparedness"
        ])
    
    return {
        'predictions': pred_dict,
        'interpretation': interpretation,
        'risk_level': risk_level,
        'recommendations': recommendations
    }

# Initialize model on startup
@app.on_event("startup")
async def startup_event():
    """Load model on application startup"""
    load_model_components("../models")

# API Endpoints
@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    return FileResponse("../frontend/public/index.html")

@app.get("/api/model-status", response_model=ModelStatus)
async def get_model_status():
    """Get the current model loading status"""
    if model_components['model'] is None:
        return ModelStatus(loaded=False)
    
    info = model_components.get('model_info', {})
    return ModelStatus(
        loaded=True,
        model_type=info.get('model_type', 'Unknown'),
        features_count=info.get('n_features', 0),
        targets_count=info.get('n_targets', 0),
        timestamp=info.get('timestamp', 'Unknown')
    )

@app.post("/api/reload-model")
async def reload_model():
    """Reload the model from the latest saved version"""
    success = load_model_components("../models")
    if success:
        return {"message": "Model reloaded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload model")

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_casualties(weather_data: WeatherInput):
    """Predict typhoon casualties based on weather input"""
    if model_components['model'] is None:
        raise HTTPException(status_code=500, detail="No model loaded. Please load a model first.")
    
    try:
        # Preprocess input
        processed_data = preprocess_input(weather_data)
        
        # Make prediction
        predictions = model_components['model'].predict(processed_data)
        
        # Interpret results
        result = interpret_predictions(predictions)
        
        return PredictionResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/api/sample-input")
async def get_sample_input():
    """Get sample input data for testing"""
    return {
        "typhoon_name": "SAMPLE TYPHOON",
        "region": "Region II",
        "province": "CAGAYAN",
        "city_municipality": "APARRI",
        "distance_km": 5.0,
        "max_24hr_rainfall_mm": 200.0,
        "total_storm_rainfall_mm": 400.0,
        "min_pressure_hpa": 930.0,
        "max_sustained_wind_kph": 220.0,
        "duration_in_par_hours": 150.0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)