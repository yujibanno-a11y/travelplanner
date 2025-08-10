import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Globe, Palette, Shield, Save } from 'lucide-react';

interface UserSettings {
  name: string;
  email: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    currency: 'USD',
    language: 'en',
    theme: 'light',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      shareData: false,
      analytics: true,
      marketing: false
    }
  });

  const [activeSection, setActiveSection] = useState<'profile' | 'preferences' | 'notifications' | 'privacy'>('profile');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (section: keyof UserSettings, field: string, value: any) => {
    if (typeof settings[section] === 'object' && settings[section] !== null) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section] as object,
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Trigger a custom event to notify other components of settings change
    window.dispatchEvent(new Event('storage'));
    
    alert('Settings saved successfully!');
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <SettingsIcon className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Settings</h2>
        </div>
        <p className="text-gray-300">Customize your TravelPlanner experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Settings Menu</h3>
            </div>
            <nav className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => handleSettingChange('name' as any, 'name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email' as any, 'email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your profile information is stored locally on your device and is not shared with external services.
                  </p>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency' as any, 'currency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language' as any, 'language', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {languages.map(language => (
                        <option key={language.code} value={language.code}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme' as any, 'theme', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone' as any, 'timezone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {timezones.map(timezone => (
                        <option key={timezone} value={timezone}>
                          {timezone.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={saveSettings}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;