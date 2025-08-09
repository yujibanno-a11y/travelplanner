import { useState, useEffect } from 'react';
import { supabase, Expense, BudgetSettings, Notification, Itinerary } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
      } else {
        setExpenses(data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'owner_id' | 'created_at'>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, owner_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setExpenses(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (!error) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }

    return { error };
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return { expenses, loading, addExpense, deleteExpense, refetch: fetchExpenses };
};

export const useBudgetSettings = () => {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBudgetSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budget_settings')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching budget settings:', error);
      } else {
        setBudgetSettings(data);
      }
    } catch (error) {
      console.error('Error fetching budget settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetSettings = async (settings: Partial<BudgetSettings>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('budget_settings')
      .upsert([{ ...settings, owner_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setBudgetSettings(data);
    }

    return { data, error };
  };

  useEffect(() => {
    fetchBudgetSettings();
  }, [user]);

  return { budgetSettings, loading, updateBudgetSettings, refetch: fetchBudgetSettings };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'owner_id' | 'created_at'>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...notification, owner_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setNotifications(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const markAsRead = async (id: string) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('owner_id', user.id);

    if (!error) {
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    }

    return { error };
  };

  const deleteNotification = async (id: string) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (!error) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }

    return { error };
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return { 
    notifications, 
    loading, 
    addNotification, 
    markAsRead, 
    deleteNotification, 
    refetch: fetchNotifications 
  };
};

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItineraries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching itineraries:', error);
      } else {
        setItineraries(data || []);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItinerary = async (itinerary: Omit<Itinerary, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('itineraries')
      .insert([{ ...itinerary, owner_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setItineraries(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const updateItinerary = async (id: string, updates: Partial<Itinerary>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('itineraries')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (!error && data) {
      setItineraries(prev => 
        prev.map(itinerary => itinerary.id === id ? data : itinerary)
      );
    }

    return { data, error };
  };

  const deleteItinerary = async (id: string) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (!error) {
      setItineraries(prev => prev.filter(itinerary => itinerary.id !== id));
    }

    return { error };
  };

  useEffect(() => {
    fetchItineraries();
  }, [user]);

  return { 
    itineraries, 
    loading, 
    addItinerary, 
    updateItinerary, 
    deleteItinerary, 
    refetch: fetchItineraries 
  };
};