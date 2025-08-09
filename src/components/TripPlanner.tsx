import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building } from 'lucide-react';
import { supabase, getCurrentUserId } from '../lib/supabase';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const generateItinerary = async () => {
    if (!destination || !days) return;
    
    setIsGenerating(true);
    
    try {
      // Call the Supabase edge function to generate AI itinerary
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          destination: destination,
          days: parseInt(days)
        }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw error;
      }

      if (!data || !data.itinerary) {
        throw new Error('No itinerary data received');
      }

      const generatedItinerary = data.itinerary;
      setItinerary(generatedItinerary);
      
      // Save to both localStorage and Supabase
      const tripData = {
        destination,
        days: parseInt(days),
        itinerary: generatedItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      
      // Save to Supabase if authenticated
      if (isAuthenticated) {
        await saveItineraryToSupabase(destination, parseInt(days), generatedItinerary);
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Fallback to basic itinerary if AI generation fails
      const numDays = parseInt(days);
      const fallbackItinerary: ItineraryDay[] = [];
      
      for (let i = 1; i <= numDays; i++) {
        fallbackItinerary.push({
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
      
      setItinerary(fallbackItinerary);
      
      // Save fallback data
      const tripData = {
        destination,
        days: numDays,
        itinerary: fallbackItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      
      if (isAuthenticated) {
        await saveItineraryToSupabase(destination, numDays, fallbackItinerary);
      }
    }
    
    setIsGenerating(false);
  };

  const saveItineraryToSupabase = async (destination: string, days: number, itinerary: ItineraryDay[]) => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      // Create the main itinerary record
      const { data: itineraryRecord, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          owner_id: userId,
          destination: destination,
          days: days,
          itinerary_data: itinerary
        })
        .select()
        .single();

      if (itineraryError) {
        console.error('Error saving itinerary:', itineraryError);
        return;
      }

      // Create itinerary items for each day
      const itineraryItems = [];
      
      for (const day of itinerary) {
        // Add activities
        for (const activity of day.activities) {
          const timeOfDay = activity.toLowerCase().includes('morning') ? 'morning' :
                          activity.toLowerCase().includes('afternoon') ? 'afternoon' :
                          activity.toLowerCase().includes('evening') ? 'evening' : 'all_day';
          
          itineraryItems.push({
            itinerary_id: itineraryRecord.id,
            day_number: day.day,
            type: 'activity',
            title: activity.split(':')[1]?.trim() || activity,
            description: activity,
            time_of_day: timeOfDay,
            estimated_cost: Math.floor(Math.random() * 50) + 10 // Random cost for demo
          });
        }

        // Add attractions
        for (const attraction of day.attractions) {
          itineraryItems.push({
            itinerary_id: itineraryRecord.id,
            day_number: day.day,
            type: 'attraction',
            title: attraction,
            description: `Visit ${attraction}`,
            estimated_cost: Math.floor(Math.random() * 30) + 5
          });
        }

        // Add tip
        itineraryItems.push({
          itinerary_id: itineraryRecord.id,
          day_number: day.day,
          type: 'tip',
          title: `Day ${day.day} Tip`,
          description: day.tips,
          estimated_cost: 0
        });
      }

      const { error: itemsError } = await supabase
        .from('itinerary_items')
        .insert(itineraryItems);

      if (itemsError) {
        console.error('Error saving itinerary items:', itemsError);
      } else {
        console.log('Itinerary saved successfully to Supabase!');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Trip Planning Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Plan Your Perfect Trip</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you traveling to?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              <span>AI is Creating Your Itinerary...</span>
            </div>
          ) : (
            `Generate AI Itinerary${isAuthenticated ? ' & Save' : ''}`
          )}
        </button>
        
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            Sign in to save your itineraries to the cloud
          </p>
        )}
      </div>

      {/* Generated Itinerary */}
      {itinerary.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Your {destination} Itinerary ({days} Days)
            </h3>
          </div>
          
          {itinerary.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-2 px-4 rounded-full">
                  Day {day.day}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Activities
                  </h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                    <Camera className="h-5 w-5 mr-2 text-green-500" />
                    Must-Visit Attractions
                  </h4>
                  <ul className="space-y-2">
                    {day.attractions.map((attraction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{attraction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-gray-700">
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