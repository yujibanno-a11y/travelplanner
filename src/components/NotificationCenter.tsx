import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

interface Notification {
  id: string;
  type: 'budget_exceeded' | 'category_limit' | 'daily_summary' | 'recommendation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [textNotifications, setTextNotifications] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications).map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp)
      }));
      setNotifications(parsed);
    }

    // Load notification settings
    const settings = localStorage.getItem('notificationSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setEmailNotifications(parsedSettings.email ?? true);
      setTextNotifications(parsedSettings.text ?? true);
      setDailySummary(parsedSettings.dailySummary ?? true);
      setBudgetAlerts(parsedSettings.budgetAlerts ?? true);
    }

    // Generate some sample notifications
    generateSampleNotifications();
  }, []);

  const generateSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'budget_exceeded',
        title: 'Daily Budget Exceeded',
        message: 'You have spent $85 today, exceeding your daily limit of $75.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: '2',
        type: 'category_limit',
        title: 'Food Budget Alert',
        message: 'Your food expenses for today ($35) have reached your daily limit.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false
      },
      {
        id: '3',
        type: 'daily_summary',
        title: 'Daily Expense Summary',
        message: 'Yesterday you spent $62 total. Food: $25, Transportation: $15, Activities: $22.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Budget-Friendly Recommendation',
        message: 'Based on your remaining budget, try the local food market for affordable meals!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false
      }
    ];

    const existing = localStorage.getItem('notifications');
    if (!existing) {
      setNotifications(sampleNotifications);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const saveNotificationSettings = () => {
    const settings = {
      email: emailNotifications,
      text: textNotifications,
      dailySummary,
      budgetAlerts
    };
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Add a confirmation notification
    const confirmationNotif: Notification = {
      id: Date.now().toString(),
      type: 'recommendation',
      title: 'Settings Updated',
      message: 'Your notification preferences have been saved successfully.',
      timestamp: new Date(),
      read: false
    };
    
    const updated = [confirmationNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_exceeded':
      case 'category_limit':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'daily_summary':
        return <Info className="h-6 w-6 text-blue-500" />;
      case 'recommendation':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="space-y-8 pb-96">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
              <Bell className="h-8 w-8 text-dark-900" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white text-glow">Notification Center</h2>
          </div>
          <p className="text-white/80">Stay updated with your travel expenses and budget alerts</p>
          {unreadCount > 0 && (
            <div className="mt-4 glass backdrop-blur-md rounded-lg p-3 border border-primary-400/30 bg-primary-500/10">
              <p className="font-medium text-white">You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <GlassCard className="p-6" glow="secondary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-3 rounded-2xl shadow-glow-secondary">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-white text-glow">Notification Settings</h3>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Delivery Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-white/80">Email Notifications</span>
                </label>
              
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={textNotifications}
                    onChange={(e) => setTextNotifications(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-white/80">SMS/Text Messages</span>
                </label>
              </div>
            </div>
          
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Alert Types</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={budgetAlerts}
                    onChange={(e) => setBudgetAlerts(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-white/80">Budget Exceeded Alerts</span>
                </label>
              
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={dailySummary}
                    onChange={(e) => setDailySummary(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-white/80">Daily Expense Summary</span>
                </label>
              </div>
            </div>
          </div>
        
          <div className="mt-6">
            <GlassButton
              variant="primary"
              onClick={saveNotificationSettings}
              className="px-6 py-3 shadow-glow-primary"
            >
              Save Settings
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <GlassCard className="border border-white/20" glow="primary">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-display font-bold text-white text-glow">Recent Notifications</h3>
          </div>
        
          <div className="divide-y divide-white/10">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-white/5 transition-colors duration-200 ${
                  !notification.read ? 'bg-primary-500/10 border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-semibold ${
                          !notification.read ? 'text-white' : 'text-white/80'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-2">{notification.message}</p>
                      <p className="text-xs text-white/50">
                        {notification.timestamp.toLocaleDateString()} at{' '}
                        {notification.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-white/60">You're all caught up! New notifications will appear here.</p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NotificationCenter;