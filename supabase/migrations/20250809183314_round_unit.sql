/*
  # Create itinerary items table

  1. New Tables
    - `itinerary_items`
      - `id` (uuid, primary key)
      - `itinerary_id` (uuid, foreign key to itineraries table)
      - `day_number` (integer, which day of the trip)
      - `type` (text, type of activity: 'activity', 'attraction', 'tip')
      - `title` (text, name/title of the item)
      - `description` (text, detailed description)
      - `estimated_cost` (numeric, estimated cost per person)
      - `time_of_day` (text, morning/afternoon/evening)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `itinerary_items` table
    - Add policies for authenticated users to manage their own itinerary items
*/

CREATE TABLE IF NOT EXISTS itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id uuid NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  type text NOT NULL CHECK (type IN ('activity', 'attraction', 'tip')),
  title text NOT NULL,
  description text,
  estimated_cost numeric(10,2) DEFAULT 0,
  time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'all_day')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own itinerary items"
  ON itinerary_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_items.itinerary_id 
      AND itineraries.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own itinerary items"
  ON itinerary_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_items.itinerary_id 
      AND itineraries.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own itinerary items"
  ON itinerary_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_items.itinerary_id 
      AND itineraries.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own itinerary items"
  ON itinerary_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_items.itinerary_id 
      AND itineraries.owner_id = auth.uid()
    )
  );

CREATE TRIGGER update_itinerary_items_updated_at
  BEFORE UPDATE ON itinerary_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();