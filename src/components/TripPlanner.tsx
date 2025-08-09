import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building, ArrowRight } from 'lucide-react';

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
  highlights: string[];
  bestTime: string;
  duration: string;
}

const TripPlanner = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDestinations, setShowDestinations] = useState(true);

  // Featured destinations data
  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Santorini',
      country: 'Greece',
      description: 'Discover the magic of whitewashed villages perched on dramatic cliffs overlooking the azure Aegean Sea.',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Sunset in Oia', 'Wine Tasting', 'Volcanic Beaches'],
      bestTime: 'April - October',
      duration: '4-7 days'
    },
    {
      id: '2',
      name: 'Kyoto',
      country: 'Japan',
      description: 'Immerse yourself in ancient temples, traditional gardens, and the timeless beauty of Japanese culture.',
      image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Bamboo Forest', 'Golden Pavilion', 'Geisha District'],
      bestTime: 'March - May, September - November',
      duration: '5-8 days'
    },
    {
      id: '3',
      name: 'Machu Picchu',
      country: 'Peru',
      description: 'Journey to the lost city of the Incas, nestled high in the Andes mountains with breathtaking views.',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Inca Trail', 'Sacred Valley', 'Cusco'],
      bestTime: 'May - September',
      duration: '7-10 days'
    },
    {
      id: '4',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Experience tropical paradise with lush rice terraces, ancient temples, and pristine beaches.',
      image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Ubud Rice Terraces', 'Temple Hopping', 'Beach Relaxation'],
      bestTime: 'April - October',
      duration: '7-14 days'
    },
    {
      id: '5',
      name: 'Iceland',
      country: 'Iceland',
      description: 'Witness the raw power of nature with glaciers, geysers, waterfalls, and the mesmerizing Northern Lights.',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Ring Road'],
      bestTime: 'June - August, September - March',
      duration: '7-12 days'
    },
    {
      id: '6',
      name: 'Tuscany',
      country: 'Italy',
      description: 'Savor the romance of rolling hills, medieval towns, world-class wines, and Renaissance art.',
      image: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Wine Tours', 'Florence Art', 'Countryside Villages'],
      bestTime: 'April - June, September - October',
      duration: '5-10 days'
    },
    {
      id: '7',
      name: 'Patagonia',
      country: 'Chile & Argentina',
      description: 'Explore one of the world\'s last great wildernesses with towering peaks, glacial lakes, and endless skies.',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Torres del Paine', 'Glacier Trekking', 'Wildlife Watching'],
      bestTime: 'November - March',
      duration: '10-14 days'
    },
    {
      id: '8',
      name: 'Morocco',
      country: 'Morocco',
      description: 'Journey through imperial cities, bustling souks, and the golden dunes of the Sahara Desert.',
      image: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Marrakech Medina', 'Sahara Desert', 'Atlas Mountains'],
      bestTime: 'March - May, September - November',
      duration: '7-12 days'
    },
    {
      id: '9',
      name: 'New Zealand',
      country: 'New Zealand',
      description: 'Adventure awaits in a land of dramatic landscapes, from fjords and mountains to pristine beaches.',
      image: 'https://images.pexels.com/photos/552779/pexels-photo-552779.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: ['Milford Sound', 'Adventure Sports', 'Hobbiton'],
      bestTime: 'December - February, March - May',
      duration: '10-21 days'
    }
  ];

  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Animate cards on load
    const timer = setTimeout(() => {
      destinations.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 100);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const selectDestination = (dest: Destination) => {
    setDestination(`${dest.name}, ${dest.country}`);
    setDays('7'); // Default to 7 days
    setShowDestinations(false);
  };

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

  const resetToDestinations = () => {
    setShowDestinations(true);
    setItinerary([]);
    setDestination('');
    setDays('');
  };

  if (!showDestinations) {
    return (
      <div className="space-y-8">
        {/* Trip Planning Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Plan Your Perfect Trip</h2>
            </div>
            <button
              onClick={resetToDestinations}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Browse Destinations
            </button>
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
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 leading-tight">
              Discover Your Next
              <span className="block font-medium">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Explore handpicked destinations around the world and create unforgettable memories
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From ancient wonders to natural marvels, discover the world's most captivating places
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className={`group cursor-pointer transform transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              onClick={() => selectDestination(destination)}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={`${destination.name}, ${destination.country}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <ArrowRight className="h-6 w-6 text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-2xl font-serif font-medium text-gray-900 mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {destination.country}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {destination.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  {/* Trip Details */}
                  <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <span>Best: {destination.bestTime}</span>
                    <span>{destination.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Can't find your dream destination? Let our AI help you plan the perfect trip.
          </p>
          <button
            onClick={() => setShowDestinations(false)}
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create Custom Itinerary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;