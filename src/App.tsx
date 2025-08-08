import React, { useState } from 'react';
import { Plane, MapPin, DollarSign, MessageCircle, UtensilsCrossed, Bell, ChevronDown, ChevronRight, Settings as SettingsIcon, Receipt, Wallet } from 'lucide-react';
import { Route, Target, ReceiptText, PieChart, AlertTriangle } from 'lucide-react';
import TripPlanner from './components/TripPlanner';
import BudgetTracker from './components/BudgetTracker';
import ExpenseChat from './components/ExpenseChat';
import RestaurantRecommendations from './components/RestaurantRecommendations';
import ExpenseSpreadsheet from './components/ExpenseSpreadsheet';
import NotificationCenter from './components/NotificationCenter';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ResetPasswordPage from './components/ResetPasswordPage';

type TabType = 'plan' | 'budget' | 'expenses' | 'restaurants' | 'spreadsheet' | 'notifications' | 'settings';
type PageType = 'landing' | 'login' | 'signup' | 'reset-password' | 'app';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [budgetSubmenuOpen, setBudgetSubmenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const tabs = [
    { id: 'plan', label: 'Plan Trip', icon: MapPin },
    { 
      id: 'budget', 
      label: 'Budget', 
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { id: 'budget', label: 'Set Budget', icon: DollarSign },
        { id: 'expenses', label: 'Enter Expenses', icon: Receipt },
        { id: 'spreadsheet', label: 'Budget Tracker', icon: Wallet },
      ]
    },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('app');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  // Render different pages based on currentPage state
  if (currentPage === 'login') {
    return (
      <LoginPage
        onBack={() => setCurrentPage('landing')}
        onLogin={handleLogin}
        onNavigateToSignup={() => setCurrentPage('signup')}
        onNavigateToResetPassword={() => setCurrentPage('reset-password')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onBack={() => setCurrentPage('landing')}
        onSignup={handleSignup}
        onNavigateToLogin={() => setCurrentPage('login')}
      />
    );
  }

  if (currentPage === 'reset-password') {
    return (
      <ResetPasswordPage
        onBack={() => setCurrentPage('login')}
      />
    );
  }

  // Landing Page (Marketing/Unauthenticated)
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Header */}
        <header className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              {/* Logo and Brand - Left Side */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-2 rounded-xl relative">
                  <Plane className="h-6 w-6 text-white" />
                  <div className="absolute bottom-0 left-0 bg-green-500 rounded-full p-0.5">
                    <DollarSign className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">TravelPlanner</h1>
              </div>
              
              {/* Auth Container - Right Side */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setCurrentPage('signup')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.97] shadow-md"
                >
                  Create Account
                </button>
              </div>
            </div>
            
            {/* Hero Content - Centered */}
            <div className="flex flex-col items-center justify-center pb-8 space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Plan adventures. Spend smarter.
              </h2>
              <p className="text-base text-gray-600 text-center max-w-2xl">
                AI-generated itineraries with real-time expense tracking and budget insights. <br></br>All in one travel wallet.
              </p>
            </div>
          </div>
        </header>

        {/* Benefits Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {/* Trip Planning */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Route className="h-7 w-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trip Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Build a day-by-day itinerary with estimated costs and pre-picked activities so you start every morning ready to roll.
              </p>
            </div>

            {/* Set Budget */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="h-7 w-7 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Set Budget</h3>
              <p className="text-gray-600 leading-relaxed">
                Enter your trip budget once and the app keeps a running tally to make sure you never overspend.
              </p>
            </div>

            {/* Enter Expenses */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <ReceiptText className="h-7 w-7 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Enter Expenses</h3>
              <p className="text-gray-600 leading-relaxed">
                Log purchases in seconds—online or offline—and see your total update instantly.
              </p>
            </div>

            {/* Budget Tracker */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                <PieChart className="h-7 w-7 text-indigo-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Budget Tracker</h3>
              <p className="text-gray-600 leading-relaxed">
                View charts that break spending down by category, giving you a crystal-clear picture of where the money goes.
              </p>
            </div>

            {/* Alerts */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Get a friendly nudge the moment you edge past your budget limit, before small splurges snowball.
              </p>
            </div>

            {/* Restaurants */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="h-7 w-7 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Restaurants</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse restaurant picks filtered by cuisine and price so great meals fit smoothly into your budget.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TripPlanner />
        </main>
      </div>
    );
  }

  // Authenticated App (currentPage === 'app')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo and Brand - Left Side */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-2 rounded-xl relative">
                <Plane className="h-6 w-6 text-white" />
                <div className="absolute bottom-0 left-0 bg-green-500 rounded-full p-0.5">
                  <DollarSign className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TravelPlanner</h1>
            </div>
            
            {/* Auth Container - Right Side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back!</span>
                <button 
                  onClick={handleLogout}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
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