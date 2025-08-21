-- Simplify RLS policies for easier debugging
-- This migration makes the policies more permissive for testing

-- Drop existing policies on pending_submissions
DROP POLICY IF EXISTS "Users can view their own pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Users can insert their own pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Users can update their own pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Users can delete their own pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Admins can view all pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Admins can update all pending submissions" ON pending_submissions;
DROP POLICY IF EXISTS "Admins can delete all pending submissions" ON pending_submissions;

-- Create simpler policies for testing
-- Allow all authenticated users to insert pending submissions
CREATE POLICY "Allow authenticated users to insert pending submissions" ON pending_submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to view their own pending submissions
CREATE POLICY "Allow users to view their own pending submissions" ON pending_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own pending submissions (only if status is pending)
CREATE POLICY "Allow users to update their own pending submissions" ON pending_submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Allow users to delete their own pending submissions (only if status is pending)
CREATE POLICY "Allow users to delete their own pending submissions" ON pending_submissions
  FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- Allow admins to view all pending submissions
CREATE POLICY "Allow admins to view all pending submissions" ON pending_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update all pending submissions
CREATE POLICY "Allow admins to update all pending submissions" ON pending_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to delete all pending submissions
CREATE POLICY "Allow admins to delete all pending submissions" ON pending_submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
