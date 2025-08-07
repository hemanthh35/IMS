import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, FileText, Edit3 } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    component: '',
    severity: 'medium',
    log_text: ''
  });

  const [rawLogText, setRawLogText] = useState('');
  const [inputMode, setInputMode] = useState('manual'); // 'manual' or 'paste'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const severityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' },
    { value: 'critical', label: 'Critical', color: 'text-red-800 bg-red-200' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parseLogText = (text) => {
    // Simple parsing logic - can be enhanced based on your log format
    if (!text || typeof text !== 'string') {
      return {
        timestamp: new Date().toISOString().slice(0, 16),
        component: '',
        severity: 'medium',
        log_text: text || ''
      };
    }

    const lines = text.split('\n').filter(line => line.trim());
    
    let parsed = {
      timestamp: new Date().toISOString().slice(0, 16),
      component: '',
      severity: 'medium',
      log_text: text
    };

    // Try to extract timestamp from first line
    if (lines.length > 0) {
      const timestampMatch = lines[0]?.match(/(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2})/);
      if (timestampMatch) {
        parsed.timestamp = timestampMatch[1].replace(' ', 'T');
      }
    }

    // Try to extract component/service name
    const componentPatterns = [
      /\[([^\]]+)\]/g, // [ComponentName]
      /service[:\s]+([^\s]+)/gi, // service: name
      /component[:\s]+([^\s]+)/gi, // component: name
      /([A-Z][a-z]+Service)/g, // CamelCaseService
    ];

    if (lines.length > 0) {
      for (const pattern of componentPatterns) {
        const match = lines[0]?.match(pattern);
        if (match) {
          parsed.component = match[1] || match[0];
          break;
        }
      }
    }

    // Try to extract severity
    const severityPatterns = [
      /(critical|high|medium|low)/gi,
      /(error|warning|info|debug)/gi,
    ];

    const textLower = text.toLowerCase();
    for (const pattern of severityPatterns) {
      const match = textLower.match(pattern);
      if (match && match[1]) {
        const severity = match[1].toLowerCase();
        if (severity === 'error' || severity === 'critical') parsed.severity = 'critical';
        else if (severity === 'warning' || severity === 'high') parsed.severity = 'high';
        else if (severity === 'info' || severity === 'medium') parsed.severity = 'medium';
        else if (severity === 'debug' || severity === 'low') parsed.severity = 'low';
        break;
      }
    }

    return parsed;
  };

  const handlePasteLog = () => {
    if (!rawLogText.trim()) return;
    
    const parsed = parseLogText(rawLogText);
    setFormData(parsed);
    setInputMode('manual');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Get prediction
      const predictionResponse = await axios.post(API_ENDPOINTS.PREDICT, formData);
      
      // Get summary
      const summaryResponse = await axios.post(API_ENDPOINTS.SUMMARIZE, {
        text: formData.log_text
      });

      setResults({
        prediction: predictionResponse.data.predicted_root_cause,
        summary: summaryResponse.data.summary
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while processing the incident.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      timestamp: new Date().toISOString().slice(0, 16),
      component: '',
      severity: 'medium',
      log_text: ''
    });
    setRawLogText('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Report New Incident
        </h2>

        {/* Input Mode Toggle */}
        <div className="flex space-x-2 mb-6">
          <button
            type="button"
            onClick={() => setInputMode('manual')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              inputMode === 'manual'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Manual Form</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('paste')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              inputMode === 'paste'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Log</span>
          </button>
        </div>

        {inputMode === 'paste' ? (
          /* Paste Log Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste Raw Log Text
              </label>
              <textarea
                value={rawLogText}
                onChange={(e) => setRawLogText(e.target.value)}
                placeholder="Paste your incident log here... The system will try to automatically extract timestamp, component, and severity."
                rows={8}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {rawLogText.length} characters
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePasteLog}
                disabled={!rawLogText.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>Parse & Fill Form</span>
              </button>
              <button
                type="button"
                onClick={() => setRawLogText('')}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          /* Manual Form Mode */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={formData.timestamp}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component
                </label>
                <input
                  type="text"
                  name="component"
                  value={formData.component}
                  onChange={handleInputChange}
                  placeholder="e.g., Authentication Service, Database, API Gateway"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="input-field"
              >
                {severityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Text
              </label>
              <textarea
                name="log_text"
                value={formData.log_text}
                onChange={handleInputChange}
                placeholder="Describe the incident in detail..."
                rows={4}
                className="input-field resize-none"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Processing...' : 'Analyze Incident'}</span>
              </button>
              
              {results && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  New Incident
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Results */}
      {error && (
        <div className="card border-l-4 border-red-400 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="card border-l-4 border-green-400 bg-green-50">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-green-800">Analysis Complete</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Predicted Root Cause</h4>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">{results.prediction}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">AI Summary</h4>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">{results.summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentForm; 