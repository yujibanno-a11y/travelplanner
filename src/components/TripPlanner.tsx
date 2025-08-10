import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useItineraryHistory } from '../hooks/useItineraryHistory';
import { useTheme } from './ThemeProvider';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';
import SkeletonLoader from './SkeletonLoader';
import ErrorModal from './ErrorModal';
import { UserPreferences, ItineraryAction } from '../types/chat';

const MAX_DAYS = 30;

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
  const [showDaysLimitModal, setShowDaysLimitModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [onFindJobPage, setOnFindJobPage] = useState(false);
  const { reducedMotion } = useTheme();
  
  // User preferences with defaults
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      budget: 100,
      pace: 'moderate' as const,
      interests: ['History & Culture', 'Food & Dining'],
      accessibility: {
        mobility: false,
        dietary: [],
        other: []
      }
    };
  });

  // Itinerary history for undo/redo
  const {
    currentItinerary: historyItinerary,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useItineraryHistory(itinerary);

  React.useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update itinerary when history changes
  React.useEffect(() => {
    if (historyItinerary !== itinerary) {
      setItinerary(historyItinerary || []);
    }
  }, [historyItinerary]);

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };


  const handleUndo = () => {
    const previousItinerary = undo();
    if (previousItinerary) {
      setItinerary(previousItinerary);
    }
  };

  const handleRedo = () => {
    const nextItinerary = redo();
    if (nextItinerary) {
      setItinerary(nextItinerary);
    }
  };

  const handleDaysChange = (value: string) => {
    const numDays = parseInt(value);
    if (numDays > MAX_DAYS) {
      setShowDaysLimitModal(true);
      return; // Don't update the days value
    }
    setDays(value);
  };

  const generateItinerary = async () => {
    if (!destination || !days) return;
    
    const numDays = parseInt(days);
    if (numDays > MAX_DAYS) {
      setShowDaysLimitModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your_supabase') || 
          supabaseKey.includes('your_supabase')) {
        console.warn('Supabase not configured, using fallback itinerary');
        throw new Error('Supabase configuration missing');
      }

      // Call the Supabase edge function to generate itinerary using OpenAI
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          destination: destination.trim(),
          days: numDays,
          userPreferences: userPreferences
        }
      });

      if (error) {
        console.error('Error calling edge function:', error.message || error);
        throw new Error('Failed to generate itinerary');
      }

      if (!data || !data.itinerary) {
        throw new Error('No itinerary data received');
      }

      const generatedItinerary = data.itinerary;
      setItinerary(generatedItinerary);

      // Push to history
      pushState(generatedItinerary);

      // Save trip data
      const tripData = {
        destination,
        days: numDays,
        itinerary: generatedItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));

      // Clear any existing restaurant data for this destination to force regeneration
      localStorage.removeItem(`restaurants_${destination.trim()}`);

      // Automatically generate restaurants for this destination
      await generateRestaurantsForDestination(destination.trim(), numDays);

    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Show user-friendly message about configuration
      if (error.message?.includes('Supabase configuration') || error.message?.includes('Failed to fetch')) {
        console.warn('Using fallback itinerary due to Supabase configuration issues');
      }
      
      // Fallback to basic itinerary if AI generation fails
      const fallbackItinerary: ItineraryDay[] = [];
      
      // Create arrays of unique activities and attractions to avoid duplicates
      const baseActivities = [
        'Explore the historic city center and main square',
        'Visit the most famous museum or cultural site',
        'Take a guided walking tour of local neighborhoods',
        'Experience local markets and street food',
        'Enjoy panoramic city views from a viewpoint',
        'Discover hidden gems and local favorites',
        'Relax in beautiful parks or gardens',
        'Try authentic local cuisine at recommended restaurants',
        'Shop for unique souvenirs and local crafts',
        'Take photos at iconic landmarks',
        'Experience local nightlife and entertainment',
        'Visit religious or spiritual sites',
        'Explore waterfront areas or beaches',
        'Take day trips to nearby attractions',
        'Participate in cultural activities or workshops'
      ];
      
      const baseAttractions = [
        `${destination} Historic District`,
        'Main Art Museum',
        'Central Cathedral or Religious Site',
        'Popular Viewpoint or Observatory',
        'Local Market Square',
        'Waterfront Promenade',
        'Cultural Center',
        'Traditional Neighborhood'
      ];
        
      for (let i = 1; i <= numDays; i++) {
        // Ensure unique activities for each day
        const startIndex = (i - 1) * 3;
        const dayActivities = baseActivities.slice(startIndex, startIndex + 3);
        
        // Ensure unique attractions for each day
        const attractionStartIndex = (i - 1) * 4;
        const dayAttractions = baseAttractions.slice(attractionStartIndex, attractionStartIndex + 4);
        
        // If we run out of unique items, cycle through with modifications
        while (dayActivities.length < 3) {
          const extraIndex = dayActivities.length + startIndex;
          const baseActivity = baseActivities[extraIndex % baseActivities.length];
          dayActivities.push(`${baseActivity} (Day ${i} variation)`);
        }
        
        while (dayAttractions.length < 4) {
          const extraIndex = dayAttractions.length + attractionStartIndex;
          const baseAttraction = baseAttractions[extraIndex % baseAttractions.length];
          dayAttractions.push(`${baseAttraction} - Day ${i}`);
        }
        
        fallbackItinerary.push({
          day: i,
          activities: dayActivities,
          attractions: dayAttractions,
          tips: `Day ${i}: Wear comfortable walking shoes and bring a camera to capture the memories!`
        });
      }
      
      setItinerary(fallbackItinerary);
      
      // Push to history
      pushState(fallbackItinerary);
      
      // Save fallback data
      const tripData = {
        destination,
        days: numDays,
        itinerary: fallbackItinerary
      };
      localStorage.setItem('currentTrip', JSON.stringify(tripData));

      // Clear any existing restaurant data for this destination to force regeneration
      localStorage.removeItem(`restaurants_${destination.trim()}`);

      // Automatically generate restaurants for this destination (fallback case)
      await generateRestaurantsForDestination(destination.trim(), numDays);
    }
    
    setIsGenerating(false);
  };

  const generateRestaurantsForDestination = async (destination: string, days: number) => {
    try {
      console.log(`Attempting to generate restaurants for ${destination}...`);
      
      try {
        // Call the Supabase edge function to generate restaurants using OpenAI
        const { data, error } = await supabase.functions.invoke('generate-restaurants', {
          body: {
            destination: destination,
            days: days,
            budget: userPreferences.budget || 50
          }
        });

        if (error) {
          console.warn('Edge function error:', error.message || error);
          throw new Error('Edge function not available');
        }

        if (data && data.restaurants) {
          // Save restaurants for this destination
          localStorage.setItem(`restaurants_${destination}`, JSON.stringify(data.restaurants));
          console.log(`✅ Generated ${data.restaurants.length} restaurants for ${destination}`);
          return;
        }
      } catch (edgeError) {
        console.warn('Edge function call failed:', edgeError.message);
        throw new Error('Edge function not deployed');
      }

    } catch (error) {
      console.warn('Restaurant generation failed, using fallback:', error.message);
      
      // Generate fallback restaurants for this destination
      const fallbackRestaurants = [
        {
          id: `${destination}-1`,
          name: `${destination} Local Bistro`,
          cuisine: 'local',
          rating: 4.6,
          priceRange: '$$',
          avgCost: Math.min(userPreferences.budget * 0.7, 35),
          address: `Historic District, ${destination}`,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 750,
          specialties: ['Local Specialty', 'Traditional Cuisine', 'Regional Favorites']
        },
        {
          id: `${destination}-2`,
          name: `${destination} Street Food Market`,
          cuisine: 'street food',
          rating: 4.4,
          priceRange: '$',
          avgCost: Math.min(userPreferences.budget * 0.4, 18),
          address: `Market Square, ${destination}`,
          image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 920,
          specialties: ['Quick Bites', 'Local Street Food', 'Authentic Flavors']
        },
        {
          id: `${destination}-3`,
          name: `${destination} Fine Dining`,
          cuisine: 'international',
          rating: 4.8,
          priceRange: '$$$',
          avgCost: Math.min(userPreferences.budget * 1.3, 65),
          address: `Downtown, ${destination}`,
          image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 420,
          specialties: ['Gourmet Cuisine', 'Wine Selection', 'Chef Specials']
        },
        {
          id: `${destination}-4`,
          name: `${destination} Cultural Cafe`,
          cuisine: 'cafe',
          rating: 4.5,
          priceRange: '$',
          avgCost: Math.min(userPreferences.budget * 0.3, 15),
          address: `Arts District, ${destination}`,
          image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
          reviews: 680,
          specialties: ['Coffee & Pastries', 'Light Meals', 'Local Atmosphere']
        }
      ];
      
      // Save fallback restaurants
      localStorage.setItem(`restaurants_${destination}`, JSON.stringify(fallbackRestaurants));
      console.log(`📍 Generated ${fallbackRestaurants.length} fallback restaurants for ${destination}`);
    }
  };

  return (
    <div className="space-y-8 pb-96">
      {/* Action Bar */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-32"></div>
        
        <div className="w-32"></div>
      </motion.div>

      {/* Trip Planning Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Headlines */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold text-white text-glow mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            Plan adventures. Spend smarter.
          </motion.h1>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            AI-generated itineraries with real-time expense tracking and budget insights. All in one travel wallet.
          </motion.p>
        </div>

        <GlassCard className="p-8" glow="primary">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-3xl font-display font-bold text-white text-glow">Plan Your Perfect Trip</h2>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              <label className="block text-sm font-semibold text-white/80 mb-3">
                <MapPin className="inline h-4 w-4 mr-2 text-primary-400" />
                Destination
              </label>
              <GlassInput
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you traveling to?"
                icon={<MapPin className="h-4 w-4" />}
              />
            </motion.div>
          
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              >
                <label className="block text-sm font-semibold text-white/80 mb-3">
                  <Calendar className="inline h-4 w-4 mr-2 text-secondary-400" />
                  Number of Days
                </label>
                <GlassInput
                  type="number"
                  value={days}
                  onChange={(e) => handleDaysChange(e.target.value)}
                  placeholder="How many days?"
                  icon={<Calendar className="h-4 w-4" />}
                />
              </motion.div>
            </div>
          </div>
        
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <GlassButton
              variant="primary"
              size="lg"
              onClick={generateItinerary}
              disabled={!destination || !days || isGenerating}
              className="w-full py-4 text-lg shadow-glow-primary"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-3">
                  <motion.div 
                    className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>AI is Creating Your Itinerary...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Itinerary
                </>
              )}
            </GlassButton>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Generated Itinerary */}
      {itinerary.length > 0 && (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-glow-primary animate-pulse-glow">
              <Clock className="h-7 w-7 text-dark-900" />
            </div>
            <h3 className="text-3xl font-display font-bold text-white text-glow">
              Your {destination} Itinerary ({days} Days)
            </h3>
          </motion.div>
          
          {itinerary.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease: 'easeOut' }}
            >
              <GlassCard className="p-8" glow="secondary" hover={true}>
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-bold py-3 px-6 rounded-2xl shadow-glow-secondary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Day {day.day}
                  </motion.div>
                </div>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1, ease: 'easeOut' }}
                  >
                    <h4 className="flex items-center text-xl font-display font-semibold text-white mb-4">
                      <Clock className="h-6 w-6 mr-3 text-primary-400" />
                      Activities
                    </h4>
                    <ul className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <motion.li 
                          key={activityIndex} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + activityIndex * 0.05, ease: 'easeOut' }}
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mt-2 flex-shrink-0 shadow-glow-primary"></div>
                          <span className="text-white/90 leading-relaxed">{activity}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                  >
                    <h4 className="flex items-center text-xl font-display font-semibold text-white mb-4">
                      <Camera className="h-6 w-6 mr-3 text-secondary-400" />
                      Must-Visit Attractions
                    </h4>
                    <ul className="space-y-3">
                      {day.attractions.map((attraction, attractionIndex) => (
                        <motion.li 
                          key={attractionIndex} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 + attractionIndex * 0.05, ease: 'easeOut' }}
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full mt-2 flex-shrink-0 shadow-glow-secondary"></div>
                          <span className="text-white/90 leading-relaxed">{attraction}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              
                <motion.div 
                  className="mt-6 p-4 glass backdrop-blur-md rounded-xl border border-primary-400/30 bg-primary-500/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1, ease: 'easeOut' }}
                >
                  <p className="text-white/90 leading-relaxed">
                    <span className="text-primary-400 font-semibold">💡 Tip:</span> {day.tips}
                  </p>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <SkeletonLoader variant="avatar" className="w-16 h-16" />
            <SkeletonLoader variant="text" className="w-64 h-8" />
          </div>
          {Array.from({ length: parseInt(days) || 3 }).map((_, index) => (
            <SkeletonLoader key={index} variant="card" className="w-full" />
          ))}
        </motion.div>
      )}



      {/* Days Limit Error Modal */}
      <ErrorModal
        isOpen={showDaysLimitModal}
        onClose={() => setShowDaysLimitModal(false)}
        title="Trip Length Limit"
        message={`Trips are limited to ${MAX_DAYS} days maximum. Consider exploring a new career opportunity.`}
        actionButton={{
          label: "Find a Job",
          onClick: () => {
            setShowDaysLimitModal(false);
            setOnFindJobPage(true);
          },
          variant: "primary"
        }}
      >
        <div className="p-4 glass backdrop-blur-md rounded-xl border border-primary-400/30 bg-primary-500/10">
          <p className="text-white/90 text-sm leading-relaxed">
            <span className="text-primary-400 font-semibold">💡 Tip:</span> Many remote jobs offer flexible schedules and unlimited PTO. You might find a career that supports your travel dreams!
          </p>
        </div>
      </ErrorModal>
    </div>
  );
};

export default TripPlanner;