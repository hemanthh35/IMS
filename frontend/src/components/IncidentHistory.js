import React, { useState, useEffect } from 'react';
import { History, Loader2, AlertCircle, Clock, AlertTriangle, Filter } from 'lucide-react';
import axios from 'axios';

const IncidentHistory = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('/history');
      setIncidents(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load incident history.');
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

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === 'all' || incident.severity.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      incident.log_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.predicted_root_cause.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="card text-center py-8">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading incident history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-l-4 border-red-400 bg-red-50">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Incident History
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <History className="w-4 h-4" />
            <span>{incidents.length} total incidents</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incidents..."
              className="input-field"
            />
          </div>
          
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </span>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <div className="card text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {incidents.length === 0 ? 'No Incidents Found' : 'No Matching Incidents'}
          </h3>
          <p className="text-gray-500">
            {incidents.length === 0 
              ? 'Start by reporting a new incident to see it here.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="text-sm text-gray-500">
                        {incident.component}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {incident.log_text}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Root Cause:</span>
                      <span className="text-gray-700">{incident.predicted_root_cause}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimestamp(incident.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentHistory; 