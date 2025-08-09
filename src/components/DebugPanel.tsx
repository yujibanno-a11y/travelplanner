import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      environment: import.meta.env.MODE,
    };

    setDebugInfo(info);

    // Test Supabase connection
    try {
      const { data, error } = await supabase.auth.getSession();
      setTestResults(prev => ({
        ...prev,
        connection: error ? 'Failed' : 'Success',
        connectionError: error?.message
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        connection: 'Failed',
        connectionError: err.message
      }));
    }

    // Test signup capability
    try {
      // This will fail but we can check the error type
      await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        signupTest: err.message?.includes('User already registered') ? 'Available' : 'Error',
        signupError: err.message
      }));
    }
  };

  const testSignup = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    try {
      console.log('Testing signup with:', testEmail);
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        console.error('Test signup error:', error);
        setTestResults(prev => ({
          ...prev,
          lastTest: 'Failed',
          lastTestError: error.message
        }));
      } else {
        console.log('Test signup success:', data);
        setTestResults(prev => ({
          ...prev,
          lastTest: 'Success',
          lastTestData: data
        }));
      }
    } catch (err: any) {
      console.error('Test signup exception:', err);
      setTestResults(prev => ({
        ...prev,
        lastTest: 'Exception',
        lastTestError: err.message
      }));
    }
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
              {debugInfo.supabaseUrl ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span>Supabase URL: {debugInfo.supabaseUrl ? 'Set' : 'Missing'}</span>
            </div>
            <div className="flex items-center">
              {debugInfo.supabaseKey === 'Present' ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span>Supabase Key: {debugInfo.supabaseKey}</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              <span>Environment: {debugInfo.environment}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Connection Tests</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              {testResults.connection === 'Success' ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span>Connection: {testResults.connection || 'Testing...'}</span>
            </div>
            {testResults.connectionError && (
              <div className="text-red-600 text-xs ml-6">
                {testResults.connectionError}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={testSignup}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Test Signup
          </button>
          {testResults.lastTest && (
            <div className="mt-2">
              <div className="flex items-center">
                {testResults.lastTest === 'Success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span>Last Test: {testResults.lastTest}</span>
              </div>
              {testResults.lastTestError && (
                <div className="text-red-600 text-xs mt-1">
                  {testResults.lastTestError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;