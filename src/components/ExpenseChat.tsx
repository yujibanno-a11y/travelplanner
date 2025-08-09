import React, { useState, useEffect, useRef } from 'react';
import { Send, DollarSign, Coffee, Car, Camera, ShoppingBag, Bot, User } from 'lucide-react';
import { supabase, getCurrentUserId } from '../lib/supabase';

interface Expense {
  id: string;
  category: 'food' | 'transportation' | 'activities' | 'souvenirs';
  amount: number;
  description: string;
  timestamp: Date;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ExpenseChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const categoryIcons = {
    food: Coffee,
    transportation: Car,
    activities: Camera,
    souvenirs: ShoppingBag
  };

  const categoryColors = {
    food: 'bg-orange-500',
    transportation: 'bg-blue-500',
    activities: 'bg-green-500',
    souvenirs: 'bg-purple-500'
  };

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        // Load expenses from Supabase for authenticated users
        await loadExpensesFromSupabase();
      } else {
        // Load from localStorage for non-authenticated users
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
      }
    };
    
    checkAuth();

    // Initial bot message
    addBotMessage("Hi! I'm your expense tracking assistant. You can tell me about your expenses like: 'I spent $25 on lunch at the local cafe' or 'Taxi to airport cost $40'");
  }, []);

  const loadExpensesFromSupabase = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        return;
      }

      const formattedExpenses = expenses.map(expense => ({
        id: expense.id,
        category: expense.category as 'food' | 'transportation' | 'activities' | 'souvenirs',
        amount: parseFloat(expense.amount),
        description: expense.description,
        timestamp: new Date(expense.created_at)
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error loading expenses from Supabase:', error);
    }
  };

  const saveExpenseToSupabase = async (expense: Expense) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { error } = await supabase
        .from('expenses')
        .insert({
          owner_id: userId,
          category: expense.category,
          amount: expense.amount,
          description: expense.description
        });

      if (error) {
        console.error('Error saving expense to Supabase:', error);
      } else {
        console.log('Expense saved to Supabase successfully!');
      }
    } catch (error) {
      console.error('Error saving expense to Supabase:', error);
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const parseExpenseFromText = (text: string): Expense | null => {
    const lowerText = text.toLowerCase();
    
    // Extract amount using regex
    const amountMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    
    // Determine category based on keywords
    let category: 'food' | 'transportation' | 'activities' | 'souvenirs' = 'activities';
    
    if (lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') || 
        lowerText.includes('breakfast') || lowerText.includes('restaurant') || lowerText.includes('cafe') ||
        lowerText.includes('meal') || lowerText.includes('drink')) {
      category = 'food';
    } else if (lowerText.includes('taxi') || lowerText.includes('bus') || lowerText.includes('train') ||
               lowerText.includes('uber') || lowerText.includes('transport') || lowerText.includes('metro') ||
               lowerText.includes('flight') || lowerText.includes('gas')) {
      category = 'transportation';
    } else if (lowerText.includes('souvenir') || lowerText.includes('gift') || lowerText.includes('shop') ||
               lowerText.includes('bought') || lowerText.includes('purchase')) {
      category = 'souvenirs';
    }
    
    return {
      id: Date.now().toString(),
      category,
      amount,
      description: text,
      timestamp: new Date()
    };
  };

  const checkBudgetAlert = (newExpense: Expense) => {
    const budgetSettings = localStorage.getItem('budgetSettings');
    if (!budgetSettings) return;
    
    const budget = JSON.parse(budgetSettings);
    const today = new Date().toDateString();
    const todaysExpenses = [...expenses, newExpense].filter(
      expense => new Date(expense.timestamp).toDateString() === today
    );
    
    const totalToday = todaysExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryTotal = todaysExpenses
      .filter(expense => expense.category === newExpense.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    if (totalToday > budget.dailyLimit) {
      addBotMessage(`⚠️ Budget Alert! You've exceeded your daily limit of $${budget.dailyLimit}. Today's total: $${totalToday.toFixed(2)}`);
    } else if (categoryTotal > budget.categories[newExpense.category]) {
      addBotMessage(`⚠️ Category Alert! You've exceeded your ${newExpense.category} budget of $${budget.categories[newExpense.category]}. Category total: $${categoryTotal.toFixed(2)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    
    const expense = parseExpenseFromText(input);
    if (expense) {
      const updatedExpenses = [...expenses, expense];
      setExpenses(updatedExpenses);
      
      // Save to localStorage for all users
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      // Save to Supabase if authenticated
      if (isAuthenticated) {
        await saveExpenseToSupabase(expense);
      }
      
      checkBudgetAlert(expense);
      
      const Icon = categoryIcons[expense.category];
      addBotMessage(
        `✅ Expense recorded: $${expense.amount.toFixed(2)} for ${expense.category}. Total expenses today: $${updatedExpenses
          .filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString())
          .reduce((sum, e) => sum + e.amount, 0)
          .toFixed(2)}`
      );
    } else {
      addBotMessage("I couldn't understand that expense. Please try something like: 'I spent $25 on lunch' or 'Taxi cost $15'");
    }
    
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Bot className="h-8 w-8" />
            <span>Expense Assistant</span>
          </h2>
          <p className="text-blue-100 mt-2">Tell me about your expenses in natural language</p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 bg-white">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Tell me about an expense... (e.g., 'I spent $25 on lunch')${isAuthenticated ? ' - Will be saved to cloud' : ''}`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          {!isAuthenticated && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              Sign in to sync your expenses across devices
            </p>
          )}
        </form>
      </div>

      {/* Today's Expenses Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryIcons).map(([category, Icon]) => {
            const todaysExpenses = expenses.filter(
              expense => expense.category === category && 
              new Date(expense.timestamp).toDateString() === new Date().toDateString()
            );
            const total = todaysExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
            return (
              <div key={category} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`${categoryColors[category as keyof typeof categoryColors]} p-2 rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 capitalize">{category}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{todaysExpenses.length} expenses</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChat;