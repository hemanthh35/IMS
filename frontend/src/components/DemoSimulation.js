import React, { useState } from 'react';
import { Play, CheckCircle, Loader2, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const SCENARIOS = [
  {
    title: 'API Gateway Surge',
    log: `2024-06-20 00:10:12,api-gateway,ERROR,[gateway-core] Surge in 5xx errors detected acrole microservices.\nError trace:\n- Service: user-auth | Code: 502 | Msg: Bad Gateway\n- Service: payment-handler | Code: 504 | Msg: Gateway Timeout\nUpstream latency peaked at 912ms.\nLoad balancer reports backend pool depletion.\nCurrent concurrency: 2800 | Threshold: 2500\nRetry logic triggered 3 times with backoff.\nInvestigate backend readiness checks and scaling thresholdss multips.`
  },
  {
    title: 'Auth Token Failures',
    log: `2024-06-20 00:11:45,auth-service,CRITICAL,[auth-core] Multiple authentication token validation failures observed.\nOIDC session state mismatch from client_id=abc123.\nSample trace ID: xyz456789\nRate of failed logins: 180/minute\nJWT signature verification failing due to key mismatch.\nRecent key rotation not propagated to all nodes.\nRecommend refreshing signing key store and auditing token lifecycle policies.`
  },
  {
    title: 'Disk I/O Throttling',
    log: `2024-06-20 00:13:02,disk-monitor,ERROR,[disk-check] Disk I/O throttling detected on volume /dev/sda1.\nAvg write latency: 740ms\nI/O queue depth > 128 for sustained 5 minutes.\nContainer logs show delayed flush operations.\nFilesystem nearing inode exhaustion: 94% used.\nPotential write amplification from misconfigured log rotation.\nInvestigate disk pressure and consider resizing or balancing volumes.`
  },
  {
    title: 'Network Latency',
    log: `2024-06-20 00:14:38,network-agent,WARN,[network-health] Latency thresholds exceeded for external endpoint check.\nPing to https://status.external-api.com took 2112ms (max allowed: 500ms).\nJitter observed across retries (stddev: 483ms).\nCloud NAT gateway logged egress congestion.\nClients experiencing intermittent TLS handshake timeouts.\nRecommendation: verify external routing paths, NAT capacity, and DNS resolution times.`
  },
  {
    title: 'DB Pool Exhaustion',
    log: `2024-06-20 00:15:55,db-service,CRITICAL,[db-core] Connection pool exhausted for PostgreSQL cluster.\nActive sessions: 150 | Max pool size: 120\nRecent slow queries:\n- SELECT * FROM orders WHERE status='pending' => 18.2s\n- UPDATE users SET active=false WHERE last_seen < NOW()-interval '30d' => 25.9s\nQuery planner hint mismatch detected.\nDeadlock logs indicate wait on advisory locks.\nTune long-running queries and expand connection pool size temporarily.`
  }
];

function parseScenarioLog(log) {
  // Parse the log into fields for the backend
  // Format: timestamp,component,severity,[tag] message\n...
  const [firstLine, ...rest] = log.split('\n');
  const [timestamp, component, severity, ...msgParts] = firstLine.split(',');
  return {
    timestamp: timestamp.replace(' ', 'T'),
    component: component || '',
    severity: (severity || 'medium').toLowerCase(),
    log_text: [msgParts.join(',').trim(), ...rest].join('\n')
  };
}

const DemoSimulation = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);

  const handleSimulate = async (scenario, idx) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveScenario(idx);
    const parsed = parseScenarioLog(scenario.log);
    try {
      // Submit to /predict
      const predictionRes = await axios.post(API_ENDPOINTS.PREDICT, parsed);
      // Submit to /summarize
      const summaryRes = await axios.post(API_ENDPOINTS.SUMMARIZE, { text: parsed.log_text });
      setResult({
        prediction: predictionRes.data.predicted_root_cause,
        summary: summaryRes.data.summary,
        scenario: scenario,
        parsed: parsed
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="card-elevated">
        <h2 className="section-header mb-4">Demo / Simulation</h2>
        <p className="section-subtitle mb-8">Demonstrate real-world incident scenarios and see how the AI system responds in real time.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCENARIOS.map((scenario, idx) => (
            <div key={idx} className={`card transition-all duration-200 ${activeScenario === idx ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900 text-lg">{scenario.title}</h3>
              </div>
              <pre className="bg-slate-50 rounded p-3 text-xs text-slate-700 mb-4 whitespace-pre-wrap max-h-40 overflow-auto border border-slate-100">{scenario.log}</pre>
              <button
                className="btn-accent flex items-center space-x-2"
                onClick={() => handleSimulate(scenario, idx)}
                disabled={loading}
              >
                {loading && activeScenario === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{loading && activeScenario === idx ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="card-elevated border-l-4 border-red-400 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}
      {result && (
        <div className="card-elevated border-l-4 border-green-400 bg-green-50">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-medium text-green-800">Simulation Result</h3>
          </div>
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-1">Scenario:</div>
            <div className="font-semibold text-slate-900 mb-2">{result.scenario.title}</div>
            <pre className="bg-slate-50 rounded p-3 text-xs text-slate-700 whitespace-pre-wrap max-h-32 overflow-auto border border-slate-100">{result.scenario.log}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Predicted Root Cause</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-slate-700">{result.prediction}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">AI Summary</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-slate-700">{result.summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoSimulation; 