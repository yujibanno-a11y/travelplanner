import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  owner_id: string;
  destination: string;
  days: number;
  itinerary_data: any[];
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  owner_id: string;
  itinerary_id?: string;
  category: 'food' | 'transportation' | 'activities' | 'souvenirs';
  amount: number;
  description: string;
  created_at: string;
}

export interface BudgetSettings {
  id: string;
  owner_id: string;
  daily_limit: number;
  total_budget: number;
  category_limits: {
    food: number;
    transportation: number;
    activities: number;
    souvenirs: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  owner_id: string;
  type: 'budget_exceeded' | 'category_limit' | 'daily_summary' | 'recommendation';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}