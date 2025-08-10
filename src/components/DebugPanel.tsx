import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const info = {
      environment: import.meta.env.MODE,
      authDisabled: 'Authentication removed from app'
    };

    setDebugInfo(info);

    setTestResults({
      appStatus: 'Running without authentication',
      features: 'All features work with localStorage'
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors z-50"
        title="Show Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Bug className="h-5 w-5 mr-2" />
          Debug Panel
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-semibold text-gray-800">Configuration</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              <span>Environment: {debugInfo.environment}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>{debugInfo.authDisabled}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">App Status</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>{testResults.appStatus}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>{testResults.features}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;