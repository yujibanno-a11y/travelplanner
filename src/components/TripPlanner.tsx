import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building, ArrowRight, DollarSign, Car } from 'lucide-react';

interface ItineraryDay {
  day: number;
  attractions: string[];
  restaurants: {
    breakfast?: string;
    lunch: string;
    dinner: string;
  };
  activities: string[];
  tips: string;
  transportation: string;
  estimatedCost: string;
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

interface TripFormData {
  destination: string;
  startDate: string;
  duration: string;
  groupSize: string;
  interests: string;
  exclusions: string;
  otherNotes: string;
}

interface DestinationData {
  attractions: string[];
  restaurants: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  activities: string[];
  transportation: string[];
  tips: string[];
  costs: string[];
}
const TripPlanner = () => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    duration: '',
    groupSize: '',
    interests: '',
    exclusions: '',
    otherNotes: ''
  });
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDestinations, setShowDestinations] = useState(true);

  // Enhanced destination-specific data
  const destinationDatabase: Record<string, DestinationData> = {
    'paris': {
      attractions: [
        'Eiffel Tower and Trocadéro Gardens',
        'Louvre Museum and Mona Lisa',
        'Notre-Dame Cathedral (exterior) and Sainte-Chapelle',
        'Arc de Triomphe and Champs-Élysées',
        'Sacré-Cœur Basilica and Montmartre District',
        'Seine River Cruise',
        'Palace of Versailles (day trip)',
        'Musée d\'Orsay and Impressionist Art',
        'Latin Quarter and Panthéon',
        'Marais District and Place des Vosges'
      ],
      restaurants: {
        breakfast: [
          'Du Pain et des Idées - Artisanal bakery with incredible pastries',
          'Breizh Café - Modern crêperie in Le Marais',
          'L\'As du Fallafel - Famous falafel in the Jewish quarter',
          'Pierre Hermé - Luxury macarons and pastries',
          'Café de Flore - Historic café in Saint-Germain'
        ],
        lunch: [
          'L\'Ami Jean - Traditional Basque bistro',
          'Marché des Enfants Rouges - Historic covered market',
          'Le Comptoir du Relais - Classic French bistro',
          'Breizh Café - Gourmet crêpes and galettes',
          'L\'As du Fallafel - Best falafel in the Marais'
        ],
        dinner: [
          'Le Procope - Historic restaurant since 1686',
          'L\'Ami Jean - Lively Basque cuisine',
          'Le Train Bleu - Belle Époque restaurant in Gare de Lyon',
          'Bistrot Paul Bert - Classic Parisian bistro',
          'Le Mary Celeste - Modern small plates and natural wines'
        ]
      },
      activities: [
        'Seine River evening cruise with dinner',
        'Cooking class in a Parisian kitchen',
        'Wine tasting in historic cellars',
        'Photography walk through Montmartre',
        'Vintage shopping in Le Marais',
        'Picnic in Luxembourg Gardens',
        'Evening cabaret show at Moulin Rouge',
        'Art workshop in an artist\'s studio',
        'Bike tour along the Seine',
        'French pastry making class'
      ],
      transportation: [
        'Metro day pass (€7.50) - unlimited travel on metro, bus, and tram',
        'Vélib\' bike sharing - €8 for day pass',
        'Walking - most attractions are within walking distance',
        'Taxi or Uber for longer distances',
        'RER train to Versailles (€7.30 each way)'
      ],
      tips: [
        'Book Louvre tickets online in advance to skip the lines',
        'Visit Eiffel Tower at sunset for the best photos and lighting',
        'Try authentic French pastries from local boulangeries',
        'Learn basic French greetings - locals appreciate the effort',
        'Carry a reusable water bottle - Paris has many public fountains',
        'Dress smartly for dinner - Parisians take dining seriously',
        'Explore beyond tourist areas - discover hidden neighborhood gems'
      ],
      costs: ['€80-120 per day', '€60-90 per day', '€100-150 per day', '€70-100 per day']
    },
    'tokyo': {
      attractions: [
        'Senso-ji Temple and Asakusa District',
        'Tokyo Skytree and Sumida River views',
        'Meiji Shrine and Harajuku fashion district',
        'Shibuya Crossing and Hachiko Statue',
        'Tsukiji Outer Market and sushi breakfast',
        'Imperial Palace East Gardens',
        'Ginza luxury shopping district',
        'Ueno Park and Tokyo National Museum',
        'Akihabara Electric Town',
        'Tokyo Station and Marunouchi area'
      ],
      restaurants: {
        breakfast: [
          'Tsukiji Outer Market - Fresh sushi and street food',
          'Bills Omotesando - Famous ricotta hotcakes',
          'Ippudo Ramen - Morning ramen experience',
          'Starbucks Reserve Roastery - Premium coffee experience',
          'Local convenience store - Authentic Japanese breakfast'
        ],
        lunch: [
          'Sukiyabashi Jiro - World-famous sushi (reservation required)',
          'Ichiran Ramen - Individual booth ramen experience',
          'Gonpachi Shibuya - Traditional izakaya atmosphere',
          'Kaikaya by the Sea - Fresh seafood in Shibuya',
          'Tempura Daikokuya - Historic tempura restaurant'
        ],
        dinner: [
          'Robot Restaurant - Dinner show in Shinjuku',
          'Nabezo - All-you-can-eat shabu-shabu',
          'Kozasa - Traditional kaiseki cuisine',
          'Golden Gai - Tiny bars in Shinjuku',
          'Omoide Yokocho - Memory Lane yakitori alleys'
        ]
      },
      activities: [
        'Traditional tea ceremony experience',
        'Sumo wrestling tournament or practice viewing',
        'Karaoke night in Shibuya',
        'Sake tasting tour in traditional breweries',
        'Manga and anime culture tour in Akihabara',
        'Cherry blossom viewing (seasonal)',
        'Traditional onsen (hot spring) experience',
        'Sushi making class with a master chef',
        'Tokyo Bay evening cruise',
        'Vintage kimono rental and photoshoot'
      ],
      transportation: [
        'JR Pass (7-day: ¥29,650) - unlimited JR trains including Shinkansen',
        'Tokyo Metro 24-hour ticket (¥800) - unlimited subway travel',
        'IC Card (Suica/Pasmo) - convenient for all public transport',
        'Taxi - expensive but convenient for short distances',
        'Bicycle rental - great for exploring neighborhoods'
      ],
      tips: [
        'Bow slightly when greeting - it shows respect for Japanese culture',
        'Remove shoes when entering homes, temples, and some restaurants',
        'Don\'t eat or drink while walking - find a designated area',
        'Learn to use chopsticks properly before your trip',
        'Carry cash - many places don\'t accept credit cards',
        'Download Google Translate with camera feature for menus',
        'Be quiet on public transportation - talking loudly is considered rude'
      ],
      costs: ['¥8,000-12,000 per day', '¥6,000-9,000 per day', '¥10,000-15,000 per day', '¥7,000-11,000 per day']
    },
    'rome': {
      attractions: [
        'Colosseum and Roman Forum archaeological area',
        'Vatican City - St. Peter\'s Basilica and Sistine Chapel',
        'Pantheon and Piazza della Rotonda',
        'Trevi Fountain and Spanish Steps',
        'Palatine Hill and Imperial Palace ruins',
        'Castel Sant\'Angelo and Ponte Sant\'Angelo',
        'Villa Borghese Gardens and Galleria Borghese',
        'Trastevere neighborhood and Santa Maria',
        'Campo de\' Fiori market and Piazza Navona',
        'Capitoline Museums and Capitoline Hill'
      ],
      restaurants: {
        breakfast: [
          'Sant\'Eustachio Il Caffè - Historic coffee roastery',
          'Pasticceria Regoli - Traditional Roman pastries',
          'Barnum Café - Artisanal coffee and cornetti',
          'Ginger - Modern breakfast spot near Colosseum',
          'Local bar - Stand-up espresso and cornetto'
        ],
        lunch: [
          'Da Enzo al 29 - Authentic Roman trattoria',
          'Armando al Pantheon - Historic restaurant since 1961',
          'Checchino dal 1887 - Traditional Roman cuisine',
          'Il Sorpasso - Modern Italian with great wine selection',
          'Mercato Centrale Roma - Gourmet food hall'
        ],
        dinner: [
          'Glass Hostaria - Michelin-starred modern Italian',
          'Da Valentino - Family-run trattoria in Trastevere',
          'Il Pagliaccio - Two Michelin stars fine dining',
          'Osteria del Sostegno - Hidden gem near Pantheon',
          'Piperno - Historic Jewish-Roman cuisine'
        ]
      },
      activities: [
        'Gladiator school experience near Colosseum',
        'Roman cooking class with market tour',
        'Evening aperitivo tour in Trastevere',
        'Underground Rome tour - catacombs and crypts',
        'Vespa tour of Rome\'s seven hills',
        'Wine tasting in Frascati hills (day trip)',
        'Art workshop in a Renaissance palazzo',
        'Evening stroll and gelato tasting',
        'Opera performance at Terme di Caracalla',
        'Photography tour of hidden Rome'
      ],
      transportation: [
        'Roma Pass (72h: €38.50) - public transport + museum entries',
        'Metro day pass (€7) - unlimited metro, bus, and tram',
        'Walking - historic center is very walkable',
        'Taxi or Uber for longer distances',
        'Bike sharing - limited but growing network'
      ],
      tips: [
        'Book Vatican Museums online to skip 2-hour queues',
        'Visit major attractions early morning or late afternoon',
        'Dress modestly for churches - cover shoulders and knees',
        'Try authentic Roman dishes: carbonara, amatriciana, cacio e pepe',
        'Throw a coin in Trevi Fountain to ensure your return to Rome',
        'Avoid restaurants with tourist menus near major attractions',
        'Learn basic Italian phrases - Romans appreciate the effort'
      ],
      costs: ['€70-100 per day', '€50-80 per day', '€90-130 per day', '€60-90 per day']
    }
  };
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
    setFormData(prev => ({
      ...prev,
      destination: `${dest.name}, ${dest.country}`,
      duration: '7' // Default to 7 days
    }));
    setShowDestinations(false);
  };

  const handleInputChange = (field: keyof TripFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Simulated AI-generated itineraries
  const generateItinerary = async () => {
    if (!formData.destination || !formData.duration) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const numDays = parseInt(formData.duration);
    const mockItinerary: ItineraryDay[] = [];
    
    // Get destination-specific data or use fallback
    const destinationKey = formData.destination.toLowerCase().split(',')[0].trim();
    const destinationData = destinationDatabase[destinationKey] || {
      attractions: [
        'Historic City Center and Main Square',
        'Local Art Museum and Cultural Center',
        'Traditional Market and Shopping District',
        'Scenic Viewpoint and Observation Deck',
        'Religious Sites and Architecture',
        'Waterfront Promenade and Harbor',
        'Botanical Gardens and City Parks',
        'Local Neighborhoods and Hidden Gems'
      ],
      restaurants: {
        breakfast: [
          'Local Café - Traditional breakfast and coffee',
          'Market Bakery - Fresh pastries and local specialties',
          'Hotel Restaurant - Continental breakfast buffet',
          'Street Food Vendor - Authentic local morning treats'
        ],
        lunch: [
          'Traditional Restaurant - Local cuisine and specialties',
          'Bistro in Historic District - Casual dining with local flavors',
          'Market Food Hall - Variety of local vendors',
          'Rooftop Restaurant - Great views and regional dishes'
        ],
        dinner: [
          'Fine Dining Restaurant - Upscale local cuisine',
          'Family-Run Tavern - Authentic traditional dishes',
          'Modern Fusion Restaurant - Contemporary local flavors',
          'Waterfront Restaurant - Fresh seafood and sunset views'
        ]
      },
      activities: [
        'Walking tour of historic neighborhoods',
        'Local cooking class and market visit',
        'Cultural performance or show',
        'Artisan workshop experience',
        'Photography tour of scenic spots',
        'Wine or local beverage tasting',
        'Bike tour of the city',
        'Sunset viewing from best vantage point'
      ],
      transportation: [
        'Public transport day pass - convenient for city travel',
        'Walking - most attractions within walking distance',
        'Taxi or rideshare for longer distances',
        'Bike rental for exploring neighborhoods'
      ],
      tips: [
        'Book popular attractions in advance to avoid queues',
        'Try local specialties and traditional dishes',
        'Learn basic phrases in the local language',
        'Carry a map and have offline navigation ready',
        'Respect local customs and dress codes',
        'Stay hydrated and wear comfortable walking shoes'
      ],
      costs: ['$60-90 per day', '$40-70 per day', '$80-120 per day', '$50-80 per day']
    };

    for (let i = 1; i <= numDays; i++) {
      // Select attractions for the day
      const dayAttractions = destinationData.attractions
        .sort(() => 0.5 - Math.random())
        .slice(0, 2 + Math.floor(i / 3)); // More attractions on later days
      
      // Select activities for the day
      const dayActivities = destinationData.activities
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      // Select restaurants for the day
      const restaurants = {
        breakfast: i > 1 ? destinationData.restaurants.breakfast[Math.floor(Math.random() * destinationData.restaurants.breakfast.length)] : undefined,
        lunch: destinationData.restaurants.lunch[Math.floor(Math.random() * destinationData.restaurants.lunch.length)],
        dinner: destinationData.restaurants.dinner[Math.floor(Math.random() * destinationData.restaurants.dinner.length)]
      };
      
      // Select transportation and tips
      const transportation = destinationData.transportation[Math.floor(Math.random() * destinationData.transportation.length)];
      const tip = destinationData.tips[Math.floor(Math.random() * destinationData.tips.length)];
      const cost = destinationData.costs[Math.floor(Math.random() * destinationData.costs.length)];

      mockItinerary.push({
        day: i,
        attractions: dayAttractions,
        restaurants,
        activities: dayActivities,
        transportation,
        estimatedCost: cost,
        tips: i === 1 
          ? `Welcome to ${formData.destination}! ${tip} Start early to make the most of your first day.`
          : i === numDays 
          ? `Last day in ${formData.destination} - perfect time for souvenir shopping and revisiting your favorite spots!`
          : tip
      });
    }
    
    setItinerary(mockItinerary);
    setIsGenerating(false);
    
    // Save to localStorage
    localStorage.setItem('currentTrip', JSON.stringify({
      destination: formData.destination,
      days: numDays,
      itinerary: mockItinerary
    }));
  };

  const resetToDestinations = () => {
    setShowDestinations(true);
    setItinerary([]);
    setFormData({
      destination: '',
      startDate: '',
      duration: '',
      groupSize: '',
      interests: '',
      exclusions: '',
      otherNotes: ''
    });
  };

  const shareItinerary = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${formData.destination} Travel Itinerary`,
        text: `Check out my ${formData.duration}-day travel itinerary for ${formData.destination}!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const itineraryText = `My ${formData.destination} Travel Itinerary\n\n${itinerary.map(day => 
        `Day ${day.day}:\nAttractions: ${day.attractions.join(', ')}\nActivities: ${day.activities.join(', ')}`
      ).join('\n\n')}`;
      navigator.clipboard.writeText(itineraryText);
      alert('Itinerary copied to clipboard!');
    }
  };

  const printItinerary = () => {
    window.print();
  };
  if (!showDestinations) {
    return (
      <div className="space-y-8">
        {/* Trip Planning Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={resetToDestinations}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Browse Destinations
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Row 1: Destination and Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Where are you going?
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="City, country, or multiple locations"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  When does your trip begin?
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Row 2: Duration and Group Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  How much time do you have?
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Number of days"
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How many people are in your group?
                </label>
                <input
                  type="number"
                  value={formData.groupSize}
                  onChange={(e) => handleInputChange('groupSize', e.target.value)}
                  placeholder="Number of travelers"
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Row 3: Daily Budget */}
            
            {/* Row 3: Interests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What do you want to see and do?
              </label>
              <textarea
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="Describe your interests: museums, outdoor activities, nightlife, local cuisine, historical sites, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Row 4: Exclusions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What would you prefer to exclude?
              </label>
              <textarea
                value={formData.exclusions}
                onChange={(e) => handleInputChange('exclusions', e.target.value)}
                placeholder="Things you'd rather avoid: crowded places, expensive activities, certain types of food, etc."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Row 5: Other Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Other Notes
              </label>
              <textarea
                value={formData.otherNotes}
                onChange={(e) => handleInputChange('otherNotes', e.target.value)}
                placeholder="Accessibility needs, dietary restrictions, transportation preferences, special occasions, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
          
          <button
            onClick={generateItinerary}
            disabled={!formData.destination || !formData.duration || isGenerating}
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
            {/* Itinerary Header with Actions */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8" />
                  <div>
                    <h3 className="text-3xl font-bold">
                      Your {formData.destination} Adventure
                    </h3>
                    <p className="text-green-100 mt-1">
                      {formData.duration} days of unforgettable experiences
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  
                  <button
                    onClick={printItinerary}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Print</span>
                  </button>
                  
                  <button
                    onClick={resetToDestinations}
                    className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Plan Another Trip</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Trip Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{formData.duration}</div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{itinerary.reduce((sum, day) => sum + day.attractions.length, 0)}</div>
                <div className="text-sm text-gray-600">Attractions</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{itinerary.reduce((sum, day) => sum + day.activities.length, 0)}</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{formData.groupSize || '1'}</div>
                <div className="text-sm text-gray-600">Travelers</div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                📋 Your Trip at a Glance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">🌍 Destination:</span>
                  <p className="text-gray-600 mt-1">{formData.destination}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">📅 Duration:</span>
                  <p className="text-gray-600 mt-1">{formData.duration} amazing days</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">👥 Group Size:</span>
                  <p className="text-gray-600 mt-1">{formData.groupSize || 'Solo adventure'} travelers</p>
                </div>
                {formData.startDate && (
                  <div>
                    <span className="font-medium text-gray-700">🗓️ Start Date:</span>
                    <p className="text-gray-600 mt-1">{new Date(formData.startDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                )}
                {formData.interests && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">🎯 Your Interests:</span>
                    <p className="text-gray-600 mt-1">{formData.interests}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Itinerary Days */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Your {formData.destination} Travel Itinerary ({formData.duration} Days)
              </h3>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">📋 Trip Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Destination:</span>
                  <p className="text-gray-600">{formData.destination}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-600">{formData.duration} days</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Group Size:</span>
                  <p className="text-gray-600">{formData.groupSize || 'Not specified'} people</p>
                </div>
              </div>
            </div>
            
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Day Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3 px-6 rounded-full text-lg">
                      Day {day.day}
                    </div>
                    {formData.startDate && (
                      <div className="text-gray-600">
                        <div className="font-medium">
                          {new Date(new Date(formData.startDate).getTime() + (day.day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Daily Budget */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Daily Budget: {day.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                {/* Morning Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-800">🌅 Morning (9:00 AM - 12:00 PM)</h4>
                  </div>
                  <div className="ml-5 space-y-2">
                    {day.restaurants.breakfast && (
                      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm"><strong>🍳 Breakfast:</strong> {day.restaurants.breakfast}</p>
                      </div>
                    )}
                    {day.attractions.slice(0, 1).map((attraction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed"><strong>📍 Visit:</strong> {attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Afternoon Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-800">☀️ Afternoon (12:00 PM - 6:00 PM)</h4>
                  </div>
                  <div className="ml-5 space-y-2">
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <p className="text-sm"><strong>🍽️ Lunch:</strong> {day.restaurants.lunch}</p>
                    </div>
                    {day.attractions.slice(1).map((attraction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed"><strong>📍 Explore:</strong> {attraction}</span>
                      </div>
                    ))}
                    {day.activities.slice(0, 1).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed"><strong>🎯 Activity:</strong> {activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-800">🌆 Evening (6:00 PM - 10:00 PM)</h4>
                  </div>
                  <div className="ml-5 space-y-2">
                    {day.activities.slice(1).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed"><strong>🎭 Experience:</strong> {activity}</span>
                      </div>
                    ))}
                    <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                      <p className="text-sm"><strong>🍷 Dinner:</strong> {day.restaurants.dinner}</p>
                    </div>
                  </div>
                </div>

                {/* Transportation & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <h5 className="font-semibold text-blue-800">🚗 Getting Around</h5>
                    </div>
                    <p className="text-sm text-blue-700">{day.transportation}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h5 className="font-semibold text-green-800">💡 Pro Tip</h5>
                    </div>
                    <p className="text-sm text-green-700">{day.tips}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Trip Summary Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 text-center">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">🎉 Your Adventure Awaits!</h4>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                You're all set for an incredible {formData.duration}-day journey through {formData.destination}. 
                Don't forget to stay flexible, embrace spontaneous moments, and create memories that will last a lifetime!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={shareItinerary}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share Your Itinerary</span>
                </button>
                
                <button
                  onClick={printItinerary}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Plan Another Adventure</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          body {
            font-size: 12px;
          }
          .bg-gradient-to-r {
            background: #f3f4f6 !important;
            color: #1f2937 !important;
          }
        }
      `}</style>

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
            Can't find your dream destination? Let our TravelPlanner help you plan the perfect trip.
          </p>
          <button
            onClick={() => setShowDestinations(false)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
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