const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Typhoon Impact System</h3>
            <p className="text-gray-300 text-sm">
              K-Prototypes Clustering Algorithm for Post-Tropical Cyclone Impact 
              Profiling in the Philippines
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/prediction" className="text-gray-300 hover:text-white transition-colors">Prediction</a></li>
              <li><a href="/cluster" className="text-gray-300 hover:text-white transition-colors">Cluster Analysis</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">
              For research inquiries and collaboration opportunities.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Email: research@typhoonimpact.ph
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Typhoon Impact Prediction System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer