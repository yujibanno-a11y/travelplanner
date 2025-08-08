import React, { useState, useEffect } from 'react';
import { DollarSign, Target, TrendingUp, AlertCircle, PiggyBank } from 'lucide-react';

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

  useEffect(() => {
    // Load current trip and budget settings
    const tripData = localStorage.getItem('currentTrip');
    const budgetData = localStorage.getItem('budgetSettings');
    
    if (tripData) {
      setCurrentTrip(JSON.parse(tripData));
    }
    
    if (budgetData) {
      setBudgetSettings(JSON.parse(budgetData));
    }
  }, []);

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

  const saveBudgetSettings = () => {
    localStorage.setItem('budgetSettings', JSON.stringify(budgetSettings));
    alert('Budget settings saved successfully!');
  };

  const totalCategoryBudget = Object.values(budgetSettings.categories).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-8">
      {/* Budget Overview */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <PiggyBank className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Budget Overview</h2>
        </div>
        
        {currentTrip ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Trip Details</h3>
              <p className="text-emerald-100">{currentTrip.destination}</p>
              <p className="text-emerald-100">{currentTrip.days} days</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Daily Budget</h3>
              <p className="text-2xl font-bold">${budgetSettings.dailyLimit}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
              <p className="text-2xl font-bold">${budgetSettings.totalBudget}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <p className="text-lg">Please plan a trip first to set up your budget!</p>
          </div>
        )}
      </div>

      {/* Budget Settings */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Set Your Budget</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Daily Spending Limit
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="number"
                value={budgetSettings.dailyLimit}
                onChange={(e) => handleBudgetChange('dailyLimit', parseFloat(e.target.value) || 0)}
                placeholder="Enter daily limit"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Total Trip Budget
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="number"
                value={budgetSettings.totalBudget}
                onChange={(e) => handleBudgetChange('totalBudget', parseFloat(e.target.value) || 0)}
                placeholder="Enter total budget"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Budget Breakdown */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-white mb-4">Daily Category Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(budgetSettings.categories).map(([category, amount]) => (
              <div key={category} className="bg-gray-700 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                  {category}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {totalCategoryBudget > budgetSettings.dailyLimit && budgetSettings.dailyLimit > 0 && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-400 font-medium">
                  Category totals (${totalCategoryBudget}) exceed daily limit (${budgetSettings.dailyLimit})
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={saveBudgetSettings}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Save Budget Settings
        </button>
      </div>

      {/* Budget Recommendations */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Smart Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/50">
            <h4 className="font-semibold text-white mb-2">💡 Budget-Friendly Activities</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Free walking tours and city parks</li>
              <li>• Local markets and street food</li>
              <li>• Museums with free admission days</li>
            </ul>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/50">
            <h4 className="font-semibold text-white mb-2">💰 Money-Saving Tips</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Book activities in advance for discounts</li>
              <li>• Use public transportation passes</li>
              <li>• Look for lunch specials at restaurants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;