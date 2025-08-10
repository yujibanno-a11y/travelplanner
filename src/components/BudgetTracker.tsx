import React, { useState, useEffect } from 'react';
import { DollarSign, Target, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, getCurrentUserId } from '../lib/supabase';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';

interface BudgetSettings {
  dailyLimit: number;
  totalBudget: number;
  categories: {
    food: number;
    transportation: number;
    activities: number;
    souvenirs: number;
  };
}

const BudgetTracker = () => {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>({
    dailyLimit: 0,
    totalBudget: 0,
    categories: {
      food: 0,
      transportation: 0,
      activities: 0,
      souvenirs: 0
    }
  });
  
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        await loadBudgetFromSupabase();
      } else {
        // Load from localStorage for non-authenticated users
        const budgetData = localStorage.getItem('budgetSettings');
        if (budgetData) {
          setBudgetSettings(JSON.parse(budgetData));
        }
      }
    };
    
    checkAuth();

    // Load current trip and budget settings
    const tripData = localStorage.getItem('currentTrip');
    
    if (tripData) {
      setCurrentTrip(JSON.parse(tripData));
    }
  }, []);

  const loadBudgetFromSupabase = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data: budget, error } = await supabase
        .from('budget_settings')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading budget:', error);
        return;
      }

      if (budget) {
        setBudgetSettings({
          dailyLimit: parseFloat(budget.daily_limit) || 0,
          totalBudget: parseFloat(budget.total_budget) || 0,
          categories: budget.category_limits || {
            food: 0,
            transportation: 0,
            activities: 0,
            souvenirs: 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading budget from Supabase:', error);
    }
  };

  const saveBudgetToSupabase = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { error } = await supabase
        .from('budget_settings')
        .upsert({
          owner_id: userId,
          daily_limit: budgetSettings.dailyLimit,
          total_budget: budgetSettings.totalBudget,
          category_limits: budgetSettings.categories
        }, {
          onConflict: 'owner_id'
        });

      if (error) {
        console.error('Error saving budget to Supabase:', error);
        throw error;
      } else {
        console.log('Budget saved to Supabase successfully!');
      }
    } catch (error) {
      console.error('Error saving budget to Supabase:', error);
      throw error;
    }
  };

  const handleBudgetChange = (field: string, value: number) => {
    if (field === 'dailyLimit' || field === 'totalBudget') {
      setBudgetSettings(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setBudgetSettings(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [field]: value
        }
      }));
    }
  };

  const saveBudgetSettings = async () => {
    // Save to localStorage for all users
    localStorage.setItem('budgetSettings', JSON.stringify(budgetSettings));
    
    let saveMessage = 'Budget settings saved successfully!';
    let hasError = false;
    
    // Save to Supabase if authenticated
    if (isAuthenticated) {
      try {
        await saveBudgetToSupabase();
        saveMessage += ' (Synced to cloud)';
      } catch (error) {
        console.error('Failed to sync to cloud:', error);
        saveMessage += ' (Local only - cloud sync failed)';
        hasError = true;
      }
    }
    
    // Show success/error message
    if (hasError) {
      alert(saveMessage + '\n\nPlease check your internet connection and try again.');
    } else {
      alert(saveMessage);
    }
  };

  const totalCategoryBudget = Object.values(budgetSettings.categories).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
              <PiggyBank className="h-8 w-8 text-dark-900" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white text-glow">Budget Overview</h2>
          </div>
        
          {currentTrip ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold mb-2 text-white">Trip Details</h3>
                <p className="text-white/80">{currentTrip.destination}</p>
                <p className="text-white/80">{currentTrip.days} days</p>
              </div>
              <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold mb-2 text-white">Daily Budget</h3>
                <p className="text-2xl font-bold text-primary-400">${budgetSettings.dailyLimit}</p>
              </div>
              <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold mb-2 text-white">Total Budget</h3>
                <p className="text-2xl font-bold text-secondary-400">${budgetSettings.totalBudget}</p>
              </div>
            </div>
          ) : (
            <div className="glass backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary-400" />
              <p className="text-lg text-white">Please plan a trip first to set up your budget!</p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Budget Settings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="secondary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-3 rounded-2xl shadow-glow-secondary">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white text-glow">Set Your Budget</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Daily Spending Limit
              </label>
              <GlassInput
                type="number"
                value={budgetSettings.dailyLimit.toString()}
                onChange={(e) => handleBudgetChange('dailyLimit', parseFloat(e.target.value) || 0)}
                placeholder="Enter daily limit"
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Total Trip Budget
              </label>
              <GlassInput
                type="number"
                value={budgetSettings.totalBudget.toString()}
                onChange={(e) => handleBudgetChange('totalBudget', parseFloat(e.target.value) || 0)}
                placeholder="Enter total budget"
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Category Budget Breakdown */}
          <div className="mb-8">
            <h4 className="text-xl font-display font-bold text-white mb-4">Daily Category Limits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(budgetSettings.categories).map(([category, amount]) => (
                <div key={category} className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <label className="block text-sm font-semibold text-white/80 mb-2 capitalize">
                    {category}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 glass backdrop-blur-md border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          
            {totalCategoryBudget > budgetSettings.dailyLimit && budgetSettings.dailyLimit > 0 && (
              <div className="mt-4 p-4 glass backdrop-blur-md rounded-xl border border-red-400/30 bg-red-500/10">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-400 font-medium">
                    Category totals (${totalCategoryBudget}) exceed daily limit (${budgetSettings.dailyLimit})
                  </p>
                </div>
              </div>
            )}
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            onClick={saveBudgetSettings}
            className="w-full py-4 text-lg shadow-glow-primary"
          >
            {isAuthenticated ? 'Save Budget Settings (Cloud Sync)' : 'Save Budget Settings (Local Only)'}
          </GlassButton>
        
          {!isAuthenticated && (
            <p className="mt-3 text-sm text-white/60 text-center">
              Sign in to sync your budget settings across devices
            </p>
          )}
        </GlassCard>
      </motion.div>

      {/* Budget Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
              <TrendingUp className="h-6 w-6 text-dark-900" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white text-glow">Smart Recommendations</h3>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 glass backdrop-blur-md rounded-xl border border-primary-400/30 bg-primary-500/10">
              <h4 className="font-semibold text-white mb-2">💡 Budget-Friendly Activities</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Free walking tours and city parks</li>
                <li>• Local markets and street food</li>
                <li>• Museums with free admission days</li>
              </ul>
            </div>
          
            <div className="p-6 glass backdrop-blur-md rounded-xl border border-secondary-400/30 bg-secondary-500/10">
              <h4 className="font-semibold text-white mb-2">💰 Money-Saving Tips</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Book activities in advance for discounts</li>
                <li>• Use public transportation passes</li>
                <li>• Look for lunch specials at restaurants</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default BudgetTracker;