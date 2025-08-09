import React, { useState } from 'react';
import { MapPin, Calendar, Users, Sparkles, Plane } from 'lucide-react';

interface Activity {
  time: string;
  activity: string;
  place: string;
}

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  days: number;
}

const TripPlanner = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [generatedPlan, setGeneratedPlan] = useState<DayPlan[]>([]);
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Destination-specific data
  const destinationData = {
    'paris': {
      activities: [
        'Visit the Eiffel Tower at sunset',
        'Explore the Louvre Museum',
        'Stroll along the Seine River',
        'Visit Notre-Dame Cathedral',
        'Walk through Montmartre district',
        'Experience the Champs-Élysées',
        'Discover Sacré-Cœur Basilica',
        'Enjoy a Seine River cruise',
        'Visit the Arc de Triomphe',
        'Explore the Latin Quarter',
        'Tour Versailles Palace',
        'Visit Musée d\'Orsay'
      ],
      places: [
        'Café de Flore (iconic Parisian café)',
        'Le Marais (historic district)',
        'Trocadéro Gardens (Eiffel Tower views)',
        'Île de la Cité (historic island)',
        'Père Lachaise Cemetery (famous graves)',
        'Sainte-Chapelle (stunning stained glass)'
      ]
    },
    'tokyo': {
      activities: [
        'Visit Senso-ji Temple in Asakusa',
        'Explore the bustling Shibuya Crossing',
        'Experience traditional tea ceremony',
        'Visit Tokyo Skytree for panoramic views',
        'Stroll through Ueno Park',
        'Discover Harajuku fashion district',
        'Visit Meiji Shrine',
        'Explore Tsukiji Outer Market',
        'Take a day trip to Mount Fuji',
        'Experience a traditional ryokan',
        'Visit teamLab Borderless digital art museum',
        'Explore Ginza shopping district'
      ],
      places: [
        'Golden Gai (tiny bars in Shinjuku)',
        'Akihabara (electronics district)',
        'Roppongi Hills (modern complex)',
        'Imperial Palace East Gardens',
        'Odaiba (artificial island)',
        'Nakamise Shopping Street'
      ]
    },
    'london': {
      activities: [
        'Visit Big Ben and Houses of Parliament',
        'Explore Tower of London and Crown Jewels',
        'Ride the London Eye',
        'Walk across Tower Bridge',
        'British Museum exploration',
        'Hyde Park strolls',
        'Buckingham Palace guard ceremony',
        'Camden Market visits',
        'West End theater show',
        'Thames River cruise',
        'Visit Tate Modern',
        'Explore Borough Market'
      ],
      places: [
        'Westminster Abbey (historic coronation site)',
        'Covent Garden (entertainment district)',
        'The Shard (panoramic city views)',
        'Notting Hill (colorful neighborhood)',
        'Greenwich (maritime history)',
        'Kensington Palace (royal residence)'
      ]
    },
    'morocco': {
      activities: [
        'Explore Marrakech souks and Jemaa el-Fnaa square',
        'Take a Sahara Desert tour with camel trekking',
        'Wander through Fez medina and traditional crafts',
        'Visit Casablanca Hassan II Mosque',
        'Trek in the Atlas Mountains',
        'Discover the blue city of Chefchaouen',
        'Experience traditional Moroccan hammam',
        'Taste authentic tagines and mint tea',
        'Visit Bahia Palace in Marrakech',
        'Explore Ait Benhaddou kasbah',
        'Shop for Berber carpets and pottery',
        'Watch sunset from Marrakech rooftops'
      ],
      places: [
        'Majorelle Garden (botanical paradise)',
        'Koutoubia Mosque (iconic minaret)',
        'Todra Gorge (dramatic canyon)',
        'Essaouira (coastal fortress city)',
        'Volubilis (Roman ruins)',
        'Ouarzazate (gateway to Sahara)'
      ]
    },
    'india': {
      activities: [
        'Visit the iconic Taj Mahal at sunrise',
        'Explore the Golden Temple in Amritsar',
        'Take a houseboat cruise in Kerala backwaters',
        'Experience the vibrant colors of Holi festival',
        'Visit Rajasthan palaces and forts',
        'Explore the caves of Ajanta and Ellora',
        'Take a spiritual journey to Varanasi ghats',
        'Discover the beaches of Goa',
        'Trek in the Himalayas',
        'Experience Ayurvedic treatments',
        'Visit the Pink City of Jaipur',
        'Explore Mumbai\'s Bollywood culture'
      ],
      places: [
        'Red Fort (Mughal architecture)',
        'Hampi (ancient ruins)',
        'Rishikesh (yoga capital)',
        'Udaipur (city of lakes)',
        'Khajuraho (temple sculptures)',
        'Darjeeling (tea gardens)'
      ]
    },
    'hyderabad': {
      activities: [
        'Visit the iconic Charminar monument',
        'Explore Golconda Fort and its acoustics',
        'Take a boat ride on Hussain Sagar Lake',
        'Visit Ramoji Film City studios',
        'Explore Salar Jung Museum collections',
        'Experience authentic Hyderabadi biryani',
        'Visit Chowmahalla Palace',
        'Stroll through Laad Bazaar for bangles',
        'Explore Qutb Shahi Tombs',
        'Visit Birla Mandir temple',
        'Experience Nizami culture and heritage',
        'Shop at Begum Bazaar'
      ],
      places: [
        'Jubilee Hills (upscale neighborhood)',
        'Banjara Hills (shopping and dining)',
        'Old City (historic quarter)',
        'Hitec City (IT hub)',
        'Shilparamam (arts and crafts village)',
        'Durgam Cheruvu (secret lake)'
      ]
    },
    'bangalore': {
      activities: [
        'Stroll through Lalbagh Botanical Gardens',
        'Visit Bangalore Palace and its architecture',
        'Experience the city\'s famous craft breweries',
        'Take a day trip to Nandi Hills',
        'Explore Cubbon Park in the city center',
        'Visit ISKCON Temple',
        'Discover the tech culture in Electronic City',
        'Shop at Commercial Street',
        'Visit Tipu Sultan\'s Summer Palace',
        'Experience the nightlife on Brigade Road',
        'Explore Ulsoor Lake',
        'Visit the Government Museum'
      ],
      places: [
        'MG Road (shopping and dining hub)',
        'Koramangala (trendy neighborhood)',
        'Indiranagar (pub district)',
        'Whitefield (IT corridor)',
        'Jayanagar (traditional area)',
        'Malleswaram (cultural heart)'
      ]
    },
    'delhi': {
      activities: [
        'Explore the historic Red Fort',
        'Visit India Gate and Rajpath',
        'Discover the beautiful Lotus Temple',
        'Wander through Chandni Chowk markets',
        'Visit Humayun\'s Tomb',
        'Explore Qutub Minar complex',
        'Experience Old Delhi\'s street food',
        'Visit Akshardham Temple',
        'Stroll through Lodhi Gardens',
        'Explore the National Museum',
        'Visit Jama Masjid mosque',
        'Shop at Connaught Place'
      ],
      places: [
        'Khan Market (upscale shopping)',
        'Hauz Khas Village (trendy area)',
        'Karol Bagh (shopping district)',
        'Dilli Haat (handicrafts market)',
        'Raj Ghat (Gandhi memorial)',
        'Purana Qila (old fort)'
      ]
    },
    'mumbai': {
      activities: [
        'Visit the iconic Gateway of India',
        'Stroll along Marine Drive at sunset',
        'Explore Elephanta Caves by ferry',
        'Experience Bollywood culture in Film City',
        'Discover the vibrant street food scene',
        'Visit the Chhatrapati Shivaji Terminus',
        'Explore the Dhobi Ghat laundry',
        'Shop at Crawford Market',
        'Visit Haji Ali Dargah',
        'Experience the nightlife in Bandra',
        'Take a local train ride',
        'Visit Sanjay Gandhi National Park'
      ],
      places: [
        'Colaba Causeway (shopping street)',
        'Juhu Beach (celebrity spotting)',
        'Bandra-Worli Sea Link (engineering marvel)',
        'Chor Bazaar (antique market)',
        'Hanging Gardens (terraced park)',
        'Worli (business district)'
      ]
    },
    'france': {
      activities: [
        'Visit the Palace of Versailles',
        'Explore the châteaux of Loire Valley',
        'Experience wine tasting in Bordeaux',
        'Discover the French Riviera beaches',
        'Visit Mont-Saint-Michel abbey',
        'Explore Provence lavender fields',
        'Take a cooking class in Lyon',
        'Visit the D-Day beaches in Normandy',
        'Explore the medieval city of Carcassonne',
        'Experience the glamour of Cannes',
        'Visit the papal palace in Avignon',
        'Discover the caves of Lascaux'
      ],
      places: [
        'Annecy (Venice of the Alps)',
        'Saint-Tropez (luxury resort town)',
        'Giverny (Monet\'s garden)',
        'Rocamadour (cliffside village)',
        'Colmar (fairy-tale town)',
        'Étretat (dramatic cliffs)'
      ]
    },
    'new york': {
      activities: [
        'Visit the Statue of Liberty and Ellis Island',
        'Explore Central Park and its attractions',
        'See a Broadway show in Times Square',
        'Visit the 9/11 Memorial and Museum',
        'Explore the Metropolitan Museum of Art',
        'Walk across the Brooklyn Bridge',
        'Visit the High Line elevated park',
        'Explore diverse neighborhoods like SoHo',
        'Take a food tour in various boroughs',
        'Visit the Empire State Building',
        'Explore the Museum of Modern Art',
        'Experience the nightlife in Greenwich Village'
      ],
      places: [
        'Little Italy (authentic Italian culture)',
        'Chinatown (vibrant Asian community)',
        'Wall Street (financial district)',
        'Coney Island (historic amusement park)',
        'Williamsburg (trendy Brooklyn neighborhood)',
        'The Vessel (architectural marvel)'
      ]
    },
    'dubai': {
      activities: [
        'Visit the Burj Khalifa observation deck',
        'Explore the Dubai Mall and aquarium',
        'Take a desert safari with dune bashing',
        'Visit the traditional Gold and Spice Souks',
        'Experience luxury shopping and dining',
        'Take a dhow cruise along Dubai Creek',
        'Visit the Palm Jumeirah artificial island',
        'Explore the Dubai Miracle Garden',
        'Experience indoor skiing at Ski Dubai',
        'Visit the Dubai Fountain show',
        'Explore the historic Al Fahidi district',
        'Take a hot air balloon ride over the desert'
      ],
      places: [
        'Jumeirah Beach (pristine coastline)',
        'Dubai Marina (waterfront district)',
        'Downtown Dubai (modern city center)',
        'Deira (traditional trading area)',
        'Business Bay (commercial hub)',
        'Al Seef (heritage waterfront)'
      ]
    }
  };

  // Destination-specific images
  const getDestinationImage = (dest: string) => {
    const lowerDest = dest.toLowerCase();
    
    // Check for specific destinations
    if (lowerDest.includes('morocco')) {
      return 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('paris')) {
      return 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('tokyo')) {
      return 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('london')) {
      return 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('india') || lowerDest.includes('delhi') || lowerDest.includes('mumbai') || lowerDest.includes('bangalore') || lowerDest.includes('hyderabad')) {
      return 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('dubai')) {
      return 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('france')) {
      return 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (lowerDest.includes('new york')) {
      return 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    
    // Default travel image
    return 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const findDestinationData = (searchTerm: string) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    // First try exact match
    if (destinationData[lowerSearch as keyof typeof destinationData]) {
      return destinationData[lowerSearch as keyof typeof destinationData];
    }
    
    // Then try partial matching
    for (const [key, data] of Object.entries(destinationData)) {
      if (key.includes(lowerSearch) || lowerSearch.includes(key)) {
        return data;
      }
    }
    
    // Special cases for common variations
    if (lowerSearch.includes('new delhi') || lowerSearch.includes('newdelhi')) {
      return destinationData.delhi;
    }
    
    return null;
  };

  const generateItinerary = () => {
    if (!destination || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    if (days <= 0) {
      alert('End date must be after start date');
      setIsGenerating(false);
      return;
    }

    // Get destination-specific data
    const destData = findDestinationData(destination);
    
    // Generate itinerary
    setTimeout(() => {
      const plan: DayPlan[] = [];
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        const activities: Activity[] = [];
        
        if (destData) {
          // Use destination-specific activities
          const availableActivities = [...destData.activities];
          const availablePlaces = [...destData.places];
          
          // Ensure we have enough activities for the day
          const activitiesNeeded = Math.min(4, Math.max(2, Math.floor(availableActivities.length / days)));
          const placesNeeded = Math.min(2, Math.max(1, Math.floor(availablePlaces.length / days)));
          
          // Select activities for this day
          for (let j = 0; j < activitiesNeeded && availableActivities.length > 0; j++) {
            const activityIndex = (i * activitiesNeeded + j) % availableActivities.length;
            const activity = availableActivities[activityIndex];
            
            activities.push({
              time: j === 0 ? '9:00 AM' : j === 1 ? '1:00 PM' : j === 2 ? '4:00 PM' : '7:00 PM',
              activity: activity,
              place: availablePlaces[j % availablePlaces.length] || `Local area in ${destination}`
            });
          }
          
          // Add places if we have fewer activities
          if (activities.length < 3 && availablePlaces.length > 0) {
            for (let k = activities.length; k < Math.min(3, activities.length + placesNeeded); k++) {
              const placeIndex = k % availablePlaces.length;
              activities.push({
                time: k === 2 ? '4:00 PM' : '7:00 PM',
                activity: `Explore and discover`,
                place: availablePlaces[placeIndex]
              });
            }
          }
        } else {
          // Generic activities with destination name
          const genericActivities = [
            `Explore the main attractions of ${destination}`,
            `Visit local markets and shopping areas in ${destination}`,
            `Try authentic local cuisine in ${destination}`,
            `Take a guided tour of ${destination}`,
            `Visit museums and cultural sites in ${destination}`,
            `Enjoy outdoor activities in ${destination}`,
            `Experience the nightlife in ${destination}`,
            `Take photos at iconic spots in ${destination}`
          ];
          
          const genericPlaces = [
            `City center of ${destination}`,
            `Historic district of ${destination}`,
            `Popular restaurant in ${destination}`,
            `Local market in ${destination}`,
            `Scenic viewpoint in ${destination}`,
            `Cultural center in ${destination}`
          ];
          
          for (let j = 0; j < 3; j++) {
            activities.push({
              time: j === 0 ? '9:00 AM' : j === 1 ? '1:00 PM' : '6:00 PM',
              activity: genericActivities[j % genericActivities.length],
              place: genericPlaces[j % genericPlaces.length]
            });
          }
        }
        
        plan.push({
          day: i + 1,
          date: currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          activities
        });
      }
      
      setGeneratedPlan(plan);
      setCurrentTrip({
        destination,
        startDate,
        endDate,
        travelers,
        days
      });
      
      // Save to localStorage
      localStorage.setItem('currentTrip', JSON.stringify({
        destination,
        startDate,
        endDate,
        travelers,
        days
      }));
      
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getDestinationImage(destination)}
            alt="Travel destination"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Plan Your Perfect Trip</h2>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Create personalized itineraries with AI-powered recommendations tailored to your preferences and budget.
          </p>
        </div>
      </div>

      {/* Trip Planning Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Travelers
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateItinerary}
          disabled={isGenerating}
          className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <Sparkles className="h-5 w-5" />
          <span>{isGenerating ? 'Generating Your Perfect Trip...' : 'Generate AI Itinerary'}</span>
        </button>
      </div>

      {/* Generated Itinerary */}
      {generatedPlan.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Your {currentTrip?.days}-Day Trip to {currentTrip?.destination}
            </h3>
            <p className="text-green-100">
              {currentTrip?.travelers} {currentTrip?.travelers === 1 ? 'traveler' : 'travelers'} • 
              {new Date(currentTrip?.startDate || '').toLocaleDateString()} - {new Date(currentTrip?.endDate || '').toLocaleDateString()}
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {generatedPlan.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Day {day.day}</h4>
                      <p className="text-gray-600">{day.date}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium min-w-fit">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{activity.activity}</h5>
                          <p className="text-gray-600 text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {activity.place}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;