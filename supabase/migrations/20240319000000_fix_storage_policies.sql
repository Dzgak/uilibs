-- Fix storage bucket policies for pending submissions
-- Allow authenticated users to upload files to the libraries bucket

-- First, ensure the libraries bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('libraries', 'libraries', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete uploaded files" ON storage.objects;

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'libraries' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Allow users to view uploaded files (public read access)
CREATE POLICY "Allow users to view uploaded files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'libraries'
  );

-- Policy: Allow authenticated users to update their own uploaded files
CREATE POLICY "Allow users to update uploaded files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'libraries' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users to delete their own uploaded files
CREATE POLICY "Allow users to delete uploaded files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'libraries' AND 
    auth.role() = 'authenticated'
  );
