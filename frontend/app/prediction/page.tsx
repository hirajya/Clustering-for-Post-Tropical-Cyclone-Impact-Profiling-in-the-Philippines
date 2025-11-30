'use client'

import { useState } from 'react'

interface PredictionResult {
  predicted_casualties: number
  predicted_damage_cost: number
  risk_level: string
  confidence: number
}

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    typhoon_name: '',
    province: '',
    max_wind_speed: '',
    rainfall_24hr: '',
    storm_duration: '',
    population: ''
  })
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const requestData = {
        typhoon_name: formData.typhoon_name,
        province: formData.province,
        max_wind_speed: parseFloat(formData.max_wind_speed),
        rainfall_24hr: parseFloat(formData.rainfall_24hr),
        storm_duration: parseInt(formData.storm_duration),
        population: parseInt(formData.population)
      }

      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const result: PredictionResult = await response.json()
      setPrediction(result)
    } catch (err) {
      setError('Failed to get prediction. Please check if the backend server is running.')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const provinces = [
    'Manila', 'Cebu', 'Davao', 'Quezon', 'Batangas', 'Negros Oriental', 'Zamboanga del Sur',
    'Cagayan', 'Pangasinan', 'Bulacan', 'Nueva Ecija', 'Leyte', 'Samar', 'Albay'
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Typhoon Impact Prediction</h1>
          <p className="text-lg text-gray-600">
            Enter typhoon parameters to predict potential casualties and damage costs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Input Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Typhoon Name</label>
                <input
                  type="text"
                  name="typhoon_name"
                  value={formData.typhoon_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Yolanda, Ondoy, etc."
                  required
                />
              </div>

              <div>
                <label className="form-label">Province</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Max Wind Speed (km/h)</label>
                  <input
                    type="number"
                    name="max_wind_speed"
                    value={formData.max_wind_speed}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 185"
                    min="0"
                    max="300"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">24hr Rainfall (mm)</label>
                  <input
                    type="number"
                    name="rainfall_24hr"
                    value={formData.rainfall_24hr}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 400"
                    min="0"
                    max="2000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Storm Duration (hours)</label>
                  <input
                    type="number"
                    name="storm_duration"
                    value={formData.storm_duration}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 72"
                    min="1"
                    max="500"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Population</label>
                  <input
                    type="number"
                    name="population"
                    value={formData.population}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 1000000"
                    min="1000"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Predicting...' : 'Get Prediction'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Prediction Results</h2>
            
            {prediction ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Predicted Casualties</h3>
                    <p className="text-2xl font-bold text-gray-900">{prediction.predicted_casualties}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Damage Cost</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      ₱{prediction.predicted_damage_cost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Risk Level</h3>
                    <div className="flex items-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          prediction.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                          prediction.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {prediction.risk_level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Confidence</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Interpretation</h3>
                  <p className="text-sm text-blue-800">
                    Based on the input parameters, this typhoon has a <strong>{prediction.risk_level.toLowerCase()}</strong> risk profile
                    with an estimated impact of <strong>{prediction.predicted_casualties}</strong> casualties and 
                    <strong> ₱{prediction.predicted_damage_cost.toLocaleString()}</strong> in damages.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">Enter typhoon parameters and click "Get Prediction" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}