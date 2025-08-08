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
  const [maxBudget, setMaxBudget] = useState<number>(50);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const cuisineTypes = [
    'all', 'italian', 'asian', 'mexican', 'american', 'mediterranean', 
    'indian', 'french', 'japanese', 'thai', 'greek'
  ];

  // Mock restaurant data
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: "Bella Vista Italian",
      cuisine: 'italian',
      rating: 4.8,
      priceRange: '$$',
      avgCost: 35,
      address: '123 Main St, Downtown',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 1250,
      specialties: ['Pasta', 'Pizza', 'Wine']
    },
    {
      id: '2',
      name: "Dragon Garden",
      cuisine: 'asian',
      rating: 4.6,
      priceRange: '$',
      avgCost: 22,
      address: '456 Oak Ave, Chinatown',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 890,
      specialties: ['Dim Sum', 'Noodles', 'Stir Fry']
    },
    {
      id: '3',
      name: "La Casa Mexicana",
      cuisine: 'mexican',
      rating: 4.7,
      priceRange: '$$',
      avgCost: 28,
      address: '789 Pine St, Mission District',
      image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 1100,
      specialties: ['Tacos', 'Burritos', 'Margaritas']
    },
    {
      id: '4',
      name: "Mediterranean Delight",
      cuisine: 'mediterranean',
      rating: 4.5,
      priceRange: '$$',
      avgCost: 32,
      address: '321 Elm St, Arts District',
      image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 750,
      specialties: ['Hummus', 'Kebabs', 'Baklava']
    },
    {
      id: '5',
      name: "Spice Palace",
      cuisine: 'indian',
      rating: 4.4,
      priceRange: '$',
      avgCost: 18,
      address: '654 Cedar Ave, Little India',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 680,
      specialties: ['Curry', 'Biryani', 'Naan']
    },
    {
      id: '6',
      name: "Le Petit Bistro",
      cuisine: 'french',
      rating: 4.9,
      priceRange: '$$$',
      avgCost: 65,
      address: '987 Maple Rd, French Quarter',
      image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
      reviews: 420,
      specialties: ['Escargot', 'Coq au Vin', 'Crème Brûlée']
    }
  ];

  useEffect(() => {
    filterRestaurants();
  }, [maxBudget, selectedCuisine, searchTerm]);

  const filterRestaurants = () => {
    let filtered = mockRestaurants.filter(restaurant => restaurant.avgCost <= maxBudget);
    
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
        <p className="text-orange-100">Find the perfect dining spots based on your budget and preferences</p>
      </div>

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
              max="100"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$10</span>
              <span>$100</span>
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
    </div>
  );
};

export default RestaurantRecommendations;