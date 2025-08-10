/*
  # Create budget settings table

  1. New Tables
    - `budget_settings`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to auth.users)
      - `daily_limit` (numeric, daily spending limit)
      - `total_budget` (numeric, total trip budget)
      - `category_limits` (jsonb, category-specific limits)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `budget_settings` table
    - Add policies for authenticated users to manage their own budget settings
*/

CREATE TABLE IF NOT EXISTS budget_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_limit numeric(10,2) DEFAULT 0,
  total_budget numeric(10,2) DEFAULT 0,
  category_limits jsonb DEFAULT '{"food": 0, "transportation": 0, "activities": 0, "souvenirs": 0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own budget settings"
  ON budget_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own budget settings"
  ON budget_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own budget settings"
  ON budget_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own budget settings"
  ON budget_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_budget_settings_updated_at
  BEFORE UPDATE ON budget_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();