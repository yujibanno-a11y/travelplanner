import React, { useState } from 'react';
import { Plane, MapPin, DollarSign, MessageCircle, UtensilsCrossed, Bell, ChevronDown, ChevronRight, Settings as SettingsIcon, Receipt, Wallet } from 'lucide-react';
import { Route, Target, ReceiptText, PieChart, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, signOut, type AuthUser } from './lib/auth';
import { supabase } from './lib/supabase';
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
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import FindJobPage from './components/FindJobPage';
import DebugPanel from './components/DebugPanel';

type TabType = 'plan' | 'budget' | 'expenses' | 'restaurants' | 'spreadsheet' | 'notifications' | 'settings';
type PageType = 'landing' | 'login' | 'signup' | 'reset-password' | 'find-job' | 'app';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [budgetSubmenuOpen, setBudgetSubmenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const { isDark, toggleTheme, reducedMotion } = useTheme();

  useEffect(() => {
    // Check initial auth state
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = await getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentPage('app');
          
          // Ensure user profile is created/updated when they log in
          if (event === 'SIGNED_IN' && session.user) {
            await ensureUserProfileExists(session.user);
          }
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
          setCurrentPage('landing');
        }
      }
    );

    // Load theme preference
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to ensure user profile exists
  const ensureUserProfileExists = async (user: any) => {
    try {
      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error upserting user profile:', error);
      }
    } catch (error) {
      console.error('Error ensuring user profile exists:', error);
    }
  };

  const checkAuthState = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentPage('app');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

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
    // Auth state will be handled by the auth state listener
  };

  const handleSignup = () => {
    // Auth state will be handled by the auth state listener
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Auth state will be handled by the auth state listener
    } catch (error) {
      console.error('Error signing out:', error);
    }
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

  if (currentPage === 'find-job') {
    return (
      <FindJobPage
        onBack={() => setCurrentPage('app')}
      />
    );
  }

  if (currentPage === 'find-job') {
    return (
      <FindJobPage
        onBack={() => setCurrentPage('app')}
      />
    );
  }

  // Landing Page (Marketing/Unauthenticated)
  if (currentPage === 'landing') {
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
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary animate-pulse-glow">
                    <Plane className="h-6 w-6 text-dark-900" />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full p-1">
                      <DollarSign className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-display font-bold text-white text-glow">
                  TravelPlanner
                </h1>
              </motion.div>
              
              {/* Auth Container */}
              <div className="flex items-center space-x-4">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('login')}
                >
                  Log In
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentPage('signup')}
                >
                  Sign Up
                </GlassButton>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            {/* Animated Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="flex justify-center mb-8"
            >
              <AnimatedGlobe className="animate-float" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white text-glow">
                Plan adventures. Spend smarter.
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                AI-generated itineraries with real-time expense tracking and budget insights.
                <br />
                <span className="text-primary-400 font-semibold">All in one travel wallet.</span>
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
                className="pt-4"
              >
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentPage('signup')}
                  className="px-12 py-4 text-xl shadow-glow-primary"
                >
                  Start Planning
                </GlassButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white text-glow mb-4">
              All-in-one features
            </h2>
            <p className="text-white/60 text-lg">Everything you need for the perfect trip</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trip Planning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="primary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-glow-primary">
                  <Route className="h-8 w-8 text-dark-900" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Trip Planning</h3>
                <p className="text-white/70 leading-relaxed">
                  Build a day-by-day itinerary with estimated costs and pre-picked activities so you start every morning ready to roll.
                </p>
              </GlassCard>
            </motion.div>

            {/* Set Budget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="secondary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-2xl flex items-center justify-center shadow-glow-secondary">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Set Budget</h3>
                <p className="text-white/70 leading-relaxed">
                  Enter your trip budget once and the app keeps a running tally to make sure you never overspend.
                </p>
              </GlassCard>
            </motion.div>

            {/* Enter Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="primary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow-primary">
                  <ReceiptText className="h-8 w-8 text-dark-900" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Enter Expenses</h3>
                <p className="text-white/70 leading-relaxed">
                  Log purchases in seconds—online or offline—and see your total update instantly.
                </p>
              </GlassCard>
            </motion.div>

            {/* Budget Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="secondary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-secondary-400 to-primary-500 rounded-2xl flex items-center justify-center shadow-glow-secondary">
                  <PieChart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Budget Tracker</h3>
                <p className="text-white/70 leading-relaxed">
                  View charts that break spending down by category, giving you a crystal-clear picture of where the money goes.
                </p>
              </GlassCard>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="primary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Alerts</h3>
                <p className="text-white/70 leading-relaxed">
                  Get a friendly nudge the moment you edge past your budget limit, before small splurges snowball.
                </p>
              </GlassCard>
            </motion.div>

            {/* Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2, ease: 'easeOut' }}
            >
              <GlassCard className="p-8 text-center space-y-4 h-full" glow="secondary">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UtensilsCrossed className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white">Restaurants</h3>
                <p className="text-white/70 leading-relaxed">
                  Browse restaurant picks filtered by cuisine and price so great meals fit smoothly into your budget.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <TripPlanner />
        </main>
      </PageTransition>
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
                  <Plane className="h-6 w-6 text-dark-900" />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full p-1">
                    <DollarSign className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-display font-bold text-white text-glow">
                TravelPlanner
              </h1>
            </motion.div>
            
            {/* Auth Container */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80">
                  Welcome back{currentUser?.full_name ? `, ${currentUser.full_name}` : ''}!
                </span>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Log Out
                </GlassButton>
              </div>
            </div>
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