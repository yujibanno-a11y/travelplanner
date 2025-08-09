import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Star, MapPin, DollarSign, Filter, Search } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  avgCost: number;
  address: string;
  image: string;
  reviews: number;
  specialties: string[];
}

const RestaurantRecommendations = () => {
  const [maxBudget, setMaxBudget] = useState<number>(100);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentDestination, setCurrentDestination] = useState<string>('');

  const cuisineTypes = [
    'all', 'italian', 'asian', 'mexican', 'american', 'mediterranean', 
    'indian', 'french', 'japanese', 'thai', 'greek'
  ];

  // Location-specific restaurant data
  const getRestaurantsForDestination = (destination: string): Restaurant[] => {
    if (destination === 'Paris') {
      return [
        {
          id: '1',
          name: "Le Jules Verne",
          cuisine: 'french',
          rating: 4.9,
          priceRange: '$$$$',
          avgCost: 450,
          address: 'Eiffel Tower, 2nd Floor, 7th Arrondissement',
          image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2847,
          specialties: ['Fine Dining', 'Michelin Star', 'French Cuisine']
        },
        {
          id: '2',
          name: "L'Ami Jean",
          cuisine: 'french',
          rating: 4.8,
          priceRange: '$$$',
          avgCost: 85,
          address: '27 Rue Malar, 7th Arrondissement',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1543,
          specialties: ['Basque Cuisine', 'Traditional French', 'Wine Pairing']
        },
        {
          id: '3',
          name: "Breizh Café",
          cuisine: 'french',
          rating: 4.6,
          priceRange: '$$',
          avgCost: 35,
          address: '109 Rue Vieille du Temple, 3rd Arrondissement',
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2156,
          specialties: ['Crêpes', 'Japanese-French Fusion', 'Casual Dining']
        },
        {
          id: '4',
          name: "L'As du Fallafel",
          cuisine: 'mediterranean',
          rating: 4.5,
          priceRange: '$',
          avgCost: 12,
          address: '34 Rue des Rosiers, 4th Arrondissement',
          image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 3421,
          specialties: ['Falafel', 'Middle Eastern', 'Street Food']
        },
        {
          id: '5',
          name: "Yam'Tcha",
          cuisine: 'asian',
          rating: 4.7,
          priceRange: '$$$',
          avgCost: 120,
          address: '4 Rue Sauval, 1st Arrondissement',
          image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 876,
          specialties: ['Franco-Chinese', 'Tea Pairing', 'Michelin Star']
        },
        {
          id: '6',
          name: "Bistrot Paul Bert",
          cuisine: 'french',
          rating: 4.6,
          priceRange: '$$',
          avgCost: 55,
          address: '18 Rue Paul Bert, 11th Arrondissement',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1987,
          specialties: ['Classic Bistro', 'Traditional French', 'Wine Selection']
        },
        {
          id: '7',
          name: "Pink Mamma",
          cuisine: 'italian',
          rating: 4.4,
          priceRange: '$$',
          avgCost: 42,
          address: '20 Rue de Douai, 9th Arrondissement',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 4521,
          specialties: ['Italian', 'Pizza', 'Trendy Atmosphere']
        },
        {
          id: '8',
          name: "Septime",
          cuisine: 'french',
          rating: 4.8,
          priceRange: '$$$',
          avgCost: 95,
          address: '80 Rue de Charonne, 11th Arrondissement',
          image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1234,
          specialties: ['Modern French', 'Seasonal Menu', 'Natural Wine']
        },
        {
          id: '9',
          name: "Du Pain et des Idées",
          cuisine: 'french',
          rating: 4.7,
          priceRange: '$',
          avgCost: 8,
          address: '34 Rue Yves Toudic, 10th Arrondissement',
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2876,
          specialties: ['Bakery', 'Pastries', 'Artisan Bread']
        },
        {
          id: '10',
          name: "Le Comptoir du Relais",
          cuisine: 'french',
          rating: 4.5,
          priceRange: '$$',
          avgCost: 48,
          address: '9 Carrefour de l\'Odéon, 6th Arrondissement',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1654,
          specialties: ['Bistro', 'Traditional French', 'Saint-Germain']
        }
      ];
    } else if (destination === 'Rome') {
      return [
        {
          id: '11',
          name: "La Pergola",
          cuisine: 'italian',
          rating: 4.9,
          priceRange: '$$$$',
          avgCost: 380,
          address: 'Via Alberto Cadlolo 101, Rome Cavalieri Hotel',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1876,
          specialties: ['Michelin 3-Star', 'Fine Dining', 'Panoramic Views']
        },
        {
          id: '12',
          name: "Armando al Pantheon",
          cuisine: 'italian',
          rating: 4.6,
          priceRange: '$$',
          avgCost: 65,
          address: 'Salita de\' Crescenzi 31, Near Pantheon',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2341,
          specialties: ['Roman Cuisine', 'Historic Restaurant', 'Traditional']
        },
        {
          id: '13',
          name: "Trattoria Monti",
          cuisine: 'italian',
          rating: 4.7,
          priceRange: '$$',
          avgCost: 55,
          address: 'Via di San Vito 13a, Esquilino',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1543,
          specialties: ['Regional Italian', 'Homemade Pasta', 'Family-Run']
        },
        {
          id: '14',
          name: "Da Enzo al 29",
          cuisine: 'italian',
          rating: 4.5,
          priceRange: '$',
          avgCost: 28,
          address: 'Via dei Vascellari 29, Trastevere',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 3876,
          specialties: ['Authentic Roman', 'Small Plates', 'Local Favorite']
        },
        {
          id: '15',
          name: "Piperno",
          cuisine: 'italian',
          rating: 4.4,
          priceRange: '$$',
          avgCost: 45,
          address: 'Via Monte de\' Cenci 9, Jewish Quarter',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2156,
          specialties: ['Jewish-Roman', 'Carciofi alla Giudia', 'Historic']
        }
      ];
    } else if (destination === 'London') {
      return [
        {
          id: '16',
          name: "Sketch",
          cuisine: 'french',
          rating: 4.8,
          priceRange: '$$$$',
          avgCost: 320,
          address: '9 Conduit St, Mayfair',
          image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1234,
          specialties: ['Michelin Star', 'Avant-garde', 'Afternoon Tea']
        },
        {
          id: '17',
          name: "Dishoom",
          cuisine: 'indian',
          rating: 4.6,
          priceRange: '$$',
          avgCost: 35,
          address: '12 Upper St Martin\'s Ln, Covent Garden',
          image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 5672,
          specialties: ['Bombay Café', 'Indian Street Food', 'Black Daal']
        },
        {
          id: '18',
          name: "Rules",
          cuisine: 'american',
          rating: 4.5,
          priceRange: '$$$',
          avgCost: 85,
          address: '35 Maiden Ln, Covent Garden',
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 2876,
          specialties: ['Traditional British', 'Game Meat', 'Historic Pub']
        },
        {
          id: '19',
          name: "Padella",
          cuisine: 'italian',
          rating: 4.7,
          priceRange: '$',
          avgCost: 18,
          address: '6 Southwark St, Borough Market',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 4321,
          specialties: ['Fresh Pasta', 'Borough Market', 'Quick Service']
        },
        {
          id: '20',
          name: "Hawksmoor Seven Dials",
          cuisine: 'american',
          rating: 4.6,
          priceRange: '$$$',
          avgCost: 95,
          address: '11 Langley St, Covent Garden',
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 1987,
          specialties: ['Steakhouse', 'British Beef', 'Cocktails']
        }
      ];
    }
    
    // Default restaurants for other destinations
    return [
      {
        id: 'default-1',
        name: `${destination} Local Bistro`,
        cuisine: 'mediterranean',
        rating: 4.5,
        priceRange: '$$',
        avgCost: 45,
        address: `Main Street, ${destination}`,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        reviews: 1234,
        specialties: ['Local Cuisine', 'Fresh Ingredients', 'Cozy Atmosphere']
      },
      {
        id: 'default-2',
        name: `${destination} Street Food Market`,
        cuisine: 'asian',
        rating: 4.3,
        priceRange: '$',
        avgCost: 15,
        address: `Market Square, ${destination}`,
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
        reviews: 2876,
        specialties: ['Street Food', 'Local Flavors', 'Budget-Friendly']
      },
      {
        id: 'default-3',
        name: `${destination} Fine Dining`,
        cuisine: 'french',
        rating: 4.7,
        priceRange: '$$$',
        avgCost: 120,
        address: `Historic District, ${destination}`,
        image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
        reviews: 876,
        specialties: ['Fine Dining', 'Wine Pairing', 'Elegant Atmosphere']
      }
    ];
  };

  useEffect(() => {
    // Load current trip destination
    const tripData = localStorage.getItem('currentTrip');
    if (tripData) {
      const trip = JSON.parse(tripData);
      setCurrentDestination(trip.destination);
    }
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [maxBudget, selectedCuisine, searchTerm, currentDestination]);

  const filterRestaurants = () => {
    const restaurantData = getRestaurantsForDestination(currentDestination);
    let filtered = restaurantData.filter(restaurant => restaurant.avgCost <= maxBudget);
    
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sort by rating (highest first)
    filtered.sort((a, b) => b.rating - a.rating);
    
    setRestaurants(filtered.slice(0, 20)); // Top 20 results
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <UtensilsCrossed className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Restaurant Recommendations</h2>
        </div>
        <p className="text-orange-100">
          {currentDestination 
            ? `Discover the best restaurants in ${currentDestination} based on your budget and preferences`
            : 'Find the perfect dining spots based on your budget and preferences'
          }
        </p>
        {currentDestination && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <p className="font-medium">📍 Showing restaurants in {currentDestination}</p>
          </div>
        )}
      </div>

      {!currentDestination ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Destination Selected</h3>
          <p className="text-gray-600">Please go to the "Plan Trip" tab and select your destination first to see local restaurant recommendations.</p>
        </div>
      ) : (
        <>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900">Filter Restaurants</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Budget Slider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Budget per Person: ${maxBudget}
            </label>
            <input
              type="range"
              min="10"
              max="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$10</span>
              <span>$500</span>
            </div>
          </div>

          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {cuisineTypes.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Restaurants
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or specialty..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Top {restaurants.length} Restaurants
          </h3>
          <div className="text-sm text-gray-600">
            Sorted by rating (highest first)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
              <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {restaurant.name}
                  </h4>
                  <span className="text-lg font-bold text-green-600">
                    ${restaurant.avgCost}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(restaurant.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {restaurant.rating} ({restaurant.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
                
                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {restaurant.cuisine}
                  </span>
                  <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                    {restaurant.priceRange}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options.</p>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default RestaurantRecommendations;