import { useState, useCallback } from 'react';

interface ItineraryState {
  itinerary: any;
  timestamp: number;
}

export const useItineraryHistory = (initialItinerary: any) => {
  const [history, setHistory] = useState<ItineraryState[]>([
    { itinerary: initialItinerary, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((newItinerary: any) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ itinerary: newItinerary, timestamp: Date.now() });
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].itinerary;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].itinerary;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentItinerary = history[currentIndex]?.itinerary;

  return {
    currentItinerary,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};