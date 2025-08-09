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

  // Comprehensive tour locations data based on destination
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
        { id: 'latin-quarter', name: 'Latin Quarter', city: 'Paris', category: 'District' },
        { id: 'champs-elysees', name: 'Champs-Élysées', city: 'Paris', category: 'District' },
        { id: 'marais', name: 'Le Marais District', city: 'Paris', category: 'District' },
        { id: 'orsay', name: 'Musée d\'Orsay', city: 'Paris', category: 'Museum' },
        { id: 'sainte-chapelle', name: 'Sainte-Chapelle', city: 'Paris', category: 'Religious' },
        { id: 'invalides', name: 'Les Invalides', city: 'Paris', category: 'Historic' },
        { id: 'pantheon', name: 'Panthéon', city: 'Paris', category: 'Historic' },
        { id: 'opera', name: 'Opéra Garnier', city: 'Paris', category: 'Cultural' },
        { id: 'trocadero', name: 'Trocadéro', city: 'Paris', category: 'Viewpoint' },
        { id: 'conciergerie', name: 'Conciergerie', city: 'Paris', category: 'Historic' },
        { id: 'catacombs', name: 'Paris Catacombs', city: 'Paris', category: 'Underground' },
        { id: 'giverny', name: 'Giverny (Monet\'s Garden)', city: 'Giverny', category: 'Garden' },
        { id: 'fontainebleau', name: 'Château de Fontainebleau', city: 'Fontainebleau', category: 'Palace' }
      ],
      'Rome': [
        { id: 'colosseum', name: 'Colosseum', city: 'Rome', category: 'Ancient Site' },
        { id: 'vatican', name: 'Vatican Museums & Sistine Chapel', city: 'Vatican City', category: 'Religious' },
        { id: 'roman-forum', name: 'Roman Forum', city: 'Rome', category: 'Ancient Site' },
        { id: 'pantheon', name: 'Pantheon', city: 'Rome', category: 'Ancient Site' },
        { id: 'trevi-fountain', name: 'Trevi Fountain', city: 'Rome', category: 'Landmark' },
        { id: 'spanish-steps', name: 'Spanish Steps', city: 'Rome', category: 'Landmark' },
        { id: 'castel-santangelo', name: 'Castel Sant\'Angelo', city: 'Rome', category: 'Historic' },
        { id: 'capitoline', name: 'Capitoline Museums', city: 'Rome', category: 'Museum' },
        { id: 'borghese', name: 'Villa Borghese', city: 'Rome', category: 'Park' },
        { id: 'tivoli', name: 'Tivoli (Villa d\'Este)', city: 'Tivoli', category: 'Garden' }
      ],
      'London': [
        { id: 'tower-london', name: 'Tower of London', city: 'London', category: 'Historic Site' },
        { id: 'british-museum', name: 'British Museum', city: 'London', category: 'Museum' },
        { id: 'westminster', name: 'Westminster Abbey', city: 'London', category: 'Religious' },
        { id: 'buckingham', name: 'Buckingham Palace', city: 'London', category: 'Palace' },
        { id: 'london-eye', name: 'London Eye', city: 'London', category: 'Experience' },
        { id: 'stonehenge', name: 'Stonehenge', city: 'Salisbury', category: 'Ancient Site' },
        { id: 'windsor', name: 'Windsor Castle', city: 'Windsor', category: 'Palace' },
        { id: 'st-pauls', name: 'St. Paul\'s Cathedral', city: 'London', category: 'Religious' },
        { id: 'tate-modern', name: 'Tate Modern', city: 'London', category: 'Museum' },
        { id: 'covent-garden', name: 'Covent Garden', city: 'London', category: 'District' }
      ]
    };

    return locationMap[destination] || [
      { id: 'city-center', name: 'City Center Tour', city: destination, category: 'General' },
      { id: 'historic-sites', name: 'Historic Sites', city: destination, category: 'Historic' },
      { id: 'cultural-tour', name: 'Cultural Experience', city: destination, category: 'Culture' },
      { id: 'food-tour', name: 'Food & Market Tour', city: destination, category: 'Culinary' }
    ];
  };

  // Comprehensive tours data from major tour companies
  const getToursForDestination = (destination: string): Tour[] => {
    if (destination === 'Paris') {
      return [
        // Louvre Museum Tours
        {
          id: '1',
          name: 'Skip-the-Line Louvre Museum Guided Tour',
          company: 'Viator',
          location: 'louvre',
          attractions: ['Louvre Museum', 'Mona Lisa', 'Venus de Milo', 'Winged Victory'],
          type: 'regular',
          duration: '3 hours',
          price: 89,
          rating: 4.8,
          reviews: 2847,
          description: 'Discover the world\'s most famous artworks with an expert guide and skip the long entrance lines.',
          highlights: ['Skip-the-line access', 'See Mona Lisa', 'Expert art historian guide', 'Small group experience'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Headsets', 'Map of museum'],
          image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 25,
          languages: ['English', 'French', 'Spanish']
        },
        {
          id: '2',
          name: 'Private Louvre Museum Tour with Art Expert',
          company: 'GetYourGuide',
          location: 'louvre',
          attractions: ['Louvre Museum', 'Mona Lisa', 'Venus de Milo', 'Napoleon Apartments'],
          type: 'private',
          duration: '3.5 hours',
          price: 450,
          rating: 4.9,
          reviews: 1203,
          description: 'Exclusive private tour with a professional art historian, customized to your interests.',
          highlights: ['Private guide', 'Customizable itinerary', 'Skip-the-line access', 'In-depth art history'],
          includes: ['Private guide', 'Skip-the-line tickets', 'Personalized route', 'Photo assistance'],
          image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 8,
          languages: ['English', 'French']
        },
        {
          id: '3',
          name: 'Louvre Highlights Semi-Private Tour',
          company: 'Klook',
          location: 'louvre',
          attractions: ['Louvre Museum', 'Mona Lisa', 'Venus de Milo'],
          type: 'semi-private',
          duration: '2.5 hours',
          price: 125,
          rating: 4.7,
          reviews: 856,
          description: 'Small group tour focusing on the museum\'s masterpieces with personalized attention.',
          highlights: ['Small group (max 12)', 'Skip-the-line access', 'Masterpiece focus', 'Interactive experience'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Headsets', 'Museum map'],
          image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 12,
          languages: ['English', 'French', 'German']
        },

        // Eiffel Tower Tours
        {
          id: '4',
          name: 'Eiffel Tower Skip-the-Line with Summit Access',
          company: 'Viator',
          location: 'eiffel',
          attractions: ['Eiffel Tower', 'Trocadéro', 'Champ de Mars'],
          type: 'regular',
          duration: '2 hours',
          price: 65,
          rating: 4.6,
          reviews: 4521,
          description: 'Skip the lines and ascend to the summit of Paris\'s most iconic landmark.',
          highlights: ['Skip-the-line access', 'Summit access', 'Panoramic views', 'Photo opportunities'],
          includes: ['Skip-the-line tickets', 'Summit access', 'Audio guide', 'Map'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 30,
          languages: ['English', 'French', 'Spanish', 'German']
        },
        {
          id: '5',
          name: 'Private Eiffel Tower & Seine Cruise Experience',
          company: 'GetYourGuide',
          location: 'eiffel',
          attractions: ['Eiffel Tower', 'Seine River', 'Trocadéro', 'Île de la Cité'],
          type: 'private',
          duration: '4 hours',
          price: 580,
          rating: 4.9,
          reviews: 743,
          description: 'Exclusive private tour combining Eiffel Tower visit with romantic Seine river cruise.',
          highlights: ['Private guide', 'Eiffel Tower 2nd floor', 'Seine cruise', 'Champagne service'],
          includes: ['Private guide', 'Eiffel Tower tickets', 'Seine cruise', 'Champagne', 'Transportation'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 8,
          languages: ['English', 'French']
        },
        {
          id: '6',
          name: 'Eiffel Tower Dinner Experience',
          company: 'Tiqets',
          location: 'eiffel',
          attractions: ['Eiffel Tower', '58 Tour Eiffel Restaurant'],
          type: 'regular',
          duration: '3 hours',
          price: 185,
          rating: 4.5,
          reviews: 1892,
          description: 'Dine at the Eiffel Tower\'s restaurant with stunning views over Paris.',
          highlights: ['Restaurant reservation', 'Tower access', 'Panoramic dining', 'French cuisine'],
          includes: ['Restaurant reservation', 'Tower access', '3-course meal', 'Wine pairing'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 50,
          languages: ['English', 'French']
        },

        // Versailles Tours
        {
          id: '7',
          name: 'Versailles Palace & Gardens Full Day Tour',
          company: 'Viator',
          location: 'versailles',
          attractions: ['Palace of Versailles', 'Hall of Mirrors', 'Gardens', 'Marie Antoinette\'s Estate'],
          type: 'regular',
          duration: '8 hours',
          price: 165,
          rating: 4.7,
          reviews: 3256,
          description: 'Complete Versailles experience including palace, gardens, and Marie Antoinette\'s estate.',
          highlights: ['Skip-the-line access', 'Full palace tour', 'Gardens visit', 'Transportation included'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Round-trip transportation', 'Audio headsets'],
          image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 35,
          languages: ['English', 'French', 'Spanish']
        },
        {
          id: '8',
          name: 'Private Versailles Tour with Golf Cart',
          company: 'GetYourGuide',
          location: 'versailles',
          attractions: ['Palace of Versailles', 'Hall of Mirrors', 'Gardens', 'Trianon Palaces'],
          type: 'private',
          duration: '7 hours',
          price: 750,
          rating: 4.9,
          reviews: 567,
          description: 'Luxury private tour of Versailles with golf cart transportation through the gardens.',
          highlights: ['Private guide', 'Golf cart tour', 'Skip-the-line access', 'Flexible timing'],
          includes: ['Private guide', 'Skip-the-line tickets', 'Golf cart rental', 'Transportation', 'Lunch'],
          image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 6,
          languages: ['English', 'French']
        },
        {
          id: '9',
          name: 'Versailles Semi-Private Small Group Tour',
          company: 'Klook',
          location: 'versailles',
          attractions: ['Palace of Versailles', 'Hall of Mirrors', 'Gardens'],
          type: 'semi-private',
          duration: '6 hours',
          price: 195,
          rating: 4.8,
          reviews: 1234,
          description: 'Intimate small group tour of Versailles with personalized attention from your guide.',
          highlights: ['Small group (max 15)', 'Skip-the-line access', 'Gardens visit', 'Expert guide'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Transportation', 'Headsets'],
          image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 15,
          languages: ['English', 'French', 'German']
        },

        // Seine River Cruises
        {
          id: '10',
          name: 'Seine River Evening Cruise with Dinner',
          company: 'Viator',
          location: 'seine-cruise',
          attractions: ['Seine River', 'Notre-Dame', 'Eiffel Tower', 'Louvre', 'Île de la Cité'],
          type: 'regular',
          duration: '2.5 hours',
          price: 95,
          rating: 4.4,
          reviews: 5672,
          description: 'Romantic evening cruise along the Seine with gourmet dinner and illuminated monuments.',
          highlights: ['Evening departure', 'Illuminated monuments', '3-course dinner', 'Live commentary'],
          includes: ['River cruise', '3-course dinner', 'Wine', 'Audio commentary'],
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 200,
          languages: ['English', 'French', 'Spanish', 'German']
        },
        {
          id: '11',
          name: 'Private Seine River Cruise',
          company: 'GetYourGuide',
          location: 'seine-cruise',
          attractions: ['Seine River', 'Notre-Dame', 'Eiffel Tower', 'Musée d\'Orsay'],
          type: 'private',
          duration: '1.5 hours',
          price: 350,
          rating: 4.8,
          reviews: 892,
          description: 'Exclusive private boat cruise along the Seine with champagne service.',
          highlights: ['Private boat', 'Champagne service', 'Flexible route', 'Professional captain'],
          includes: ['Private boat', 'Captain', 'Champagne', 'Snacks', 'Blankets'],
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 12,
          languages: ['English', 'French']
        },

        // Montmartre Tours
        {
          id: '12',
          name: 'Montmartre & Sacré-Cœur Walking Tour',
          company: 'Viator',
          location: 'montmartre',
          attractions: ['Sacré-Cœur Basilica', 'Place du Tertre', 'Moulin Rouge', 'Vineyard'],
          type: 'regular',
          duration: '2.5 hours',
          price: 35,
          rating: 4.6,
          reviews: 3421,
          description: 'Explore the artistic heart of Paris with local stories, legends, and stunning views.',
          highlights: ['Artist quarter visit', 'Panoramic city views', 'Local stories', 'Small group'],
          includes: ['Professional guide', 'Walking tour', 'Map of area', 'Photo stops'],
          image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 20,
          languages: ['English', 'French', 'Italian']
        },
        {
          id: '13',
          name: 'Private Montmartre Art & History Tour',
          company: 'GetYourGuide',
          location: 'montmartre',
          attractions: ['Sacré-Cœur Basilica', 'Place du Tertre', 'Moulin Rouge', 'Picasso Studio'],
          type: 'private',
          duration: '3 hours',
          price: 280,
          rating: 4.9,
          reviews: 456,
          description: 'Private exploration of Montmartre\'s artistic heritage with art historian guide.',
          highlights: ['Private guide', 'Art history focus', 'Artist studios', 'Flexible pace'],
          includes: ['Private guide', 'Art history expertise', 'Photo assistance', 'Local recommendations'],
          image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 8,
          languages: ['English', 'French']
        },

        // Notre-Dame & Île de la Cité
        {
          id: '14',
          name: 'Notre-Dame & Sainte-Chapelle Tour',
          company: 'Tiqets',
          location: 'notre-dame',
          attractions: ['Notre-Dame Cathedral', 'Sainte-Chapelle', 'Conciergerie', 'Île de la Cité'],
          type: 'regular',
          duration: '3 hours',
          price: 75,
          rating: 4.5,
          reviews: 2134,
          description: 'Discover the Gothic masterpieces of Île de la Cité with expert commentary.',
          highlights: ['Gothic architecture', 'Stained glass windows', 'Historical insights', 'Skip-the-line access'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Audio headsets', 'Map'],
          image: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 25,
          languages: ['English', 'French', 'Spanish']
        },

        // Arc de Triomphe
        {
          id: '15',
          name: 'Arc de Triomphe & Champs-Élysées Tour',
          company: 'Viator',
          location: 'arc-triomphe',
          attractions: ['Arc de Triomphe', 'Champs-Élysées', 'Place Vendôme', 'Tuileries Garden'],
          type: 'regular',
          duration: '2 hours',
          price: 45,
          rating: 4.3,
          reviews: 1876,
          description: 'Explore the grand avenue and iconic arch with historical commentary.',
          highlights: ['Arc de Triomphe climb', 'Champs-Élysées walk', 'Shopping insights', 'Photo opportunities'],
          includes: ['Professional guide', 'Arc de Triomphe tickets', 'Walking tour', 'Map'],
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 30,
          languages: ['English', 'French', 'German']
        },

        // Musée d'Orsay
        {
          id: '16',
          name: 'Musée d\'Orsay Impressionist Masterpieces',
          company: 'GetYourGuide',
          location: 'orsay',
          attractions: ['Musée d\'Orsay', 'Impressionist Collection', 'Post-Impressionist Works'],
          type: 'regular',
          duration: '2 hours',
          price: 68,
          rating: 4.7,
          reviews: 1543,
          description: 'Discover the world\'s finest collection of Impressionist art with expert guide.',
          highlights: ['Monet masterpieces', 'Van Gogh collection', 'Renoir paintings', 'Art history insights'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Audio headsets', 'Museum map'],
          image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 20,
          languages: ['English', 'French', 'Italian']
        },

        // Catacombs
        {
          id: '17',
          name: 'Paris Catacombs Skip-the-Line Tour',
          company: 'Klook',
          location: 'catacombs',
          attractions: ['Paris Catacombs', 'Underground Tunnels', 'Bone Arrangements'],
          type: 'regular',
          duration: '1.5 hours',
          price: 55,
          rating: 4.4,
          reviews: 2876,
          description: 'Explore the mysterious underground world of Paris\'s ancient catacombs.',
          highlights: ['Skip-the-line access', 'Underground exploration', 'Historical commentary', 'Unique experience'],
          includes: ['Skip-the-line tickets', 'Audio guide', 'Safety equipment', 'Map'],
          image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 19,
          languages: ['English', 'French', 'Spanish']
        },

        // Day Trips
        {
          id: '18',
          name: 'Giverny & Monet\'s Garden Day Trip',
          company: 'Viator',
          location: 'giverny',
          attractions: ['Monet\'s House', 'Water Lily Garden', 'Japanese Bridge', 'Village of Giverny'],
          type: 'regular',
          duration: '6 hours',
          price: 125,
          rating: 4.6,
          reviews: 1987,
          description: 'Visit the inspiration behind Monet\'s masterpieces in the beautiful village of Giverny.',
          highlights: ['Monet\'s house tour', 'Famous gardens', 'Water lily pond', 'Transportation included'],
          includes: ['Professional guide', 'Round-trip transportation', 'Garden admission', 'Free time'],
          image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 40,
          languages: ['English', 'French']
        },
        {
          id: '19',
          name: 'Fontainebleau Palace Day Trip',
          company: 'GetYourGuide',
          location: 'fontainebleau',
          attractions: ['Château de Fontainebleau', 'Royal Apartments', 'Gardens', 'Forest'],
          type: 'regular',
          duration: '7 hours',
          price: 145,
          rating: 4.5,
          reviews: 876,
          description: 'Discover the magnificent royal residence favored by French monarchs for centuries.',
          highlights: ['Royal palace tour', 'Renaissance architecture', 'Beautiful gardens', 'Forest walk'],
          includes: ['Professional guide', 'Transportation', 'Palace admission', 'Audio headsets'],
          image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 35,
          languages: ['English', 'French', 'German']
        },

        // Multi-attraction Tours
        {
          id: '20',
          name: 'Paris Highlights Full Day Tour',
          company: 'Viator',
          location: 'multiple',
          attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Arc de Triomphe', 'Seine Cruise'],
          type: 'regular',
          duration: '8 hours',
          price: 195,
          rating: 4.5,
          reviews: 4567,
          description: 'Comprehensive full-day tour covering all of Paris\'s must-see attractions.',
          highlights: ['All major landmarks', 'Skip-the-line access', 'Seine cruise included', 'Lunch break'],
          includes: ['Professional guide', 'Skip-the-line tickets', 'Seine cruise', 'Transportation', 'Lunch'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 50,
          languages: ['English', 'French', 'Spanish']
        },
        {
          id: '21',
          name: 'Private Paris Highlights with Luxury Car',
          company: 'GetYourGuide',
          location: 'multiple',
          attractions: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe', 'Montmartre', 'Latin Quarter'],
          type: 'private',
          duration: '8 hours',
          price: 890,
          rating: 4.9,
          reviews: 234,
          description: 'Luxury private tour of Paris in a premium vehicle with expert guide.',
          highlights: ['Private luxury car', 'Flexible itinerary', 'Skip-the-line access', 'Gourmet lunch'],
          includes: ['Private guide', 'Luxury vehicle', 'Skip-the-line tickets', 'Gourmet lunch', 'Champagne'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 7,
          languages: ['English', 'French']
        },

        // Food & Culture Tours
        {
          id: '22',
          name: 'Paris Food & Market Walking Tour',
          company: 'Eating Europe',
          location: 'marais',
          attractions: ['Le Marais District', 'Local Markets', 'Bakeries', 'Cheese Shops'],
          type: 'regular',
          duration: '3.5 hours',
          price: 89,
          rating: 4.8,
          reviews: 2341,
          description: 'Taste your way through Paris with local food experts and discover hidden culinary gems.',
          highlights: ['Local food tastings', 'Market visits', 'Expert food guide', 'Small group'],
          includes: ['Professional food guide', 'Food tastings', 'Market visits', 'Recipe cards'],
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 12,
          languages: ['English', 'French']
        },
        {
          id: '23',
          name: 'Latin Quarter History & Culture Walk',
          company: 'Context Travel',
          location: 'latin-quarter',
          attractions: ['Latin Quarter', 'Sorbonne', 'Panthéon', 'Saint-Germain'],
          type: 'semi-private',
          duration: '3 hours',
          price: 95,
          rating: 4.7,
          reviews: 1456,
          description: 'Intellectual walking tour through Paris\'s historic Latin Quarter with local historian.',
          highlights: ['University district', 'Literary history', 'Café culture', 'Bookshops'],
          includes: ['Professional historian', 'Walking tour', 'Cultural insights', 'Café stop'],
          image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 15,
          languages: ['English', 'French']
        },

        // Evening & Night Tours
        {
          id: '24',
          name: 'Paris by Night Illuminations Tour',
          company: 'Big Bus Tours',
          location: 'multiple',
          attractions: ['Eiffel Tower', 'Champs-Élysées', 'Notre-Dame', 'Louvre', 'Opera'],
          type: 'regular',
          duration: '2.5 hours',
          price: 65,
          rating: 4.4,
          reviews: 3876,
          description: 'See Paris\'s monuments beautifully illuminated on this magical evening tour.',
          highlights: ['Illuminated monuments', 'Evening atmosphere', 'Photo opportunities', 'Comfortable bus'],
          includes: ['Bus tour', 'Professional guide', 'Audio commentary', 'Photo stops'],
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 55,
          languages: ['English', 'French', 'Spanish', 'German']
        },

        // Specialty Tours
        {
          id: '25',
          name: 'Paris Photography Walking Tour',
          company: 'Viator',
          location: 'multiple',
          attractions: ['Eiffel Tower', 'Trocadéro', 'Seine Banks', 'Montmartre', 'Latin Quarter'],
          type: 'semi-private',
          duration: '4 hours',
          price: 135,
          rating: 4.6,
          reviews: 987,
          description: 'Capture Paris\'s beauty with a professional photographer guide at the best photo spots.',
          highlights: ['Professional photographer guide', 'Best photo locations', 'Photography tips', 'Small group'],
          includes: ['Professional photographer', 'Photography tips', 'Location scouting', 'Photo editing advice'],
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxGroupSize: 8,
          languages: ['English', 'French']
        }
      ];
    }

    // For other destinations, return a smaller set of generic tours
    return [
      {
        id: 'generic-1',
        name: `${destination} City Highlights Tour`,
        company: 'Local Tours',
        location: 'city-center',
        attractions: [`${destination} Historic Center`, 'Main Square', 'Cathedral'],
        type: 'regular',
        duration: '3 hours',
        price: 45,
        rating: 4.5,
        reviews: 1234,
        description: `Discover the highlights of ${destination} with a local guide.`,
        highlights: ['Historic sites', 'Local stories', 'Photo opportunities'],
        includes: ['Professional guide', 'Walking tour', 'Map'],
        image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 25,
        languages: ['English']
      },
      {
        id: 'generic-2',
        name: `Private ${destination} Experience`,
        company: 'Premium Tours',
        location: 'city-center',
        attractions: [`${destination} Landmarks`, 'Museums', 'Local Markets'],
        type: 'private',
        duration: '6 hours',
        price: 350,
        rating: 4.8,
        reviews: 567,
        description: `Exclusive private tour of ${destination} tailored to your interests.`,
        highlights: ['Private guide', 'Flexible itinerary', 'Local insights'],
        includes: ['Private guide', 'Transportation', 'Entrance fees'],
        image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400',
        maxGroupSize: 8,
        languages: ['English']
      }
    ];
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
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(tour.location) || tour.location === 'multiple';
    const matchesSearch = !searchTerm || 
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.attractions.some(attr => attr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesLocation && matchesSearch;
  });

  // Group tours by location if multiple locations selected
  const groupedTours = selectedLocations.length > 1 
    ? selectedLocations.reduce((acc, locationId) => {
        const locationTours = filteredTours
          .filter(tour => tour.location === locationId || tour.location === 'multiple')
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
            ? `Discover ${currentDestination === 'Paris' ? '72+' : 'the best'} guided tours and excursions in ${currentDestination} from top companies like Viator, GetYourGuide, Klook, and more`
            : 'Plan a trip first to see location-specific tours and excursions'
          }
        </p>
        {currentDestination === 'Paris' && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <p className="font-medium">✨ Featuring tours from Viator, GetYourGuide, Klook, Tiqets, Eating Europe, Context Travel, and more!</p>
          </div>
        )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                      <div className="font-medium text-sm">{location.name}</div>
                      <div className="text-xs text-gray-500">{location.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Search */}
              <div>
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
                  <p className="text-sm text-gray-600 mt-1">Sorted by rating (highest first)</p>
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
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 flex-1 mr-2">
                              {tour.name}
                            </h4>
                            <span className="text-lg font-bold text-green-600 flex-shrink-0">
                              ${tour.price}
                            </span>
                          </div>
                          
                          <p className="text-sm text-emerald-600 font-medium mb-2">{tour.company}</p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(tour.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {tour.rating} ({tour.reviews.toLocaleString()} reviews)
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
                            {tour.attractions.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                +{tour.attractions.length - 3} more
                              </span>
                            )}
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