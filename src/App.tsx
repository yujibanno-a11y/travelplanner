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
                  <span className="text-sm text-white/80">Welcome to TravelPlanner!</span>
                </div>
              </div>
              <h1 className="text-2xl font-display font-bold text-white text-glow">
                TravelPlanner
              </h1>
            </motion.div>
            
            {/* Right side spacer for layout balance */}
            <div className="w-32"></div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
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