-- Add user ownership to libraries table
ALTER TABLE libraries 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create an index on user_id for better performance when filtering by user
CREATE INDEX IF NOT EXISTS idx_libraries_user_id ON libraries(user_id);

-- Add RLS (Row Level Security) policies for libraries
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all libraries (public read access)
CREATE POLICY "Users can view all libraries" ON libraries
  FOR SELECT USING (true);

-- Policy: Users can insert their own libraries
CREATE POLICY "Users can insert their own libraries" ON libraries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own libraries
CREATE POLICY "Users can update their own libraries" ON libraries
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own libraries
CREATE POLICY "Users can delete their own libraries" ON libraries
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Admins can do everything (insert, update, delete any library)
CREATE POLICY "Admins have full access" ON libraries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
