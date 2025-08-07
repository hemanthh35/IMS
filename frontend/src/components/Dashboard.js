import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity,
  Plus,
  Search,
  History,
  Brain,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Shield
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Defs, LinearGradient, Stop
} from 'recharts';

const COLORS = ['#ef4444', '#f59e42', '#facc15', '#22c55e'];
const SEVERITY_LABELS = ['Critical', 'High', 'Medium', 'Low'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    if (payload[0].payload.date) {
      // Line chart tooltip
      return (
        <div className="rounded-lg shadow-lg bg-white px-4 py-2 border border-slate-200">
          <div className="font-semibold text-slate-900">{payload[0].payload.date}</div>
          <div className="text-blue-600 font-bold text-lg">{payload[0].value} incidents</div>
        </div>
      );
    } else {
      // Pie chart tooltip
      return (
        <div className="rounded-lg shadow-lg bg-white px-4 py-2 border border-slate-200">
          <div className="font-semibold text-slate-900">{payload[0].name}</div>
          <div className="text-lg font-bold" style={{ color: payload[0].color }}>{payload[0].value} incidents</div>
        </div>
      );
    }
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#1e293b"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={16}
      style={{ textShadow: '0 1px 2px #fff' }}
    >
      {`${SEVERITY_LABELS[index]} (${Math.round(percent * 100)}%)`}
    </text>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    criticalIncidents: 0,
    highIncidents: 0,
    mediumIncidents: 0,
    lowIncidents: 0,
    recentIncidents: []
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.HISTORY);
      const incidents = response.data;
      setIncidents(incidents);
      const stats = {
        totalIncidents: incidents.length,
        criticalIncidents: incidents.filter(i => i.severity.toLowerCase() === 'critical').length,
        highIncidents: incidents.filter(i => i.severity.toLowerCase() === 'high').length,
        mediumIncidents: incidents.filter(i => i.severity.toLowerCase() === 'medium').length,
        lowIncidents: incidents.filter(i => i.severity.toLowerCase() === 'low').length,
        recentIncidents: incidents.slice(-5).reverse() // Last 5 incidents
      };
      setStats(stats);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const severityData = [
    { name: 'Critical', value: stats.criticalIncidents },
    { name: 'High', value: stats.highIncidents },
    { name: 'Medium', value: stats.mediumIncidents },
    { name: 'Low', value: stats.lowIncidents },
  ];

  // Trend: count incidents per day (last 14 days)
  const trendData = (() => {
    const days = 14;
    const now = new Date();
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const count = incidents.filter(inc => inc.timestamp && inc.timestamp.startsWith(dayStr)).length;
      trend.push({ date: dayStr, count });
    }
    return trend;
  })();

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'status-critical';
      case 'high':
        return 'status-high';
      case 'medium':
        return 'status-medium';
      case 'low':
        return 'status-low';
      default:
        return 'status-medium';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-header">Executive Dashboard</h1>
          <p className="section-subtitle">Real-time incident management overview and analytics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Brain className="w-4 h-4" />
          <span>AI Analytics Active</span>
        </div>
      </div>

      {/* Graphical Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart: Severity Distribution */}
        <div className="card-elevated">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Incident Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <defs>
                <linearGradient id="pieCritical" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="pieHigh" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e42" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="pieMedium" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="pieLow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
              </defs>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
                isAnimationActive={true}
                animationDuration={1200}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pie${SEVERITY_LABELS[index]})`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: 16, marginTop: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart: Incident Trend */}
        <div className="card-elevated">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Incident Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#lineBlue)"
                strokeWidth={4}
                dot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 2px 6px #2563eb33)' }}
                activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('new')}
          className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Report Incident</h3>
              <p className="text-sm text-slate-600">Submit new incident</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('search')}
          className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Search Incidents</h3>
              <p className="text-sm text-slate-600">Find similar cases</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">View History</h3>
              <p className="text-sm text-slate-600">Browse all incidents</p>
            </div>
          </div>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Incidents</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalIncidents}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-slate-400" />
          </div>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Critical</p>
              <p className="text-3xl font-bold text-red-600">{stats.criticalIncidents}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">High</p>
              <p className="text-3xl font-bold text-orange-600">{stats.highIncidents}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-400" />
          </div>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Medium</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.mediumIncidents}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Low</p>
              <p className="text-3xl font-bold text-green-600">{stats.lowIncidents}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Incidents</h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        {stats.recentIncidents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Incidents Yet</h3>
            <p className="text-slate-500 mb-6">Start by reporting your first incident</p>
            <button
              onClick={() => onNavigate('new')}
              className="btn-accent"
            >
              Report Incident
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentIncidents.map((incident, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-4">
                  {getSeverityIcon(incident.severity)}
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {incident.component}
                    </p>
                    <p className="text-xs text-slate-600">
                      {incident.log_text.length > 80 
                        ? `${incident.log_text.substring(0, 80)}...` 
                        : incident.log_text
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`status-badge ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTimestamp(incident.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="card-elevated border-l-4 border-blue-400 bg-blue-50">
        <div className="flex items-start space-x-4">
          <Brain className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              AI-Powered Enterprise Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="space-y-2">
                <p>• Automatic root cause prediction using advanced ML models</p>
                <p>• Intelligent incident summarization with T5 transformer</p>
              </div>
              <div className="space-y-2">
                <p>• Vector similarity search for pattern recognition</p>
                <p>• Real-time analytics and executive reporting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 