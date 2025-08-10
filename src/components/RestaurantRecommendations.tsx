import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Star, MapPin, DollarSign, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<any>(null);

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
    // Load current trip data
    const tripData = localStorage.getItem('currentTrip');
    if (tripData) {
      const trip = JSON.parse(tripData);
      setCurrentTrip(trip);
      
      // Check if we have AI-generated restaurants for this trip
      const savedRestaurants = localStorage.getItem(`restaurants_${trip.destination}`);
      if (savedRestaurants) {
        const parsed = JSON.parse(savedRestaurants);
        setRestaurants(parsed);
      } else {
        // Generate restaurants for this destination if not already generated
        console.log('No cached restaurants found, generating for', trip.destination);
        generateRestaurants(trip.destination, trip.days);
      }
    } else {
      // Fallback to mock data if no trip
      setRestaurants(mockRestaurants);
    }
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      filterRestaurants();
    }
  }, [maxBudget, selectedCuisine, searchTerm, restaurants]);

  const generateRestaurants = async (destination: string, days: number) => {
    setIsLoading(true);
    
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your_supabase') || 
          supabaseKey.includes('your_supabase')) {
        console.warn('Supabase not configured, using fallback restaurants');
        throw new Error('Supabase configuration missing');
      }

      // Call the Supabase edge function to generate restaurants using OpenAI
      const { data, error } = await supabase.functions.invoke('generate-restaurants', {
        body: {
          destination: destination,
          days: days,
          budget: maxBudget || 50
        }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw new Error('Failed to generate restaurants');
      }

      if (!data || !data.restaurants) {
        throw new Error('No restaurant data received');
      }

      const generatedRestaurants = data.restaurants;
      setRestaurants(generatedRestaurants);

      // Save restaurants for this destination
      localStorage.setItem(`restaurants_${destination}`, JSON.stringify(generatedRestaurants));
      console.log(`Successfully generated ${generatedRestaurants.length} restaurants for ${destination}`);

    } catch (error) {
      console.error('Error generating restaurants:', error);
      
      // Show user-friendly message about configuration
      if (error.message?.includes('Supabase configuration') || error.message?.includes('Failed to fetch')) {
        console.warn('Using fallback restaurants due to Supabase configuration issues');
      }
      
      // Fallback to mock data if AI generation fails
      setRestaurants(mockRestaurants);
    }
    
    setIsLoading(false);
  };

  const filterRestaurants = () => {
    let filtered = restaurants.filter(restaurant => restaurant.avgCost <= maxBudget);
    
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
    <div className="space-y-8 pb-96">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl shadow-glow-primary">
              <UtensilsCrossed className="h-8 w-8 text-dark-900" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white text-glow">Restaurant Recommendations</h2>
          </div>
          <p className="text-white/80">
            {currentTrip 
              ? `Find the perfect dining spots in ${currentTrip.destination} based on your budget and preferences`
              : 'Find the perfect dining spots based on your budget and preferences'
            }
          </p>
          {isLoading && (
            <div className="mt-4 p-4 glass backdrop-blur-md rounded-xl border border-primary-400/30 bg-primary-500/10">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-primary-400 font-medium">AI is finding the best restaurants for your trip...</span>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <GlassCard className="p-6" glow="secondary">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-3 rounded-2xl shadow-glow-secondary">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-white text-glow">Filter Restaurants</h3>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Slider */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Max Budget per Person: ${maxBudget}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={maxBudget}
                onChange={(e) => {
                  setMaxBudget(parseInt(e.target.value));
                  if (currentTrip && !isLoading) {
                    generateRestaurants(currentTrip.destination, currentTrip.days);
                  }
                }}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>$10</span>
                <span>$100</span>
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Cuisine Type
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-4 py-2 glass backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white"
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
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Search Restaurants
              </label>
              <GlassInput
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or specialty..."
                icon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <GlassCard className="p-6" glow="primary">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-white text-glow">
              {isLoading ? 'Generating Restaurants...' : `Top ${restaurants.length} Restaurants`}
            </h3>
            <div className="text-sm text-white/60">
              {currentTrip ? `in ${currentTrip.destination} • ` : ''}Sorted by rating (highest first)
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass backdrop-blur-md rounded-xl p-4 border border-white/20 animate-pulse">
                  <div className="w-full h-48 bg-white/10 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
              >
                <GlassCard className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1" hover={true}>
                  <div className="aspect-w-16 aspect-h-10 bg-white/10">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
              
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {restaurant.name}
                      </h4>
                      <span className="text-lg font-bold text-secondary-400">
                        ${restaurant.avgCost}
                      </span>
                    </div>
                
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(restaurant.rating)}
                      </div>
                      <span className="text-sm text-white/60">
                        {restaurant.rating} ({restaurant.reviews} reviews)
                      </span>
                    </div>
                
                    <div className="flex items-center text-sm text-white/60 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                
                    <div className="mb-3">
                      <span className="inline-block bg-primary-500/20 text-primary-400 border border-primary-400/30 text-xs font-medium px-2 py-1 rounded-full capitalize">
                        {restaurant.cuisine}
                      </span>
                      <span className="inline-block bg-secondary-500/20 text-secondary-400 border border-secondary-400/30 text-xs font-medium px-2 py-1 rounded-full ml-2">
                        {restaurant.priceRange}
                      </span>
                    </div>
                
                    <div className="flex flex-wrap gap-1">
                      {restaurant.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="text-xs bg-white/10 text-white/80 border border-white/20 px-2 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          )}

          {restaurants.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <UtensilsCrossed className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No restaurants found</h3>
              <p className="text-white/60">
                {currentTrip 
                  ? 'Try adjusting your filters to see more options.'
                  : 'Create a trip first to get personalized restaurant recommendations.'
                }
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default RestaurantRecommendations;