# Multi-Output Regression Model - MOR_trial1_20251127_132712

## Model Information
- **Created**: 2025-11-27 13:27:12
- **Model Type**: MultiOutputRegressor with XGBRegressor
- **Features**: 30
- **Targets**: 4 (Dead, Injured/Ill, Missing, Families)
- **Dataset Size**: 1776 samples
- **Train/Test Split**: 1420/356

## Performance Metrics (Test Set)
- **Dead**: MAE=0.7163, RMSE=4.9900
- **Injured/Ill**: MAE=0.5455, RMSE=2.2439
- **Missing**: MAE=0.0265, RMSE=0.2361
- **Families**: MAE=334.1824, RMSE=1926.8019

## Overall Performance
- **Average MAE**: 83.8677
- **Average RMSE**: 483.5680

## Files in this Directory
- `multi_output_xgb_model_20251127_132712.joblib`: Trained multi-output XGBoost model
- `weather_scaler_20251127_132712.joblib`: Feature scaler (StandardScaler)
- `feature_names_20251127_132712.joblib`: Feature names list
- `target_names_20251127_132712.joblib`: Target names list
- `label_encoders_20251127_132712.joblib`: Label encoders for categorical features
- `model_info_20251127_132712.joblib`: Model metadata and configuration
- `casualty_predictions_20251127_132712.csv`: Test set predictions vs actual values
- `model_evaluation_metrics_20251127_132712.csv`: Detailed evaluation metrics
- `feature_importance_20251127_132712.csv`: Feature importance scores
- `README.md`: This file

## Loading the Model
```python
import joblib
import os

# Set the model directory
model_dir = '../../models/MOR_trial1_20251127_132712'

# Load model components
model_info = joblib.load(os.path.join(model_dir, 'model_info_20251127_132712.joblib'))
model = joblib.load(os.path.join(model_dir, 'multi_output_xgb_model_20251127_132712.joblib'))
scaler = joblib.load(os.path.join(model_dir, 'weather_scaler_20251127_132712.joblib'))
feature_names = joblib.load(os.path.join(model_dir, 'feature_names_20251127_132712.joblib'))
target_names = joblib.load(os.path.join(model_dir, 'target_names_20251127_132712.joblib'))
encoders = joblib.load(os.path.join(model_dir, 'label_encoders_20251127_132712.joblib'))

# Example prediction
# X_new_scaled = scaler.transform(X_new)
# predictions = model.predict(X_new_scaled)
```
