# Typhoon Impact Prediction System

A full-stack web application for predicting typhoon impacts and performing cluster analysis using K-Prototypes clustering algorithm, specifically designed for post-tropical cyclone impact profiling in the Philippines.

## 🚀 Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable React components
│   └── ...
├── backend/          # FastAPI backend application
│   ├── main.py       # Main API application
│   ├── requirements.txt
│   └── models/       # ML models storage
└── README.md
```

## 🌟 Features

- **Impact Prediction**: Predict typhoon casualties and damage costs using machine learning models
- **Cluster Analysis**: Analyze typhoon patterns using K-Prototypes clustering algorithm  
- **Interactive Dashboard**: Modern web interface built with Next.js and Tailwind CSS
- **Real-time API**: FastAPI backend with automatic model loading and CORS support
- **Historical Data**: Analysis of 500+ typhoons from 2010-2024 across 81 Philippine provinces

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** for state management

### Backend  
- **FastAPI** for REST API
- **scikit-learn** for machine learning
- **joblib** for model serialization
- **Pydantic** for data validation
- **CORS** enabled for frontend integration

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.8+
- npm or yarn
- pip

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory  
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔗 API Endpoints

- `POST /api/predict` - Predict typhoon impact
- `POST /api/cluster` - Perform cluster analysis  
- `GET /api/health` - Health check
- `GET /` - API information

## 📊 Usage

### Prediction
1. Navigate to the Prediction page
2. Fill in typhoon parameters:
   - Typhoon name
   - Province
   - Maximum wind speed (km/h)
   - 24-hour rainfall (mm)
   - Storm duration (hours)
   - Population
3. Click "Get Prediction" to see results

### Clustering
1. Go to the Cluster page
2. View automatic clustering of sample typhoon data
3. Analyze cluster characteristics and typhoon classifications

## 🧪 Model Information

The system uses:
- **Random Forest Regressor** for casualty prediction
- **K-Means Clustering** as placeholder for K-Prototypes
- **Feature engineering** with meteorological and socio-economic data
- **Model persistence** with joblib serialization

## 📁 Project Pages

1. **Home** - Project overview and key statistics
2. **Prediction** - Interactive typhoon impact prediction
3. **Cluster** - Typhoon clustering analysis and visualization  
4. **About Us** - Research team and methodology
5. **Thesis Paper** - Publications and research documentation

## 🔧 Development

### Adding New Features
- Frontend components go in `frontend/components/`
- New pages go in `frontend/app/[page-name]/page.tsx`
- Backend endpoints are added to `backend/main.py`

### Model Updates
- Replace dummy models in `backend/models/` directory
- Update model loading logic in `backend/main.py`
- Ensure model compatibility with existing API interfaces

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For questions about this research or collaboration opportunities:
- Email: research@typhoonimpact.ph
- Research Team: University of the Philippines, Ateneo de Manila, De La Salle University

## 🙏 Acknowledgments

- Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA)
- National Disaster Risk Reduction and Management Council (NDRRMC)
- Department of Science and Technology (DOST)

---

*This system represents ongoing research in typhoon impact prediction and disaster risk reduction in the Philippines.*