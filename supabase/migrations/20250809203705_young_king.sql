/*
  # Remove avatar_url field from profiles table

  1. Schema Changes
    - Drop avatar_url column from profiles table
    - This removes the field completely from the database

  2. Security
    - No RLS policy changes needed as we're just removing a column
    - Existing policies remain intact
*/

-- Remove avatar_url column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_url;