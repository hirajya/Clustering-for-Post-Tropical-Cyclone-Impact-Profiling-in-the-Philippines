from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import os

app = FastAPI(
    title="Typhoon Impact Prediction API",
    description="API for predicting typhoon impacts and clustering analysis",
    version="1.0.0"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    typhoon_name: str
    province: str
    max_wind_speed: float
    rainfall_24hr: float
    storm_duration: int
    population: int

class PredictionResponse(BaseModel):
    predicted_casualties: int
    predicted_damage_cost: float
    risk_level: str
    confidence: float

class ClusterRequest(BaseModel):
    typhoon_data: List[Dict[str, Any]]

class ClusterResponse(BaseModel):
    cluster_assignments: List[int]
    cluster_centers: List[Dict[str, float]]
    silhouette_score: float

# Load models (create dummy ones if not exist)
def load_or_create_models():
    """Load existing models or create dummy ones for demonstration"""
    models = {}
    
    try:
        # Try to load existing models
        models['prediction'] = joblib.load('models/prediction_model.joblib')
        models['clustering'] = joblib.load('models/clustering_model.joblib')
    except:
        # Create dummy models if files don't exist
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.cluster import KMeans
        
        # Create dummy prediction model
        dummy_X = np.random.rand(100, 6)  # 6 features
        dummy_y = np.random.randint(0, 100, 100)  # casualty prediction
        prediction_model = RandomForestRegressor(n_estimators=10, random_state=42)
        prediction_model.fit(dummy_X, dummy_y)
        
        # Create dummy clustering model
        cluster_model = KMeans(n_clusters=5, random_state=42)
        cluster_model.fit(dummy_X)
        
        models['prediction'] = prediction_model
        models['clustering'] = cluster_model
        
        # Save models
        os.makedirs('models', exist_ok=True)
        joblib.dump(prediction_model, 'models/prediction_model.joblib')
        joblib.dump(cluster_model, 'models/clustering_model.joblib')
    
    return models

# Load models at startup
models = load_or_create_models()

@app.get("/")
async def root():
    return {"message": "Typhoon Impact Prediction API", "status": "active"}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_impact(request: PredictionRequest):
    """Predict typhoon impact based on input features"""
    try:
        # Prepare features for prediction
        features = np.array([[
            request.max_wind_speed,
            request.rainfall_24hr,
            request.storm_duration,
            request.population,
            hash(request.province) % 100,  # Province encoding
            len(request.typhoon_name)  # Simple typhoon name feature
        ]])
        
        # Make prediction
        prediction = models['prediction'].predict(features)[0]
        
        # Calculate risk level based on prediction
        if prediction < 10:
            risk_level = "Low"
            confidence = 0.85
        elif prediction < 50:
            risk_level = "Medium"
            confidence = 0.78
        else:
            risk_level = "High"
            confidence = 0.92
        
        # Calculate estimated damage cost (simplified)
        damage_cost = prediction * 50000 + (request.max_wind_speed * 1000)
        
        return PredictionResponse(
            predicted_casualties=int(prediction),
            predicted_damage_cost=float(damage_cost),
            risk_level=risk_level,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/cluster", response_model=ClusterResponse)
async def cluster_analysis(request: ClusterRequest):
    """Perform clustering analysis on typhoon data"""
    try:
        if not request.typhoon_data:
            raise HTTPException(status_code=400, detail="No typhoon data provided")
        
        # Convert typhoon data to features matrix
        features_list = []
        for typhoon in request.typhoon_data:
            features = [
                typhoon.get('wind_speed', 0),
                typhoon.get('rainfall', 0),
                typhoon.get('duration', 0),
                typhoon.get('casualties', 0),
                typhoon.get('damage_cost', 0),
                len(typhoon.get('name', ''))
            ]
            features_list.append(features)
        
        features_matrix = np.array(features_list)
        
        # Perform clustering
        cluster_assignments = models['clustering'].predict(features_matrix).tolist()
        
        # Get cluster centers
        centers = models['clustering'].cluster_centers_
        cluster_centers = []
        feature_names = ['wind_speed', 'rainfall', 'duration', 'casualties', 'damage_cost', 'name_length']
        
        for center in centers:
            center_dict = {name: float(value) for name, value in zip(feature_names, center)}
            cluster_centers.append(center_dict)
        
        # Calculate dummy silhouette score
        silhouette_score = 0.75 + (np.random.random() * 0.2)  # Dummy score between 0.75-0.95
        
        return ClusterResponse(
            cluster_assignments=cluster_assignments,
            cluster_centers=cluster_centers,
            silhouette_score=silhouette_score
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "models_loaded": len(models)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)