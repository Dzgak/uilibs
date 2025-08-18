-- Create pending_submissions table for waitlist system
CREATE TABLE IF NOT EXISTS pending_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  about TEXT,
  author TEXT NOT NULL,
  author_bio TEXT,
  website TEXT,
  github TEXT,
  preview TEXT,
  gallery TEXT[],
  tags TEXT[] DEFAULT '{}',
  is_paid BOOLEAN DEFAULT false,
  is_mobile_friendly BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pending_submissions_user_id ON pending_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_submissions_status ON pending_submissions(status);
CREATE INDEX IF NOT EXISTS idx_pending_submissions_created_at ON pending_submissions(created_at);

-- Enable RLS on pending_submissions table
ALTER TABLE pending_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pending submissions
CREATE POLICY "Users can view their own pending submissions" ON pending_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own pending submissions
CREATE POLICY "Users can insert their own pending submissions" ON pending_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending submissions (only if status is pending)
CREATE POLICY "Users can update their own pending submissions" ON pending_submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Policy: Users can delete their own pending submissions (only if status is pending)
CREATE POLICY "Users can delete their own pending submissions" ON pending_submissions
  FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- Policy: Admins can view all pending submissions
CREATE POLICY "Admins can view all pending submissions" ON pending_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update all pending submissions (for moderation)
CREATE POLICY "Admins can update all pending submissions" ON pending_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete all pending submissions
CREATE POLICY "Admins can delete all pending submissions" ON pending_submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pending_submissions_updated_at 
    BEFORE UPDATE ON pending_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
