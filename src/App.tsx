import React, { useState } from 'react';
import { Plane, MapPin, DollarSign, MessageCircle, UtensilsCrossed, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import TripPlanner from './components/TripPlanner';
import BudgetTracker from './components/BudgetTracker';
import ExpenseChat from './components/ExpenseChat';
import RestaurantRecommendations from './components/RestaurantRecommendations';
import ExpenseSpreadsheet from './components/ExpenseSpreadsheet';
import NotificationCenter from './components/NotificationCenter';
import Settings from './components/Settings';

type TabType = 'plan' | 'budget' | 'expenses' | 'restaurants' | 'spreadsheet' | 'notifications' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [budgetSubmenuOpen, setBudgetSubmenuOpen] = useState(false);

  const tabs = [
    { id: 'plan', label: 'Plan Trip', icon: MapPin },
    { 
      id: 'budget', 
      label: 'Budget', 
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: 'budget', label: 'Budget Tracker', icon: DollarSign },
        { id: 'expenses', label: 'Add Expenses', icon: MessageCircle },
        { id: 'spreadsheet', label: 'Expense Sheet', icon: Plane },
      ]
    },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: DollarSign },
  ];

  const handleTabClick = (tabId: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setBudgetSubmenuOpen(!budgetSubmenuOpen);
      if (!budgetSubmenuOpen) {
        setActiveTab('budget'); // Default to budget tracker when opening submenu
      }
    } else {
      setActiveTab(tabId as TabType);
      if (tabId !== 'budget' && tabId !== 'expenses' && tabId !== 'spreadsheet') {
        setBudgetSubmenuOpen(false);
      }
    }
  };

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
      case 'settings':
        return <Settings />;
      default:
        return <TripPlanner />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-3 rounded-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">TravelPlanner</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Plan adventures and spend smarter
            </h2>
            <p className="text-base text-gray-600 text-center max-w-2xl">
              AI-generated itineraries with real-time expense tracking and budget insights...all in one travel wallet.
            </p>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        {/* Budget Submenu */}
        {budgetSubmenuOpen && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex justify-center space-x-4 overflow-x-auto">
              {tabs.find(tab => tab.hasSubmenu)?.submenu?.map((submenuItem) => {
                const SubmenuIcon = submenuItem.icon;
                return (
                  <button
                    key={submenuItem.id}
                    onClick={() => setActiveTab(submenuItem.id as TabType)}
                    className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg font-medium text-xs whitespace-nowrap transition-colors duration-200 min-w-0 ${
                      activeTab === submenuItem.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <SubmenuIcon className="h-5 w-5" />
                    <span className="truncate">{submenuItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Main Navigation */}
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.hasSubmenu 
              ? (activeTab === 'budget' || activeTab === 'expenses' || activeTab === 'spreadsheet')
              : activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.hasSubmenu)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg font-medium text-xs transition-colors duration-200 min-w-0 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {tab.hasSubmenu && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center ${
                      budgetSubmenuOpen ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {budgetSubmenuOpen ? (
                        <ChevronDown className="h-2 w-2 text-white" />
                      ) : (
                        <ChevronRight className="h-2 w-2 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <span className="truncate max-w-16">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;