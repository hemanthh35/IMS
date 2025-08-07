import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import axios from 'axios';

const Summarize = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const response = await axios.post('/summarize', {
        text: text
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while summarizing the text.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            AI Text Summarizer
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text to Summarize
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to summarize..."
              rows={6}
              className="input-field resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length} characters
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{loading ? 'Summarizing...' : 'Generate Summary'}</span>
            </button>
            
            {summary && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
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

      {/* Summary Result */}
      {summary && (
        <div className="card border-l-4 border-green-400 bg-green-50">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-medium text-green-800">Summary Generated</h3>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Original: {text.length} characters</span>
            <span>Summary: {summary.length} characters</span>
            <span>Reduction: {Math.round((1 - summary.length / text.length) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card text-center py-8">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating summary with AI...</p>
        </div>
      )}

      {/* Info */}
      <div className="card border-l-4 border-blue-400 bg-blue-50">
        <div className="flex items-start space-x-3">
          <FileText className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              About AI Summarization
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Uses T5-small model for intelligent text summarization</p>
              <p>• Automatically extracts key information and main points</p>
              <p>• Optimized for incident logs and technical documentation</p>
              <p>• Provides concise summaries while preserving important details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarize; 