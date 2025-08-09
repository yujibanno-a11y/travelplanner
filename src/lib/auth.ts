import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
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
    throw error;
  }

  // If user is created successfully, ensure profile is created
  if (data.user) {
    await ensureUserProfile(data.user.id, email, fullName);
  }

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

  // Ensure profile exists and is up to date after login
  if (data.user) {
    const fullName = data.user.user_metadata?.full_name || '';
    await ensureUserProfile(data.user.id, data.user.email || '', fullName);
  }

  return data;
};

// Helper function to ensure user profile exists and is up to date
const ensureUserProfile = async (userId: string, email: string, fullName: string) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking profile:', fetchError);
      return;
    }

    if (!existingProfile) {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          full_name: fullName
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
    } else {
      // Update existing profile if data has changed
      const needsUpdate = 
        existingProfile.email !== email || 
        existingProfile.full_name !== fullName;

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            email: email,
            full_name: fullName,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
      }
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