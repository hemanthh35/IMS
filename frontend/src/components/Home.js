import React from 'react';
import { 
  AlertTriangle, 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  Search, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Award,
  Globe,
  Lock
} from 'lucide-react';

const Home = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models provide automatic root cause prediction and intelligent incident summarization for faster resolution.",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Vector similarity search technology enables rapid identification of related incidents and historical patterns for informed decision-making.",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      icon: BarChart3,
      title: "Enterprise Analytics",
      description: "Comprehensive real-time dashboard with advanced metrics, trend analysis, and executive reporting capabilities.",
      color: "text-slate-600 bg-slate-50"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security protocols with comprehensive audit trails, role-based access control, and compliance monitoring.",
      color: "text-amber-600 bg-amber-50"
    }
  ];

  const quickActions = [
    {
      title: "Report Incident",
      description: "Submit a new incident with comprehensive AI analysis and automated categorization",
      icon: AlertTriangle,
      action: () => onNavigate('new'),
      color: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      title: "Search Knowledge Base",
      description: "Access historical incident data and find similar cases for faster resolution",
      icon: Search,
      action: () => onNavigate('search'),
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Executive Dashboard",
      description: "Monitor key performance indicators and incident trends in real-time",
      icon: BarChart3,
      action: () => onNavigate('dashboard'),
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    }
  ];

  const stats = [
    { label: "AI Models Deployed", value: "3", icon: Brain, description: "Advanced ML" },
    { label: "Enterprise Features", value: "12+", icon: Award, description: "Professional" },
    { label: "Response Time", value: "<2s", icon: Clock, description: "Real-time" },
    { label: "Accuracy Rate", value: "95%", icon: CheckCircle, description: "Reliable" }
  ];

  const technologies = [
    { name: "T5 Transformer", description: "State-of-the-art text summarization", icon: Brain, color: "from-blue-500 to-blue-600" },
    { name: "FAISS Engine", description: "High-performance vector search", icon: Search, color: "from-emerald-500 to-emerald-600" },
    { name: "ML Pipeline", description: "Automated root cause analysis", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { name: "FastAPI", description: "Enterprise-grade API framework", icon: Zap, color: "from-slate-500 to-slate-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Enterprise
              <span className="text-blue-600 block">Incident Management</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your organization's incident response capabilities with enterprise-grade AI automation, 
              predictive analytics, and comprehensive reporting designed for modern enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => onNavigate('new')}
                className="btn-accent text-lg px-8 py-4 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                <span>Get Started</span>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-3"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-md mx-auto mb-4 border border-gray-100">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-slate-500">{stat.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-header">
              Enterprise-Grade Features
            </h2>
            <p className="section-subtitle text-lg">
              Comprehensive incident management solution designed for enterprise environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-elevated group hover:shadow-lg transition-all duration-300">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-header">
              Quick Actions
            </h2>
            <p className="section-subtitle text-lg">
              Streamlined workflows for efficient incident management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="group text-left"
                >
                  <div className="card-elevated hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className={`flex items-center justify-center w-20 h-20 rounded-xl ${action.color} mb-8 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-header">
              Enterprise Technology Stack
            </h2>
            <p className="section-subtitle text-lg">
              Built with industry-leading technologies for reliability and performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`bg-gradient-to-br ${tech.color} w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{tech.name}</h3>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Incident Management?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join leading enterprises that trust our AI-powered platform for comprehensive incident response and management.
          </p>
          <button
            onClick={() => onNavigate('new')}
            className="bg-white text-slate-800 font-semibold px-10 py-4 rounded-md hover:bg-slate-100 transition-colors duration-200 flex items-center space-x-3 mx-auto shadow-lg"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Start Managing Incidents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 