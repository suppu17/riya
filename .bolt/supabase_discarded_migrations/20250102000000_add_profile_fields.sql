-- Add additional profile fields for enhanced user profiles
-- This migration adds fields to support the profile page sample data

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"posts": 0, "followers": 0, "following": 0}';

-- Update the preferences column to include more detailed preferences
COMMENT ON COLUMN profiles.preferences IS 'User preferences including favoriteCategories, size, style, and other settings';
COMMENT ON COLUMN profiles.bio IS 'User biography/description';
COMMENT ON COLUMN profiles.location IS 'User location (city, country)';
COMMENT ON COLUMN profiles.join_date IS 'Date when user joined the platform';
COMMENT ON COLUMN profiles.membership_type IS 'Type of membership: standard, premium, etc.';
COMMENT ON COLUMN profiles.social_links IS 'Social media links and handles';
COMMENT ON COLUMN profiles.stats IS 'User statistics like posts count, followers, etc.';

-- Insert sample data for existing users or create a sample user
-- This will help demonstrate the profile functionality
INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url,
  bio,
  location,
  join_date,
  membership_type,
  preferences,
  social_links,
  stats,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'supriya@example.com',
  'Supriya Korukonda',
  'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/IMG_7514.JPG',
  'Hi! I''m passionate about fashion and technology. I love exploring new styles and creating unique looks using AI.',
  'New York, USA',
  '2023-01-15',
  'premium',
  '{
    "favoriteCategories": ["dresses", "tops", "accessories"],
    "size": "M",
    "style": ["elegant", "modern", "chic"]
  }',
  '{
    "instagram": "@supriya_style",
    "twitter": "@supriya_fashion"
  }',
  '{
    "posts": 24,
    "followers": 1250,
    "following": 180
  }',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  join_date = EXCLUDED.join_date,
  membership_type = EXCLUDED.membership_type,
  preferences = EXCLUDED.preferences,
  social_links = EXCLUDED.social_links,
  stats = EXCLUDED.stats,
  updated_at = NOW();

-- Update the updated_at trigger to handle the new fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists for the profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies to include new fields
-- Users can read their own profile with all fields
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);