import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Typhoon Impact Prediction System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              K-Prototypes Clustering Algorithm for Post-Tropical Cyclone Impact Profiling in the Philippines
            </p>
            <div className="space-x-4">
              <Link href="/prediction" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Try Prediction
              </Link>
              <Link href="/cluster" className="btn-secondary bg-primary-500 text-white hover:bg-primary-400">
                View Clusters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-lg text-gray-600">
              Advanced machine learning for typhoon impact analysis and prediction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact Prediction</h3>
              <p className="text-gray-600">
                Predict typhoon casualties and damage costs using advanced machine learning models
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cluster Analysis</h3>
              <p className="text-gray-600">
                Analyze typhoon patterns and group similar events using K-Prototypes clustering
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Research Data</h3>
              <p className="text-gray-600">
                Access comprehensive typhoon impact data and research findings for the Philippines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Research</h2>
              <p className="text-lg text-gray-600 mb-4">
                This system implements a K-Prototypes clustering algorithm specifically designed 
                for analyzing post-tropical cyclone impacts in the Philippines. By combining 
                categorical and numerical data, our approach provides comprehensive insights 
                into typhoon damage patterns.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                The system processes historical typhoon data including meteorological parameters, 
                geographic information, and impact assessments to generate accurate predictions 
                and identify meaningful clusters of similar events.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Typhoons Analyzed</span>
                  <span className="font-semibold text-primary-600">500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Provinces Covered</span>
                  <span className="font-semibold text-primary-600">81</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years of Data</span>
                  <span className="font-semibold text-primary-600">2010-2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prediction Accuracy</span>
                  <span className="font-semibold text-secondary-600">85%+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}