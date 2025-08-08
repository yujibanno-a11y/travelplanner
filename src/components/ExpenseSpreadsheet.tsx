import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Expense Spreadsheet</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-indigo-100">Total Expenses</h3>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-indigo-100">Total Transactions</h3>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-indigo-100">Average per Day</h3>
            <p className="text-2xl font-bold">
              ${Object.keys(dailyExpenses).length > 0 
                ? (totalExpenses / Object.keys(dailyExpenses).length).toFixed(2) 
                : '0.00'}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-indigo-100">Days Tracked</h3>
            <p className="text-2xl font-bold">{Object.keys(dailyExpenses).length}</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="h-6 w-6 text-gray-300" />
          <h3 className="text-xl font-bold text-white">Category Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300 capitalize">{category}</span>
                <span className="text-lg font-bold text-white">${amount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(amount / totalExpenses) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {((amount / totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
                className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Date (Newest First)</option>
                <option value="amount">Amount (Highest First)</option>
                <option value="category">Category</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Filter By Category</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="activities">Activities</option>
                <option value="souvenirs">Souvenirs</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            Expense Details ({sortedAndFilteredExpenses.length} entries)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedAndFilteredExpenses.map((expense, index) => (
                <tr key={expense.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {expense.timestamp.toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {expense.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      expense.category === 'food' ? 'bg-orange-100 text-orange-800' :
                      expense.category === 'transportation' ? 'bg-blue-100 text-blue-800' :
                      expense.category === 'activities' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white text-right">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {expense.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No expenses found</h3>
            <p className="text-gray-300">Start adding expenses to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSpreadsheet;