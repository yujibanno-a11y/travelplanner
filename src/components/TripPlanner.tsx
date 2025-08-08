import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building } from 'lucide-react';

interface ItineraryDay {
  day: number;
  activities: string[];
  attractions: string[];
  tips: string;
}

const TripPlanner = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulated AI-generated itineraries
  const generateItinerary = async () => {
    if (!destination || !days) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const numDays = parseInt(days);
    const mockItinerary: ItineraryDay[] = [];
    
    for (let i = 1; i <= numDays; i++) {
      mockItinerary.push({
        day: i,
        activities: [
          `Morning: Explore ${destination} city center`,
          `Afternoon: Visit local museums and galleries`,
          `Evening: Sunset dinner at rooftop restaurant`
        ],
        attractions: [
          `${destination} Historic District`,
          'Local Art Museum',
          'Central Park/Square',
          'Popular Viewpoint'
        ],
        tips: `Don't forget to try the local cuisine and bring comfortable walking shoes for day ${i}!`
      });
    }
    
    setItinerary(mockItinerary);
    setIsGenerating(false);
    
    // Save to localStorage
    localStorage.setItem('currentTrip', JSON.stringify({
      destination,
      days: numDays,
      itinerary: mockItinerary
    }));
  };

  return (
    <div className="space-y-8">
      {/* Trip Planning Form */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Plan Your Perfect Trip</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you traveling to?"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Number of Days
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="How many days?"
              min="1"
              max="30"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <button
          onClick={generateItinerary}
          disabled={!destination || !days || isGenerating}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Your Itinerary...</span>
            </div>
          ) : (
            'Generate AI Itinerary'
          )}
        </button>
      </div>

      {/* Generated Itinerary */}
      {itinerary.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Your {destination} Itinerary ({days} Days)
            </h3>
          </div>
          
          {itinerary.map((day) => (
            <div key={day.day} className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-2 px-4 rounded-full">
                  Day {day.day}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Activities
                  </h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-white mb-3">
                    <Camera className="h-5 w-5 mr-2 text-green-500" />
                    Must-Visit Attractions
                  </h4>
                  <ul className="space-y-2">
                    {day.attractions.map((attraction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{attraction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50">
                <p className="text-sm text-gray-300">
                  <strong>💡 Tip:</strong> {day.tips}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripPlanner;