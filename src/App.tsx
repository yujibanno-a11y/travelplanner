import React, { useState } from 'react';
import { Plane, MapPin, DollarSign, MessageCircle, UtensilsCrossed, Bell, ChevronDown, ChevronRight, Settings as SettingsIcon, Receipt, Wallet } from 'lucide-react';
import { Route, Target, ReceiptText, PieChart, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './components/ThemeProvider';
import GlassCard from './components/GlassCard';
import GlassButton from './components/GlassButton';
import AnimatedGlobe from './components/AnimatedGlobe';
import PageTransition from './components/PageTransition';
import TripPlanner from './components/TripPlanner';
import BudgetTracker from './components/BudgetTracker';
import ExpenseChat from './components/ExpenseChat';
import RestaurantRecommendations from './components/RestaurantRecommendations';
import ExpenseSpreadsheet from './components/ExpenseSpreadsheet';
import NotificationCenter from './components/NotificationCenter';
import FindJobPage from './components/FindJobPage';
import DebugPanel from './components/DebugPanel';

type TabType = 'plan' | 'budget' | 'expenses' | 'restaurants' | 'spreadsheet' | 'notifications';
type PageType = 'find-job' | 'app';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [budgetSubmenuOpen, setBudgetSubmenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('app');
  const { isDark, toggleTheme, reducedMotion } = useTheme();

  useEffect(() => {
    // App starts directly in the main interface
    setCurrentPage('app');
  }, []);

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

  if (currentPage === 'find-job') {
    return (
      <FindJobPage
        onBack={() => setCurrentPage('app')}
      />
    );
  }

  // Main App Interface
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
    <PageTransition className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-glow-primary">
                    <svg className="w-5 h-5 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-display font-bold text-white text-glow">
                TravelCents
              </h1>
            </motion.div>
            
            {/* Right side spacer for layout balance */}
            <div className="w-32"></div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-96">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-700"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Budget Submenu */}
        {budgetSubmenuOpen && (
          <motion.div 
            className="border-t border-dark-700 px-4 py-3 bg-dark-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex justify-center space-x-4 overflow-x-auto">
              {tabs.find(tab => tab.hasSubmenu)?.submenu?.map((submenuItem) => {
                const SubmenuIcon = submenuItem.icon;
                return (
                  <motion.button
                    key={submenuItem.id}
                    onClick={() => setActiveTab(submenuItem.id as TabType)}
                    className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl font-medium text-xs whitespace-nowrap transition-all duration-200 min-w-0 ${
                      activeTab === submenuItem.id
                        ? 'bg-primary-500/30 text-primary-400' 
                        : 'text-white/60 hover:text-white hover:bg-dark-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SubmenuIcon className="h-5 w-5" />
                    <span className="truncate">{submenuItem.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Main Navigation */}
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.hasSubmenu 
              ? (activeTab === 'budget' || activeTab === 'expenses' || activeTab === 'spreadsheet')
              : activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.hasSubmenu)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl font-medium text-xs transition-all duration-200 min-w-0 ${
                  isActive
                    ? 'text-primary-400 bg-primary-500/30'
                    : 'text-white/60 hover:text-white hover:bg-dark-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {tab.hasSubmenu && (
                    <motion.div 
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      budgetSubmenuOpen 
                        ? 'bg-primary-500' 
                        : 'bg-dark-600'
                    }`}
                      animate={{ rotate: budgetSubmenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {budgetSubmenuOpen ? (
                        <ChevronDown className="h-2 w-2 text-white" />
                      ) : (
                        <ChevronRight className="h-2 w-2 text-white" />
                      )}
                    </motion.div>
                  )}
                </div>
                <span className="truncate max-w-16">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
      
      {/* Debug Panel - only show in development */}
      {import.meta.env.DEV && <DebugPanel />}
    </PageTransition>
  );
}

export default App;