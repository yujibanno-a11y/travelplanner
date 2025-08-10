import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

interface Expense {
  id: string;
  category: 'food' | 'transportation' | 'activities' | 'souvenirs';
  amount: number;
  description: string;
  timestamp: Date;
}

const ExpenseSpreadsheet = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [filterBy, setFilterBy] = useState<string>('all');

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses).map((expense: any) => ({
        ...expense,
        timestamp: new Date(expense.timestamp)
      }));
      setExpenses(parsedExpenses);
    }
    
    // Reset food expenses to zero (one-time operation)
    const resetFoodExpenses = () => {
      const savedExpenses = localStorage.getItem('expenses');
      if (savedExpenses) {
        const allExpenses = JSON.parse(savedExpenses);
        const nonFoodExpenses = allExpenses.filter((expense: any) => expense.category !== 'food');
        localStorage.setItem('expenses', JSON.stringify(nonFoodExpenses));
        const parsedNonFoodExpenses = nonFoodExpenses.map((expense: any) => ({
          ...expense,
          timestamp: new Date(expense.timestamp)
        }));
        setExpenses(parsedNonFoodExpenses);
      }
    };
    
    // Execute the reset
    resetFoodExpenses();
  }, []);

  const sortedAndFilteredExpenses = expenses
    .filter(expense => filterBy === 'all' || expense.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyExpenses = expenses.reduce((acc, expense) => {
    const date = expense.timestamp.toDateString();
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Description'];
    const csvContent = [
      headers.join(','),
      ...sortedAndFilteredExpenses.map(expense => 
        [
          expense.timestamp.toLocaleDateString(),
          expense.category,
          expense.amount,
          `"${expense.description.replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-expenses.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-96">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
              <FileText className="h-8 w-8 text-dark-900" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white text-glow">Expense Spreadsheet</h2>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-sm font-medium text-white/80">Total Expenses</h3>
              <p className="text-2xl font-bold text-primary-400">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-sm font-medium text-white/80">Total Transactions</h3>
              <p className="text-2xl font-bold text-secondary-400">{expenses.length}</p>
            </div>
            <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-sm font-medium text-white/80">Average per Day</h3>
              <p className="text-2xl font-bold text-primary-400">
                ${Object.keys(dailyExpenses).length > 0 
                  ? (totalExpenses / Object.keys(dailyExpenses).length).toFixed(2) 
                  : '0.00'}
              </p>
            </div>
            <div className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-sm font-medium text-white/80">Days Tracked</h3>
              <p className="text-2xl font-bold text-secondary-400">{Object.keys(dailyExpenses).length}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <GlassCard className="p-6" glow="secondary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-3 rounded-2xl shadow-glow-secondary">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-white text-glow">Category Breakdown</h3>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="glass backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80 capitalize">{category}</span>
                  <span className="text-lg font-bold text-primary-400">${amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(amount / totalExpenses) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  {((amount / totalExpenses) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <GlassCard className="p-6" glow="primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
                  className="px-4 py-2 glass backdrop-blur-md border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white"
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="amount">Amount (Highest First)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Filter By Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-2 glass backdrop-blur-md border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="activities">Activities</option>
                  <option value="souvenirs">Souvenirs</option>
                </select>
              </div>
            </div>
          
            <GlassButton
              variant="secondary"
              onClick={exportToCSV}
              className="flex items-center space-x-2 shadow-glow-secondary"
            >
              <Download className="h-5 w-5" />
              <span>Export CSV</span>
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Expense Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
      >
        <GlassCard className="overflow-hidden" glow="secondary">
          <div className="px-6 py-4 border-b border-white/20">
            <h3 className="text-lg font-display font-semibold text-white">
              Expense Details ({sortedAndFilteredExpenses.length} entries)
            </h3>
          </div>
        
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="glass backdrop-blur-md border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="glass backdrop-blur-md divide-y divide-white/10">
                {sortedAndFilteredExpenses.map((expense, index) => (
                  <tr key={expense.id} className={index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {expense.timestamp.toLocaleDateString()}
                      <div className="text-xs text-white/60">
                        {expense.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        expense.category === 'food' ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' :
                        expense.category === 'transportation' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' :
                        expense.category === 'activities' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                        'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                      }`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-400 text-right">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80 max-w-xs truncate">
                      {expense.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
          {sortedAndFilteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No expenses found</h3>
              <p className="text-white/60">Start adding expenses to see them here!</p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ExpenseSpreadsheet;