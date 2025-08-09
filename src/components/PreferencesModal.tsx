import React, { useState } from 'react';
import { X, Settings, DollarSign, Clock, Heart, Accessibility } from 'lucide-react';
import { UserPreferences } from '../types/chat';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  const interestOptions = [
    'History & Culture',
    'Food & Dining',
    'Nature & Outdoors',
    'Art & Museums',
    'Nightlife',
    'Shopping',
    'Architecture',
    'Photography',
    'Adventure Sports',
    'Local Experiences',
    'Beaches',
    'Mountains',
  ];

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Halal',
    'Kosher',
    'Dairy-free',
    'Nut allergies',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Travel Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Budget */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Budget: ${localPreferences.budget}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={localPreferences.budget}
                onChange={(e) => setLocalPreferences(prev => ({ 
                  ...prev, 
                  budget: parseInt(e.target.value) 
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$50</span>
                <span>$500</span>
              </div>
            </div>
          </div>

          {/* Pace */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Travel Pace</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['relaxed', 'moderate', 'packed'] as const).map((pace) => (
                <button
                  key={pace}
                  onClick={() => setLocalPreferences(prev => ({ ...prev, pace }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    localPreferences.pace === pace
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{pace}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {pace === 'relaxed' && 'Lots of free time'}
                    {pace === 'moderate' && 'Balanced schedule'}
                    {pace === 'packed' && 'Action-packed days'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localPreferences.interests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLocalPreferences(prev => ({
                          ...prev,
                          interests: [...prev.interests, interest]
                        }));
                      } else {
                        setLocalPreferences(prev => ({
                          ...prev,
                          interests: prev.interests.filter(i => i !== interest)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Accessibility className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localPreferences.accessibility.mobility}
                  onChange={(e) => setLocalPreferences(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, mobility: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mobility considerations needed</span>
              </label>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Dietary Requirements</h4>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((dietary) => (
                    <label key={dietary} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={localPreferences.accessibility.dietary.includes(dietary)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalPreferences(prev => ({
                              ...prev,
                              accessibility: {
                                ...prev.accessibility,
                                dietary: [...prev.accessibility.dietary, dietary]
                              }
                            }));
                          } else {
                            setLocalPreferences(prev => ({
                              ...prev,
                              accessibility: {
                                ...prev.accessibility,
                                dietary: prev.accessibility.dietary.filter(d => d !== dietary)
                              }
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{dietary}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;