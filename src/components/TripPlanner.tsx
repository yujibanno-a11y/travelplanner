import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Clock, Camera, Mountain, Building, MessageCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useItineraryHistory } from '../hooks/useItineraryHistory';
import { useTheme } from './ThemeProvider';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import GlassInput from './GlassInput';
import SkeletonLoader from './SkeletonLoader';
import ChatPanel from './ChatPanel';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const handleItineraryAction = (action: ItineraryAction) => {
    let newItinerary = [...itinerary];
    
    switch (action.type) {
      case 'regenerateDay':
        if (action.payload.day && action.payload.activities) {
          const dayIndex = newItinerary.findIndex(d => d.day === action.payload.day);
          if (dayIndex !== -1) {
            newItinerary[dayIndex] = {
              ...newItinerary[dayIndex],
              activities: action.payload.activities,
              attractions: action.payload.attractions || newItinerary[dayIndex].attractions,
              tips: action.payload.tips || newItinerary[dayIndex].tips
            };
          }
        }
        break;
        
      case 'insertActivity':
        if (action.payload.day && action.payload.activity) {
          const dayIndex = newItinerary.findIndex(d => d.day === action.payload.day);
          if (dayIndex !== -1) {
            newItinerary[dayIndex].activities.push(action.payload.activity);
          }
        }
        break;
        
      case 'lightenDay':
        if (action.payload.day) {
          const dayIndex = newItinerary.findIndex(d => d.day === action.payload.day);
          if (dayIndex !== -1 && newItinerary[dayIndex].activities.length > 1) {
            newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.slice(0, -1);
          }
        }
        break;
        
      case 'updateItinerary':
        if (action.payload.itinerary) {
          newItinerary = action.payload.itinerary;
        }
        break;
    }
    
    if (JSON.stringify(newItinerary) !== JSON.stringify(itinerary)) {
      pushState(newItinerary);
      setItinerary(newItinerary);
    }
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
    
    // Destination-specific data
    const destinationData = {
      'paris': {
        activities: [
          'Visit the Eiffel Tower at sunset',
          'Explore the Louvre Museum and see the Mona Lisa',
          'Stroll through Montmartre and visit Sacré-Cœur',
          'Take a Seine River cruise',
          'Walk through the Latin Quarter',
          'Visit Notre-Dame Cathedral (exterior)',
          'Explore the Champs-Élysées and Arc de Triomphe',
          'Discover the Palace of Versailles',
          'Browse the Marché aux Puces flea market',
          'Enjoy a picnic in Luxembourg Gardens'
        ],
        places: [
          'Eiffel Tower - Iconic iron lattice tower with panoramic city views',
          'Louvre Museum - World\'s largest art museum housing the Mona Lisa',
          'Montmartre District - Historic hilltop area with cobblestone streets',
          'Seine River - Historic river perfect for romantic boat cruises',
          'Latin Quarter - Medieval streets filled with cafés and bookshops',
          'Champs-Élysées - Famous avenue for shopping and people-watching',
          'Palace of Versailles - Opulent royal château with stunning gardens',
          'Musée d\'Orsay - Impressive collection of Impressionist masterpieces',
          'Sainte-Chapelle - Gothic chapel with breathtaking stained glass',
          'Le Marais - Trendy neighborhood with Jewish quarter and boutiques'
        ]
      },
      'tokyo': {
        activities: [
          'Experience the bustling Shibuya Crossing',
          'Visit the serene Senso-ji Temple in Asakusa',
          'Explore the trendy Harajuku district',
          'Take in city views from Tokyo Skytree',
          'Stroll through the Imperial Palace East Gardens',
          'Experience a traditional tea ceremony',
          'Visit the famous Tsukiji Outer Market',
          'Explore the electronic wonderland of Akihabara',
          'Enjoy cherry blossoms in Ueno Park',
          'Take a day trip to Mount Fuji'
        ],
        places: [
          'Shibuya Crossing - World\'s busiest pedestrian crossing',
          'Senso-ji Temple - Tokyo\'s oldest Buddhist temple in historic Asakusa',
          'Harajuku - Youth culture hub famous for unique fashion',
          'Tokyo Skytree - Tallest structure in Japan with observation decks',
          'Imperial Palace - Former Edo Castle with beautiful East Gardens',
          'Meiji Shrine - Peaceful Shinto shrine surrounded by forest',
          'Tsukiji Outer Market - Fresh seafood and street food paradise',
          'Akihabara - Electronics district and anime culture center',
          'Ueno Park - Cultural district with museums and seasonal cherry blossoms',
          'Ginza - Upscale shopping district with luxury boutiques'
        ]
      },
      'new york': {
        activities: [
          'Visit the Statue of Liberty and Ellis Island',
          'Explore Central Park and rent a bike',
          'See a Broadway show in Times Square',
          'Walk across the Brooklyn Bridge',
          'Visit the 9/11 Memorial and Museum',
          'Explore the High Line elevated park',
          'Take the Staten Island Ferry for free Statue views',
          'Visit the Metropolitan Museum of Art',
          'Explore diverse neighborhoods like SoHo and Greenwich Village',
          'Experience the energy of Wall Street and Financial District'
        ],
        places: [
          'Statue of Liberty - Iconic symbol of freedom on Liberty Island',
          'Central Park - 843-acre green oasis in Manhattan',
          'Times Square - Bright lights and Broadway theaters',
          'Brooklyn Bridge - Historic suspension bridge with walkway',
          '9/11 Memorial - Moving tribute at World Trade Center site',
          'High Line - Elevated park built on former railway tracks',
          'Metropolitan Museum - One of world\'s largest and most prestigious art museums',
          'Empire State Building - Art Deco skyscraper with observation decks',
          'SoHo - Trendy neighborhood known for cast-iron architecture and shopping',
          'Greenwich Village - Historic bohemian neighborhood with charming streets'
        ]
      },
      'london': {
        activities: [
          'Tour the Tower of London and see the Crown Jewels',
          'Ride the London Eye for panoramic city views',
          'Explore the British Museum\'s vast collections',
          'Watch the Changing of the Guard at Buckingham Palace',
          'Stroll through Hyde Park and Speaker\'s Corner',
          'Take a Thames River cruise',
          'Explore the vibrant Camden Market',
          'Visit Shakespeare\'s Globe Theatre',
          'Discover the historic Borough Market',
          'Take a day trip to Windsor Castle'
        ],
        places: [
          'Tower of London - Historic castle housing the Crown Jewels',
          'London Eye - Giant observation wheel on the South Bank',
          'British Museum - World-class museum with artifacts from around the globe',
          'Buckingham Palace - Official residence of the British monarch',
          'Hyde Park - Royal park perfect for walks and outdoor activities',
          'Westminster Abbey - Gothic church where monarchs are crowned',
          'Camden Market - Alternative market with unique shops and food stalls',
          'Tate Modern - Contemporary art museum in former power station',
          'Covent Garden - Historic market area with street performers',
          'Notting Hill - Colorful neighborhood famous for Portobello Road Market'
        ]
      },
      'rome': {
        activities: [
          'Explore the ancient Colosseum and Roman Forum',
          'Visit Vatican City and the Sistine Chapel',
          'Throw a coin in the Trevi Fountain',
          'Climb the Spanish Steps',
          'Wander through the charming Trastevere neighborhood',
          'Visit the Pantheon and marvel at its architecture',
          'Explore the Borghese Gallery and Gardens',
          'Take a food tour and try authentic Roman cuisine',
          'Visit the Castel Sant\'Angelo',
          'Explore the underground Catacombs'
        ],
        places: [
          'Colosseum - Ancient amphitheater and iconic symbol of Rome',
          'Vatican City - Smallest country in the world with St. Peter\'s Basilica',
          'Trevi Fountain - Baroque fountain where wishes come true',
          'Spanish Steps - Famous stairway connecting Piazza di Spagna',
          'Trastevere - Medieval neighborhood with narrow cobblestone streets',
          'Pantheon - Best-preserved Roman building with impressive dome',
          'Roman Forum - Heart of ancient Rome with ruins and temples',
          'Borghese Gallery - Art museum in beautiful villa with gardens',
          'Castel Sant\'Angelo - Cylindrical building originally Hadrian\'s mausoleum',
          'Piazza Navona - Baroque square with beautiful fountains and street artists'
        ]
      }
    };

    // Get destination-specific content or use generic content
    const destKey = destination.toLowerCase();
    const destData = destinationData[destKey] || {
      activities: [
        'Explore the main city center and historic districts',
        'Visit local museums and cultural sites',
        'Try authentic local cuisine at recommended restaurants',
        'Take guided tours of famous landmarks',
        'Explore local markets and shopping areas',
        'Visit parks and natural attractions',
        'Experience local nightlife and entertainment',
        'Take day trips to nearby attractions',
        'Participate in cultural activities and events',
        'Discover hidden gems and local favorites'
      ],
      places: [
        'Historic City Center - Main area with key landmarks and attractions',
        'Local Museums - Cultural institutions showcasing regional history',
        'Traditional Markets - Local markets with authentic goods and food',
        'Main Cathedral/Temple - Primary religious or spiritual site',
        'Central Park/Gardens - Green spaces for relaxation and recreation',
        'Waterfront Area - Scenic areas along rivers, lakes, or coastline',
        'Arts District - Area known for galleries, theaters, and cultural venues',
        'Old Town - Historic quarter with traditional architecture',
        'Observation Deck - High vantage point for city or landscape views',
        'Local Neighborhoods - Authentic residential areas with local character'
      ]
    };

    try {
      // Fallback to basic itinerary if AI generation fails
      const numDays = parseInt(days);
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
      ];
        
      for (let i = 1; i <= numDays; i++) {
        const dayNumber = i;
        const dayActivities = destData.activities
          .slice((i - 1) * 3, i * 3)
          .concat(baseActivities.slice((i - 1) * 2, i * 2))
          .slice(0, 4);
        
        const dayAttractions = [
          baseAttractions[(i - 1) * 4] || baseAttractions[i % baseAttractions.length],
          baseAttractions[(i - 1) * 4 + 1] || baseAttractions[(i + 4) % baseAttractions.length],
          baseAttractions[(i - 1) * 4 + 2] || baseAttractions[(i + 8) % baseAttractions.length],
          baseAttractions[(i - 1) * 4 + 3] || baseAttractions[(i + 12) % baseAttractions.length]
        ];
        
        const dayPlaces = destData.places
          .slice((i - 1) * 3, i * 3)
          .concat(dayAttractions)
          .slice(0, 4);
        
        fallbackItinerary.push({
          day: dayNumber,
          activities: dayActivities,
          attractions: dayPlaces,
          tips: `Don't forget to try the local cuisine and bring comfortable walking shoes for day ${i}!`
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
    } catch (error) {
      console.error('Error generating itinerary:', error);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-32"></div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => setIsChatOpen(true)}
            className="shadow-glow-primary"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Assistant
          </GlassButton>
        </motion.div>
      </motion.div>

      {/* Trip Planning Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
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

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userPreferences={userPreferences}
        onUpdatePreferences={handleUpdatePreferences}
        currentItinerary={itinerary}
        onItineraryAction={handleItineraryAction}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isMobile={isMobile}
      />


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