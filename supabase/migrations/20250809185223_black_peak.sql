/*
  # Update User Profile Storage

  1. Database Functions
    - Create function to handle new user profile creation
    - Automatically extract email and full_name from auth.users
    
  2. Triggers
    - Trigger on auth.users insert to create profile
    - Ensures profile is created with correct data
    
  3. Security
    - Maintain existing RLS policies
    - Ensure data consistency
*/

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing profiles table to ensure email is properly set
UPDATE public.profiles 
SET email = auth.users.email,
    full_name = COALESCE(auth.users.raw_user_meta_data->>'full_name', profiles.full_name, '')
FROM auth.users 
WHERE profiles.id = auth.users.id 
AND (profiles.email IS NULL OR profiles.email = '' OR profiles.full_name IS NULL);