import React from 'react';
import { Plane } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading TravelPlanner</h2>
        <p className="text-gray-600">Please wait while we prepare your travel dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;