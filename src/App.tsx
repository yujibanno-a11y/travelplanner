import React, { useState } from 'react';
import { Plane, MapPin, DollarSign, MessageCircle, UtensilsCrossed, Bell } from 'lucide-react';
import TripPlanner from './components/TripPlanner';
import BudgetTracker from './components/BudgetTracker';
import ExpenseChat from './components/ExpenseChat';
import RestaurantRecommendations from './components/RestaurantRecommendations';
import ExpenseSpreadsheet from './components/ExpenseSpreadsheet';
import NotificationCenter from './components/NotificationCenter';

type TabType = 'plan' | 'budget' | 'expenses' | 'restaurants' | 'spreadsheet' | 'notifications';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');

  const tabs = [
    { id: 'plan', label: 'Plan Trip', icon: MapPin },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'expenses', label: 'Add Expenses', icon: MessageCircle },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'spreadsheet', label: 'Expense Sheet', icon: Plane },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'plan':
        return <TripPlanner />;
      case 'budget':
        return <BudgetTracker />;
      case 'expenses':
        return <ExpenseChat />;
      case 'restaurants':
        return <RestaurantRecommendations />;
      case 'spreadsheet':
        return <ExpenseSpreadsheet />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <TripPlanner />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-2 rounded-xl">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">TravelPlanner</h1>
            </div>
            <div className="hidden md:block text-sm text-gray-300">
              Your AI-powered travel companion
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;