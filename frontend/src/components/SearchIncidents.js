import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const SearchIncidents = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await axios.post(API_ENDPOINTS.SEARCH, {
        log_text: query
      });
      setResults(response.data.similar_incidents);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'text-red-800 bg-red-100';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search Similar Incidents
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Query
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter incident description to find similar cases..."
                className="input-field pr-10"
                required
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="card border-l-4 border-red-400 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Similar Incidents Found
            </h3>
            <span className="text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-4">
            {results.map((incident, index) => (
              <div key={index} className="card hover:shadow-md transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Incident #{index + 1}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {incident.log_text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Root Cause:</span>
                        <span className="text-gray-700">{incident.root_cause}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Similarity Score</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && query && !error && (
        <div className="card text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Similar Incidents Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search query or use different keywords.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card text-center py-8">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Searching for similar incidents...</p>
        </div>
      )}
    </div>
  );
};

export default SearchIncidents; 