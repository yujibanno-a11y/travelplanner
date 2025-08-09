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

interface TripPlan {
  destination: string;
  duration: number;
  travelers: number;
  days: DayPlan[];
}

const TripPlanner = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Destination-specific data
  const destinationData = {
    'paris': {
      activities: [
        'Visit the Eiffel Tower',
        'Explore the Louvre Museum',
        'Walk along the Seine River',
        'Visit Notre-Dame Cathedral',
        'Stroll through Montmartre',
        'Shop on Champs-Élysées',
        'Visit Sacré-Cœur Basilica',
        'Explore Latin Quarter',
        'Take a Seine River cruise',
        'Visit Arc de Triomphe',
        'Explore Marais district',
        'Visit Versailles Palace'
      ],
      places: [
        'Café de Flore (iconic Parisian café)',
        'Le Marais (historic Jewish quarter)',
        'Trocadéro (best Eiffel Tower views)',
        'Île de la Cité (historic island)',
        'Saint-Germain-des-Prés (literary district)',
        'Belleville (trendy neighborhood)'
      ]
    },
    'tokyo': {
      activities: [
        'Visit Senso-ji Temple',
        'Explore Shibuya Crossing',
        'Experience Tokyo Skytree',
        'Walk through Harajuku',
        'Visit Meiji Shrine',
        'Explore Tsukiji Fish Market',
        'Take a sumo wrestling tour',
        'Visit Imperial Palace',
        'Experience a traditional tea ceremony',
        'Explore Akihabara electronics district',
        'Visit Ueno Park and museums',
        'Take a day trip to Mount Fuji'
      ],
      places: [
        'Golden Gai (tiny bar district)',
        'Ameya-Yokocho Market (traditional market)',
        'Roppongi Hills (modern complex)',
        'Ginza (upscale shopping)',
        'Asakusa (traditional district)',
        'Odaiba (futuristic island)'
      ]
    },
    'london': {
      activities: [
        'Visit Big Ben and Houses of Parliament',
        'Explore Tower of London and Crown Jewels',
        'Ride the London Eye',
        'Walk across Tower Bridge',
        'Visit British Museum',
        'Stroll through Hyde Park',
        'Watch changing of the guard at Buckingham Palace',
        'Explore Camden Market',
        'Visit Westminster Abbey',
        'Take a Thames River cruise',
        'Explore Borough Market',
        'Visit Tate Modern'
      ],
      places: [
        'Covent Garden (entertainment district)',
        'The Shard (panoramic city views)',
        'Notting Hill (colorful neighborhood)',
        'Greenwich (maritime history)',
        'Shoreditch (trendy area)',
        'Kensington (royal borough)'
      ]
    },
    'new york': {
      activities: [
        'Visit Statue of Liberty',
        'Explore Central Park',
        'See a Broadway show',
        'Visit Times Square',
        'Explore Brooklyn Bridge',
        'Visit 9/11 Memorial',
        'Tour Ellis Island',
        'Visit Metropolitan Museum',
        'Explore High Line park',
        'Visit Empire State Building',
        'Walk through Greenwich Village',
        'Explore Chinatown and Little Italy'
      ],
      places: [
        'SoHo (shopping and galleries)',
        'Williamsburg (hipster Brooklyn)',
        'The Village (bohemian culture)',
        'Financial District (Wall Street)',
        'Upper East Side (museums)',
        'Meatpacking District (nightlife)'
      ]
    },
    'rome': {
      activities: [
        'Visit the Colosseum',
        'Explore Vatican City and Sistine Chapel',
        'Throw a coin in Trevi Fountain',
        'Walk through Roman Forum',
        'Visit Pantheon',
        'Climb Spanish Steps',
        'Explore Trastevere neighborhood',
        'Visit Castel Sant\'Angelo',
        'Tour Palatine Hill',
        'Visit Villa Borghese',
        'Explore Capitoline Museums',
        'Take a food tour'
      ],
      places: [
        'Campo de\' Fiori (lively square)',
        'Piazza Navona (baroque architecture)',
        'Jewish Quarter (historic area)',
        'Aventine Hill (peaceful views)',
        'Testaccio (foodie neighborhood)',
        'Villa Giulia (Etruscan museum)'
      ]
    },
    'dubai': {
      activities: [
        'Visit Burj Khalifa',
        'Explore Dubai Mall',
        'Take a desert safari',
        'Visit Palm Jumeirah',
        'Explore Dubai Marina',
        'Visit Gold and Spice Souks',
        'Experience Dubai Fountain show',
        'Visit Jumeirah Beach',
        'Explore Dubai Creek',
        'Visit Miracle Garden',
        'Take an abra boat ride',
        'Visit Dubai Frame'
      ],
      places: [
        'Old Dubai (Al Fahidi district)',
        'Madinat Jumeirah (luxury resort)',
        'JBR Beach (beach walk)',
        'Business Bay (modern district)',
        'Al Seef (waterfront promenade)',
        'City Walk (outdoor shopping)'
      ]
    },
    'barcelona': {
      activities: [
        'Visit Sagrada Familia',
        'Explore Park Güell',
        'Walk down Las Ramblas',
        'Visit Gothic Quarter',
        'Explore Casa Batlló',
        'Visit Picasso Museum',
        'Relax at Barceloneta Beach',
        'Visit Camp Nou stadium',
        'Explore El Born district',
        'Visit Montjuïc Hill',
        'Tour Casa Milà',
        'Experience flamenco show'
      ],
      places: [
        'Boqueria Market (food market)',
        'Gracia (bohemian neighborhood)',
        'Poble Sec (trendy area)',
        'Eixample (modernist architecture)',
        'Vila de Gràcia (local charm)',
        'Port Vell (old port area)'
      ]
    },
    'amsterdam': {
      activities: [
        'Take a canal cruise',
        'Visit Anne Frank House',
        'Explore Rijksmuseum',
        'Walk through Jordaan district',
        'Visit Van Gogh Museum',
        'Cycle through Vondelpark',
        'Explore Red Light District',
        'Visit Bloemenmarkt flower market',
        'Tour Heineken Experience',
        'Visit Royal Palace',
        'Explore Museumplein',
        'Take a bike tour'
      ],
      places: [
        'Nine Streets (shopping area)',
        'Leidseplein (nightlife square)',
        'Nieuwmarkt (historic square)',
        'Plantage (cultural district)',
        'Noord (creative area)',
        'Oud-Zuid (upscale neighborhood)'
      ]
    },
    'thailand': {
      activities: [
        'Visit Grand Palace in Bangkok',
        'Explore floating markets',
        'Take a Thai cooking class',
        'Visit Wat Pho temple',
        'Experience Chatuchak Market',
        'Take a longtail boat tour',
        'Visit Ayutthaya ancient ruins',
        'Enjoy Thai massage',
        'Explore Chinatown Bangkok',
        'Visit Jim Thompson House',
        'Take a tuk-tuk tour',
        'Experience Muay Thai boxing'
      ],
      places: [
        'Khao San Road (backpacker street)',
        'Sukhumvit (expat area)',
        'Silom (business district)',
        'Thonburi (traditional side)',
        'Damnoen Saduak (floating market)',
        'Amphawa (weekend market)'
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
        'Shop for carpets and spices',
        'Watch sunset from Marrakech rooftops'
      ],
      places: [
        'Majorelle Garden (botanical paradise)',
        'Essaouira (coastal fortress city)',
        'Ouarzazate (gateway to Sahara)',
        'Rabat (capital city)',
        'Meknes (imperial city)',
        'Todra Gorge (dramatic canyon)'
      ]
    },
    'india': {
      activities: [
        'Visit the Taj Mahal in Agra',
        'Explore Red Fort in Delhi',
        'Take a boat ride in Kerala backwaters',
        'Visit Golden Temple in Amritsar',
        'Explore Rajasthan palaces',
        'Experience Ganga Aarti in Varanasi',
        'Visit Hampi ruins',
        'Take a tiger safari',
        'Explore Goa beaches',
        'Visit Ajanta and Ellora caves',
        'Experience Holi festival',
        'Take a heritage walk in Old Delhi'
      ],
      places: [
        'Jaipur (Pink City)',
        'Udaipur (City of Lakes)',
        'Rishikesh (Yoga capital)',
        'Pushkar (holy city)',
        'Munnar (hill station)',
        'Jodhpur (Blue City)'
      ]
    },
    'hyderabad': {
      activities: [
        'Visit iconic Charminar monument',
        'Explore Golconda Fort and sound show',
        'Take a boat ride in Hussain Sagar Lake',
        'Visit Ramoji Film City',
        'Explore Salar Jung Museum',
        'Experience Laad Bazaar shopping',
        'Visit Birla Mandir temple',
        'Taste authentic Hyderabadi biryani',
        'Explore Nehru Zoological Park',
        'Visit Qutb Shahi Tombs',
        'Experience Chowmahalla Palace',
        'Take a heritage walk in Old City'
      ],
      places: [
        'Banjara Hills (upscale area)',
        'Jubilee Hills (posh locality)',
        'Secunderabad (twin city)',
        'HITEC City (IT hub)',
        'Begumpet (central location)',
        'Kondapur (modern suburb)'
      ]
    },
    'bangalore': {
      activities: [
        'Stroll through Lalbagh Botanical Gardens',
        'Visit Bangalore Palace',
        'Explore Cubbon Park',
        'Experience craft brewery culture',
        'Visit Tipu Sultan\'s Summer Palace',
        'Take a day trip to Nandi Hills',
        'Explore UB City Mall',
        'Visit ISKCON Temple',
        'Experience Bangalore\'s pub scene',
        'Visit Vidhana Soudha',
        'Explore Commercial Street shopping',
        'Take a food walk in VV Puram'
      ],
      places: [
        'Koramangala (trendy neighborhood)',
        'Indiranagar (nightlife hub)',
        'Whitefield (IT corridor)',
        'Jayanagar (traditional area)',
        'Brigade Road (shopping street)',
        'MG Road (commercial center)'
      ]
    },
    'delhi': {
      activities: [
        'Visit Red Fort and Mughal architecture',
        'Explore India Gate and Rajpath',
        'Visit Lotus Temple',
        'Experience Chandni Chowk market',
        'Visit Humayun\'s Tomb',
        'Explore Qutub Minar complex',
        'Take a rickshaw ride in Old Delhi',
        'Visit Akshardham Temple',
        'Explore Khan Market',
        'Visit Raj Ghat (Gandhi memorial)',
        'Experience Delhi Metro',
        'Take a heritage walk in Mehrauli'
      ],
      places: [
        'Connaught Place (central hub)',
        'Karol Bagh (shopping district)',
        'Lajpat Nagar (local markets)',
        'Hauz Khas Village (trendy area)',
        'Dilli Haat (craft bazaar)',
        'Lodhi Gardens (green space)'
      ]
    },
    'mumbai': {
      activities: [
        'Visit Gateway of India',
        'Take a stroll on Marine Drive',
        'Explore Elephanta Caves',
        'Experience Bollywood studio tour',
        'Visit Chhatrapati Shivaji Terminus',
        'Explore Crawford Market',
        'Take a local train ride',
        'Visit Hanging Gardens',
        'Experience street food at Juhu Beach',
        'Visit Prince of Wales Museum',
        'Explore Colaba Causeway',
        'Take a ferry to Mandwa'
      ],
      places: [
        'Bandra (trendy suburb)',
        'Juhu (beach area)',
        'Worli (business district)',
        'Fort (historic area)',
        'Andheri (entertainment hub)',
        'Powai (modern locality)'
      ]
    },
    'france': {
      activities: [
        'Visit Eiffel Tower and Champs-Élysées',
        'Explore Palace of Versailles',
        'Tour Loire Valley châteaux',
        'Experience French Riviera beaches',
        'Visit Mont Saint-Michel',
        'Explore Provence lavender fields',
        'Wine tasting in Bordeaux',
        'Visit D-Day beaches in Normandy',
        'Explore medieval Carcassonne',
        'Take a river cruise in Lyon',
        'Visit Château de Chambord',
        'Experience French cuisine cooking class'
      ],
      places: [
        'Nice (Côte d\'Azur)',
        'Cannes (film festival city)',
        'Avignon (papal city)',
        'Strasbourg (European capital)',
        'Annecy (Venice of Alps)',
        'Saint-Tropez (glamorous resort)'
      ]
    }
  };

  // Destination-specific images
  const getDestinationImage = (destination: string) => {
    const destLower = destination.toLowerCase();
    
    // Check for specific destinations
    if (destLower.includes('morocco')) {
      return 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('paris') || destLower.includes('france')) {
      return 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('tokyo') || destLower.includes('japan')) {
      return 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('london') || destLower.includes('uk') || destLower.includes('england')) {
      return 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('new york') || destLower.includes('nyc')) {
      return 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('rome') || destLower.includes('italy')) {
      return 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('dubai') || destLower.includes('uae')) {
      return 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('barcelona') || destLower.includes('spain')) {
      return 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('amsterdam') || destLower.includes('netherlands')) {
      return 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('thailand') || destLower.includes('bangkok')) {
      return 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (destLower.includes('india') || destLower.includes('delhi') || destLower.includes('mumbai') || 
               destLower.includes('bangalore') || destLower.includes('hyderabad')) {
      return 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    
    // Default travel image
    return 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const findDestinationData = (searchDestination: string) => {
    const searchLower = searchDestination.toLowerCase();
    
    // First try exact match
    if (destinationData[searchLower as keyof typeof destinationData]) {
      return destinationData[searchLower as keyof typeof destinationData];
    }
    
    // Then try partial matching
    for (const [key, data] of Object.entries(destinationData)) {
      if (key.includes(searchLower) || searchLower.includes(key)) {
        return data;
      }
    }
    
    return null;
  };

  const generateItinerary = () => {
    if (!destination || !startDate) return;

    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const start = new Date(startDate);
      const days: DayPlan[] = [];
      
      // Get destination-specific data
      const destData = findDestinationData(destination);
      
      for (let i = 0; i < duration; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        let dayActivities: Activity[] = [];
        
        if (destData) {
          // Use destination-specific activities
          const availableActivities = [...destData.activities];
          const availablePlaces = [...destData.places];
          
          // Distribute activities across days
          const activitiesPerDay = Math.max(2, Math.floor(availableActivities.length / duration));
          const placesPerDay = Math.max(1, Math.floor(availablePlaces.length / duration));
          
          // Get activities for this day
          const startActivityIndex = i * activitiesPerDay;
          const endActivityIndex = Math.min(startActivityIndex + activitiesPerDay, availableActivities.length);
          const daySpecificActivities = availableActivities.slice(startActivityIndex, endActivityIndex);
          
          // If we don't have enough activities, randomly select from remaining
          while (daySpecificActivities.length < 2 && availableActivities.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableActivities.length);
            const randomActivity = availableActivities.splice(randomIndex, 1)[0];
            if (!daySpecificActivities.includes(randomActivity)) {
              daySpecificActivities.push(randomActivity);
            }
          }
          
          // Get places for this day
          const startPlaceIndex = i * placesPerDay;
          const endPlaceIndex = Math.min(startPlaceIndex + placesPerDay, availablePlaces.length);
          const daySpecificPlaces = availablePlaces.slice(startPlaceIndex, endPlaceIndex);
          
          // If we don't have enough places, randomly select from remaining
          while (daySpecificPlaces.length < 1 && availablePlaces.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePlaces.length);
            const randomPlace = availablePlaces.splice(randomIndex, 1)[0];
            if (!daySpecificPlaces.includes(randomPlace)) {
              daySpecificPlaces.push(randomPlace);
            }
          }
          
          // Create activities with times
          const times = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'];
          
          dayActivities = daySpecificActivities.map((activity, index) => ({
            time: times[index] || `${9 + index * 2}:00 ${index < 2 ? 'AM' : 'PM'}`,
            activity: activity,
            place: daySpecificPlaces[index % daySpecificPlaces.length] || `${destination} city center`
          }));
          
          // Add places as separate activities if we have extras
          daySpecificPlaces.forEach((place, index) => {
            if (index >= daySpecificActivities.length && dayActivities.length < 4) {
              dayActivities.push({
                time: times[dayActivities.length] || `${9 + dayActivities.length * 2}:00 PM`,
                activity: `Explore ${place}`,
                place: place
              });
            }
          });
          
        } else {
          // Fallback to generic activities with destination name
          const genericActivities = [
            `Explore ${destination} city center`,
            `Visit local markets in ${destination}`,
            `Take a walking tour of ${destination}`,
            `Experience local cuisine in ${destination}`,
            `Visit museums and cultural sites in ${destination}`,
            `Enjoy nightlife in ${destination}`
          ];
          
          const times = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'];
          
          dayActivities = genericActivities.slice(0, 4).map((activity, index) => ({
            time: times[index],
            activity: activity,
            place: `${destination} - Popular Area ${index + 1}`
          }));
        }
        
        days.push({
          day: i + 1,
          date: currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          activities: dayActivities
        });
      }

      setTripPlan({
        destination,
        duration,
        travelers,
        days
      });
      
      setIsGenerating(false);
      
      // Save to localStorage
      localStorage.setItem('currentTrip', JSON.stringify({
        destination,
        duration,
        travelers,
        days: duration
      }));
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${getDestinationImage(destination || 'travel')}')`
          }}
        ></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              AI Trip Planner
            </h1>
          </div>
          <p className="text-xl text-white text-opacity-90 max-w-2xl">
            Let our AI create the perfect itinerary for your next adventure. 
            Just tell us where you want to go and we'll handle the rest.
          </p>
        </div>
      </div>

      {/* Planning Form */}
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
              Duration (days)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(num => (
                <option key={num} value={num}>{num} day{num > 1 ? 's' : ''}</option>
              ))}
            </select>
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
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} traveler{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateItinerary}
          disabled={!destination || !startDate || isGenerating}
          className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating your perfect itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate AI Itinerary</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Itinerary */}
      {tripPlan && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Your {tripPlan.destination} Adventure</h2>
                <p className="text-green-100">
                  {tripPlan.duration} days • {tripPlan.travelers} traveler{tripPlan.travelers > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {tripPlan.days.map((day, index) => (
                <div key={day.day} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Day {day.day}</h3>
                      <p className="text-gray-600">{day.date}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="bg-white border-2 border-blue-200 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold min-w-fit">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{activity.activity}</h4>
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