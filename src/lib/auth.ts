import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string) => {
  console.log('Attempting signup with:', { email, fullName });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) {
    console.error('Signup error:', error);
    throw error;
  }

  console.log('Signup successful:', data);
  return data;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

// Helper function to ensure user profile exists and is up to date
const ensureUserProfile = async (userId: string, email: string, fullName: string) => {
  try {
    // Use upsert to handle both insert and update cases
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        full_name: fullName,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error upserting profile:', error);
    }
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
  }
};
// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name,
  };
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
};

// Update user profile
export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }
};