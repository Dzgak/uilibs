<<<<<<< HEAD
-- Add new columns to libraries table
ALTER TABLE libraries 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_mobile_friendly boolean DEFAULT false;

-- Create an index on tags for better performance when filtering
=======
-- Add new columns to libraries table
ALTER TABLE libraries 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_mobile_friendly boolean DEFAULT false;

-- Create an index on tags for better performance when filtering
>>>>>>> 26f5c4aaa43b5cb09fa17654e30dc706207c1aed
CREATE INDEX IF NOT EXISTS idx_libraries_tags ON libraries USING GIN (tags); 