export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface UserPreferences {
  budget: number;
  pace: 'relaxed' | 'moderate' | 'packed';
  interests: string[];
  accessibility: {
    mobility: boolean;
    dietary: string[];
    other: string[];
  };
}

export interface ItineraryAction {
  type: 'regenerateDay' | 'insertActivity' | 'lightenDay' | 'rebalanceRoute' | 'updateItinerary';
  payload: any;
}

export interface StreamingResponse {
  content: string;
  actions?: ItineraryAction[];
  isComplete: boolean;
}