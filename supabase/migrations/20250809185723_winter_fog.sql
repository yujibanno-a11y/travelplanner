/*
  # Fix Profiles Table RLS Insert Policy

  1. Security Updates
    - Enable RLS on profiles table
    - Add INSERT policy for authenticated users to create their own profile
    - Ensure users can only insert profiles with their own user ID

  2. Policy Details
    - Allow authenticated users to INSERT their own profile data
    - Restrict INSERT operations to match auth.uid() = id
    - This resolves the "Database error saving new user" issue
*/

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to create their own profile" ON profiles;

-- Create INSERT policy for authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure other necessary policies exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);