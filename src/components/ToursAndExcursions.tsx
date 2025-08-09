import React, { useState, useEffect } from 'react';
import { MapPin, Star, Users, Clock, DollarSign, Filter, Search, Award, Camera } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  company: string;
  location: string;
  attractions: string[];
  type: 'regular' | 'semi-private' | 'private';
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  includes: string[];
  image: string;
  maxGroupSize: number;
  languages: string[];
}

interface TourLocation {
  id: string;
  name: string;
  city: string;
  category: string;
}

const ToursAndExcursions = () => {
  const [currentDestination, setCurrentDestination] = useState<string>('');
  const [selectedTourType, setSelectedTourType] = useState<string>('all');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [tours, setTours] = useState<Tour[]>([]);
  const [availableLocations, setAvailableLocations] = useState<TourLocation[]>([]);

  // Load current trip destination
  useEffect(() => {
    const tripData = localStorage.getItem('currentTrip');
    if (tripData) {
      const trip = JSON.parse(tripData);
      setCurrentDestination(trip.destination);
      loadLocationsForDestination(trip.destination);
    }
  }, []);

  // Mock tour locations data based on destination
  const getLocationsForDestination = (destination: string): TourLocation[] => {
    const locationMap: Record<string, TourLocation[]> = {
      'Paris': [
        { id: 'louvre', name: 'Louvre Museum', city: 'Paris', category: 'Museum' },
        { id: 'eiffel', name: 'Eiffel Tower', city: 'Paris', category: 'Landmark' },
        { id: 'versailles', name: 'Palace of Versailles', city: 'Versailles', category: 'Palace' },
        { id: 'notre-dame', name: 'Notre-Dame Cathedral', city: 'Paris', category: 'Religious' },
        { id: 'arc-triomphe', name: 'Arc de Triomphe', city: 'Paris', category: 'Landmark' },
        { id: 'montmartre', name: 'Montmartre & Sacré-Cœur', city: 'Paris', category: 'District' },
        { id: 'seine-cruise', name: 'Seine River Cruise', city: 'Paris', category: 'Experience' },
        { id: 'latin-quarter', name: 'Latin Quarter', city: 'Paris', category: 'District' }
      ],
      'Rome': [
        { id: 'colosseum', name: 'Colosseum', city: 'Rome', category: 'Ancient Site' },
        { id: 'vatican', name: 'Vatican Museums & Sistine Chapel', city: 'Vatican City', category: 'Religious' },
        { id: 'roman-forum', name: 'Roman Forum', city: 'Rome', category: 'Ancient Site' },
        { id: 'pantheon', name: 'Pantheon', city: 'Rome', category: 'Ancient Site' },
        { id: 'trevi-fountain', name: 'Trevi Fountain', city: 'Rome', category: 'Landmark' },
        { id: 'spanish-steps', name: 'Spanish Steps', city: 'Rome', category: 'Landmark' }
      ],
      'London': [
        { id: 'tower-london', name: 'Tower of London', city: 'London', category: 'Historic Site' },
        { id: 'british-museum', name: 'British Museum', city: 'London', category: 'Museum' },
        { id: 'westminster', name: 'Westminster Abbey', city: 'London', category: 'Religious' },
        { id: 'buckingham', name: 'Buckingham Palace', city: 'London', category: 'Palace' },
        { id: 'london-eye', name: 'London Eye', city: 'London', category: 'Experience' },
        { id: 'stonehenge', name: 'Stonehenge', city: 'Salisbury', category: 'Ancient Site' }
      ]
    };

    return locationMap[destination] || [
      { id: 'city-center', name: 'City Center Tour', city: destination, category: 'General' },
      { id: 'historic-sites', name: 'Historic Sites', city: destination, category: 'Historic' },
      { id: 'cultural-tour', name: 'Cultural Experience', city: destination, category: 'Culture' },
      { id: 'food-tour', name: 'Food & Market Tour', city: destination, category: 'Culinary' }
    ];
  };

  // Mock tours data
  const getToursForDestination = (destination: string): Tour[] => {
    const baseTours: Tour[] = [
      {
        id: '1',
        name: 'Skip-the-Line Louvre Museum Tour',
        company: 'Paris Walking Tours',
        location: 'louvre',
        attractions: ['Louvre Museum', 'Mona Lisa', 'Venus de Milo'],
        type: 'regular',
        duration: '3 hours',
        price: 89,
        rating: 4.8,
        reviews: 2847,
        description: 'Discover the world\'s most famous artworks with an expert guide.',
        highlights: ['Skip-the-line access', 'See Mona Lisa', 'Expert art historian guide'],
        includes: ['Professional guide', 'Skip-the-line tickets', 'Headsets'],
        image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 25,
        languages: ['English', 'French', 'Spanish']
      },
      {
        id: '2',
        name: 'Private Eiffel Tower & Seine Cruise',
        company: 'Elite Paris Tours',
        location: 'eiffel',
        attractions: ['Eiffel Tower', 'Seine River', 'Trocadéro'],
        type: 'private',
        duration: '4 hours',
        price: 450,
        rating: 4.9,
        reviews: 1203,
        description: 'Exclusive private tour of Paris\'s most iconic landmark with river cruise.',
        highlights: ['Private guide', 'Eiffel Tower 2nd floor', 'Seine river cruise', 'Photo stops'],
        includes: ['Private guide', 'Eiffel Tower tickets', 'Seine cruise tickets', 'Transportation'],
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 8,
        languages: ['English', 'French']
      },
      {
        id: '3',
        name: 'Versailles Palace Semi-Private Tour',
        company: 'Royal Tours France',
        location: 'versailles',
        attractions: ['Palace of Versailles', 'Hall of Mirrors', 'Gardens'],
        type: 'semi-private',
        duration: '6 hours',
        price: 165,
        rating: 4.7,
        reviews: 1856,
        description: 'Small group tour of the magnificent Palace of Versailles.',
        highlights: ['Small group (max 12)', 'Skip-the-line access', 'Gardens visit', 'Transportation from Paris'],
        includes: ['Professional guide', 'Skip-the-line tickets', 'Round-trip transportation', 'Headsets'],
        image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 12,
        languages: ['English', 'French', 'German']
      },
      {
        id: '4',
        name: 'Montmartre & Sacré-Cœur Walking Tour',
        company: 'Discover Paris',
        location: 'montmartre',
        attractions: ['Sacré-Cœur Basilica', 'Place du Tertre', 'Moulin Rouge'],
        type: 'regular',
        duration: '2.5 hours',
        price: 35,
        rating: 4.6,
        reviews: 3421,
        description: 'Explore the artistic heart of Paris with local stories and legends.',
        highlights: ['Artist quarter visit', 'Panoramic city views', 'Local stories', 'Small group'],
        includes: ['Professional guide', 'Walking tour', 'Map of area'],
        image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 20,
        languages: ['English', 'French', 'Italian']
      },
      {
        id: '5',
        name: 'Private Louvre & Orsay Museums',
        company: 'Art Lovers Paris',
        location: 'louvre',
        attractions: ['Louvre Museum', 'Musée d\'Orsay', 'Tuileries Garden'],
        type: 'private',
        duration: '7 hours',
        price: 680,
        rating: 4.9,
        reviews: 892,
        description: 'Comprehensive private art tour covering two world-class museums.',
        highlights: ['Two major museums', 'Private art expert', 'Flexible timing', 'Lunch break'],
        includes: ['Private guide', 'Museum tickets', 'Transportation between sites', 'Lunch recommendations'],
        image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 6,
        languages: ['English', 'French']
      },
      {
        id: '6',
        name: 'Seine River Evening Cruise',
        company: 'Paris River Tours',
        location: 'seine-cruise',
        attractions: ['Seine River', 'Notre-Dame', 'Eiffel Tower', 'Louvre'],
        type: 'regular',
        duration: '1.5 hours',
        price: 25,
        rating: 4.4,
        reviews: 5672,
        description: 'Romantic evening cruise along the Seine with illuminated monuments.',
        highlights: ['Evening departure', 'Illuminated monuments', 'Audio commentary', 'Bar on board'],
        includes: ['River cruise', 'Audio guide', 'Welcome drink'],
        image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 100,
        languages: ['English', 'French', 'Spanish', 'German']
      }
    ];

    // Filter tours based on destination (in a real app, this would be API-based)
    return baseTours;
  };

  const loadLocationsForDestination = (destination: string) => {
    const locations = getLocationsForDestination(destination);
    setAvailableLocations(locations);
    
    const tours = getToursForDestination(destination);
    setTours(tours);
  };

  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations(prev => 
      prev.includes(locationId) 
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  const filteredTours = tours.filter(tour => {
    const matchesType = selectedTourType === 'all' || tour.type === selectedTourType;
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(tour.location);
    const matchesPrice = tour.price <= maxPrice;
    const matchesSearch = !searchTerm || 
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.attractions.some(attr => attr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesLocation && matchesPrice && matchesSearch;
  });

  // Group tours by location if multiple locations selected
  const groupedTours = selectedLocations.length > 1 
    ? selectedLocations.reduce((acc, locationId) => {
        const locationTours = filteredTours
          .filter(tour => tour.location === locationId)
          .sort((a, b) => b.rating - a.rating);
        
        if (locationTours.length > 0) {
          const locationName = availableLocations.find(loc => loc.id === locationId)?.name || locationId;
          acc[locationName] = locationTours;
        }
        return acc;
      }, {} as Record<string, Tour[]>)
    : { 'All Tours': filteredTours.sort((a, b) => b.rating - a.rating) };

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

  const getTourTypeIcon = (type: string) => {
    switch (type) {
      case 'private':
        return <Award className="h-4 w-4 text-purple-600" />;
      case 'semi-private':
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-green-600" />;
    }
  };

  const getTourTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'private':
        return 'bg-purple-100 text-purple-800';
      case 'semi-private':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Tours & Excursions</h2>
        </div>
        <p className="text-emerald-100">
          {currentDestination 
            ? `Discover the best guided tours and excursions in ${currentDestination}`
            : 'Plan a trip first to see location-specific tours and excursions'
          }
        </p>
      </div>

      {!currentDestination ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Destination Selected</h3>
          <p className="text-gray-600">Please go to the "Plan Trip" tab and select your destination first.</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="h-6 w-6 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">Filter Tours</h3>
            </div>
            
            <div className="space-y-6">
              {/* Tour Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Tour Type</label>
                <div className="flex flex-wrap gap-3">
                  {['all', 'regular', 'semi-private', 'private'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedTourType(type)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedTourType === type
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type !== 'all' && getTourTypeIcon(type)}
                      <span className="capitalize">{type === 'all' ? 'All Types' : type.replace('-', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Attractions/Locations ({selectedLocations.length} selected)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableLocations.map(location => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationToggle(location.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedLocations.includes(location.id)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs text-gray-500">{location.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price: ${maxPrice}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$20</span>
                    <span>$1000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Tours</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, company, or attraction..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {Object.entries(groupedTours).map(([groupName, groupTours]) => (
              <div key={groupName} className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    {groupName} ({groupTours.length} tours)
                  </h3>
                  {selectedLocations.length > 1 && (
                    <p className="text-sm text-gray-600 mt-1">Sorted by rating (highest first)</p>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {groupTours.map((tour) => (
                      <div key={tour.id} className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                        <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                          <img
                            src={tour.image}
                            alt={tour.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {tour.name}
                            </h4>
                            <span className="text-lg font-bold text-green-600 ml-2">
                              ${tour.price}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{tour.company}</p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(tour.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {tour.rating} ({tour.reviews} reviews)
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{tour.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Max {tour.maxGroupSize}</span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full capitalize ${getTourTypeBadgeColor(tour.type)}`}>
                              {getTourTypeIcon(tour.type)}
                              <span>{tour.type.replace('-', ' ')}</span>
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{tour.description}</p>
                          
                          <div className="mb-3">
                            <h5 className="text-xs font-semibold text-gray-800 mb-1">Highlights:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {tour.highlights.slice(0, 3).map((highlight, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {tour.attractions.slice(0, 3).map((attraction, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {attraction}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {Object.keys(groupedTours).length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more tour options.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ToursAndExcursions;