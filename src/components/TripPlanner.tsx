import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Camera, Star, ArrowRight, Users, Plane } from 'lucide-react';
import { supabase, getCurrentUserId } from '../lib/supabase';

interface ItineraryDay {
  day: number;
  activities: string[];
  attractions: string[];
  tips: string;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  highlights: string[];
  bestTime: string;
}

const TripPlanner = () => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [days, setDays] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPlanningForm, setShowPlanningForm] = useState(false);

  // Mock destinations data - in a real app, this would come from your backend
  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Santorini',
      country: 'Greece',
      description: 'Iconic white-washed buildings perched on dramatic cliffs overlooking the azure Aegean Sea.',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '5-7 days',
      highlights: ['Sunset in Oia', 'Wine tasting', 'Volcanic beaches'],
      bestTime: 'April - October'
    },
    {
      id: '2',
      name: 'Kyoto',
      country: 'Japan',
      description: 'Ancient temples, traditional gardens, and timeless cultural experiences in Japan\'s former capital.',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      duration: '4-6 days',
      highlights: ['Bamboo Grove', 'Golden Pavilion', 'Geisha districts'],
      bestTime: 'March - May, September - November'
    },
    {
      id: '3',
      name: 'Machu Picchu',
      country: 'Peru',
      description: 'The legendary lost city of the Incas, perched high in the Andes mountains.',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '3-5 days',
      highlights: ['Inca Trail', 'Sacred Valley', 'Huayna Picchu'],
      bestTime: 'May - September'
    },
    {
      id: '4',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Tropical paradise with ancient temples, lush rice terraces, and pristine beaches.',
      image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      duration: '7-10 days',
      highlights: ['Ubud rice terraces', 'Temple hopping', 'Beach relaxation'],
      bestTime: 'April - October'
    },
    {
      id: '5',
      name: 'Iceland',
      country: 'Iceland',
      description: 'Land of fire and ice with dramatic waterfalls, geysers, and the Northern Lights.',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      duration: '6-8 days',
      highlights: ['Blue Lagoon', 'Golden Circle', 'Northern Lights'],
      bestTime: 'June - August, September - March'
    },
    {
      id: '6',
      name: 'Tuscany',
      country: 'Italy',
      description: 'Rolling hills dotted with vineyards, medieval towns, and Renaissance art treasures.',
      image: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      duration: '5-7 days',
      highlights: ['Wine tours', 'Florence art', 'Countryside drives'],
      bestTime: 'April - June, September - October'
    },
    {
      id: '7',
      name: 'Maldives',
      country: 'Maldives',
      description: 'Crystal-clear waters, overwater bungalows, and pristine coral reefs in the Indian Ocean.',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '5-7 days',
      highlights: ['Overwater villas', 'Snorkeling', 'Spa treatments'],
      bestTime: 'November - April'
    },
    {
      id: '8',
      name: 'Norwegian Fjords',
      country: 'Norway',
      description: 'Majestic fjords carved by glaciers, with towering waterfalls and dramatic landscapes.',
      image: 'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      duration: '6-8 days',
      highlights: ['Geiranger Fjord', 'Midnight sun', 'Scenic railways'],
      bestTime: 'May - September'
    },
    {
      id: '9',
      name: 'Morocco',
      country: 'Morocco',
      description: 'Exotic markets, ancient medinas, and the gateway to the Sahara Desert.',
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      duration: '7-10 days',
      highlights: ['Marrakech souks', 'Sahara camping', 'Atlas Mountains'],
      bestTime: 'March - May, September - November'
    }
  ];

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();

    // Add scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe destination cards after a short delay to ensure they're rendered
    setTimeout(() => {
      const cards = document.querySelectorAll('.destination-card');
      cards.forEach((card) => observer.observe(card));
    }, 100);

    return () => observer.disconnect();
  }, []);

  const generateItinerary = async () => {
    if (!selectedDestination || !days) return;
    
    setIsGenerating(true);
    
    try {
      // Call the Supabase edge function to generate AI itinerary
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          destination: selectedDestination.name,
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
        destination: selectedDestination.name,
        days: parseInt(days),
        itinerary: generatedItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      
      // Save to Supabase if authenticated
      if (isAuthenticated) {
        await saveItineraryToSupabase(selectedDestination.name, parseInt(days), generatedItinerary);
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
            `Morning: Explore ${selectedDestination.name} city center`,
            `Afternoon: Visit local museums and galleries`,
            `Evening: Sunset dinner at rooftop restaurant`
          ],
          attractions: [
            `${selectedDestination.name} Historic District`,
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
        destination: selectedDestination.name,
        days: numDays,
        itinerary: fallbackItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      
      if (isAuthenticated) {
        await saveItineraryToSupabase(selectedDestination.name, numDays, fallbackItinerary);
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

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowPlanningForm(true);
    // Smooth scroll to planning form
    setTimeout(() => {
      document.getElementById('planning-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index === Math.floor(rating) && rating % 1 >= 0.5
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-blue-900 to-indigo-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1600)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light leading-relaxed">
              Explore handpicked destinations and create unforgettable memories with AI-powered itineraries
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <Plane className="h-5 w-5" />
              <span className="text-sm font-medium">Trusted by 50,000+ travelers worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From ancient wonders to natural paradises, discover the world's most captivating destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="destination-card group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleDestinationSelect(destination)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  {renderStars(destination.rating)}
                  <span className="text-sm font-semibold text-gray-800 ml-1">{destination.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{destination.duration}</span>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {destination.name}
                  </h3>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{destination.country}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {destination.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                  {destination.highlights.length > 2 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      +{destination.highlights.length - 2} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Best: {destination.bestTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Popular</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planning Form */}
      {showPlanningForm && selectedDestination && (
        <div id="planning-form" className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                  Plan Your Trip to {selectedDestination.name}
                </h3>
                <p className="text-gray-600">
                  Let our AI create a personalized itinerary just for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Selected Destination
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <img
                        src={selectedDestination.image}
                        alt={selectedDestination.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{selectedDestination.name}</p>
                        <p className="text-sm text-gray-600">{selectedDestination.country}</p>
                      </div>
                    </div>
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <button
                onClick={generateItinerary}
                disabled={!selectedDestination || !days || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating Your Perfect Itinerary...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Generate AI Itinerary{isAuthenticated ? ' & Save' : ''}</span>
                  </div>
                )}
              </button>
              
              {!isAuthenticated && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Sign in to save your itineraries to the cloud
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated Itinerary */}
      {itinerary.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Your {selectedDestination?.name} Itinerary
            </h3>
            <p className="text-xl text-gray-600">
              {days} days of unforgettable experiences await you
            </p>
          </div>
          
          <div className="space-y-8">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full text-lg">
                    Day {day.day}
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-200 to-transparent flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="flex items-center text-xl font-serif font-bold text-gray-800 mb-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Daily Activities
                    </h4>
                    <ul className="space-y-3">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-xl font-serif font-bold text-gray-800 mb-4">
                      <Camera className="h-5 w-5 mr-2 text-green-500" />
                      Must-Visit Attractions
                    </h4>
                    <ul className="space-y-3">
                      {day.attractions.map((attraction, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{attraction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-orange-600">💡 Pro Tip:</strong> {day.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TripPlanner;