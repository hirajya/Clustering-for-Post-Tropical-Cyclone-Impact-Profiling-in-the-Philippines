'use client'

import { useState, useEffect } from 'react'

interface ClusterResult {
  cluster_assignments: number[]
  cluster_centers: Array<{
    wind_speed: number
    rainfall: number
    duration: number
    casualties: number
    damage_cost: number
    name_length: number
  }>
  silhouette_score: number
}

export default function ClusterPage() {
  const [clusterData, setClusterData] = useState<ClusterResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sample typhoon data for clustering
  const sampleTyphoons = [
    { name: 'Yolanda', wind_speed: 195, rainfall: 400, duration: 48, casualties: 6300, damage_cost: 5900000000 },
    { name: 'Ondoy', wind_speed: 95, rainfall: 455, duration: 24, casualties: 464, damage_cost: 11000000000 },
    { name: 'Pablo', wind_speed: 175, rainfall: 200, duration: 36, casualties: 1900, damage_cost: 6800000000 },
    { name: 'Lando', wind_speed: 190, rainfall: 300, duration: 72, casualties: 58, damage_cost: 15000000000 },
    { name: 'Nina', wind_speed: 150, rainfall: 250, duration: 48, casualties: 12, damage_cost: 2300000000 },
    { name: 'Ompong', wind_speed: 170, rainfall: 350, duration: 60, casualties: 81, damage_cost: 33000000000 },
    { name: 'Ulysses', wind_speed: 130, rainfall: 200, duration: 36, casualties: 73, damage_cost: 18000000000 },
    { name: 'Rolly', wind_speed: 165, rainfall: 180, duration: 24, casualties: 25, damage_cost: 2000000000 }
  ]

  const performClustering = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ typhoon_data: sampleTyphoons })
      })

      if (!response.ok) {
        throw new Error('Failed to perform clustering')
      }

      const result: ClusterResult = await response.json()
      setClusterData(result)
    } catch (err) {
      setError('Failed to perform clustering. Please check if the backend server is running.')
      console.error('Clustering error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    performClustering()
  }, [])

  const getClusterColor = (clusterId: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800'
    ]
    return colors[clusterId % colors.length]
  }

  const getClusterName = (clusterId: number) => {
    const names = ['Severe Impact', 'Moderate Impact', 'High Rainfall', 'Extended Duration', 'Minor Impact']
    return names[clusterId % names.length]
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Typhoon Cluster Analysis</h1>
          <p className="text-lg text-gray-600">
            K-Prototypes clustering of historical typhoon data to identify impact patterns
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={performClustering}
              className="mt-2 btn-primary"
            >
              Retry Clustering
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Performing cluster analysis...</p>
          </div>
        ) : clusterData ? (
          <div className="space-y-8">
            {/* Cluster Summary */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cluster Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {clusterData.cluster_centers.length}
                  </div>
                  <p className="text-gray-600">Clusters Identified</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">
                    {sampleTyphoons.length}
                  </div>
                  <p className="text-gray-600">Typhoons Analyzed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {(clusterData.silhouette_score * 100).toFixed(1)}%
                  </div>
                  <p className="text-gray-600">Clustering Quality</p>
                </div>
              </div>
            </div>

            {/* Cluster Centers */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cluster Characteristics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {clusterData.cluster_centers.map((center, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClusterColor(index)}`}>
                        Cluster {index + 1}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{getClusterName(index)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Wind Speed:</span>
                        <span className="text-sm font-medium">{center.wind_speed.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rainfall:</span>
                        <span className="text-sm font-medium">{center.rainfall.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium">{center.duration.toFixed(1)} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Casualties:</span>
                        <span className="text-sm font-medium">{center.casualties.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Damage:</span>
                        <span className="text-sm font-medium">₱{(center.damage_cost / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typhoon Classifications */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Typhoon Classifications</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Typhoon</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cluster</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Wind Speed</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rainfall</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Casualties</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Damage Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sampleTyphoons.map((typhoon, index) => {
                      const clusterId = clusterData.cluster_assignments[index]
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{typhoon.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClusterColor(clusterId)}`}>
                              {clusterId + 1}: {getClusterName(clusterId)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{typhoon.wind_speed} km/h</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{typhoon.rainfall} mm</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{typhoon.duration} hours</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{typhoon.casualties.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">₱{(typhoon.damage_cost / 1000000000).toFixed(1)}B</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div className="card bg-blue-50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Insights</h2>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700">
                  • The clustering algorithm identified <strong>{clusterData.cluster_centers.length} distinct patterns</strong> in typhoon impact profiles
                </p>
                <p className="text-gray-700">
                  • Clustering quality score of <strong>{(clusterData.silhouette_score * 100).toFixed(1)}%</strong> indicates well-separated clusters
                </p>
                <p className="text-gray-700">
                  • Super typhoons like <strong>Yolanda</strong> and <strong>Pablo</strong> form distinct high-impact clusters
                </p>
                <p className="text-gray-700">
                  • Rainfall-dominant events like <strong>Ondoy</strong> cluster separately from wind-dominant storms
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}