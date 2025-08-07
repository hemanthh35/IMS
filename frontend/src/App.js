import React, { useState } from 'react';
import { AlertTriangle, Search, History, Plus, Brain, Home as HomeIcon, FileText, Play } from 'lucide-react';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import IncidentForm from './components/IncidentForm';
import SearchIncidents from './components/SearchIncidents';
import IncidentHistory from './components/IncidentHistory';
import Summarize from './components/Summarize';
import DemoSimulation from './components/DemoSimulation';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'demo', label: 'Demo/Simulation', icon: Play },
    { id: 'new', label: 'New Incident', icon: Plus },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'demo':
        return <DemoSimulation />;
      case 'new':
        return <IncidentForm />;
      case 'search':
        return <SearchIncidents />;
      case 'summarize':
        return <Summarize />;
      case 'history':
        return <IncidentHistory />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">
                AI-Powered Incident Management System
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Platform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-link ${
                    activeTab === tab.id
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={activeTab === 'home' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App; 