-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for profile images bucket
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Create function to clean up old profile images when new ones are uploaded
CREATE OR REPLACE FUNCTION cleanup_old_profile_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old profile images when avatar_url is updated
  IF OLD.avatar_url IS NOT NULL 
     AND NEW.avatar_url IS NOT NULL 
     AND OLD.avatar_url != NEW.avatar_url 
     AND OLD.avatar_url LIKE '%/storage/v1/object/public/profile-images/%' THEN
    
    -- Extract the file path from the old URL
    DECLARE
      old_file_path TEXT;
    BEGIN
      old_file_path := substring(OLD.avatar_url from '/profile-images/(.+)');
      
      -- Delete the old file from storage
      IF old_file_path IS NOT NULL THEN
        DELETE FROM storage.objects 
        WHERE bucket_id = 'profile-images' 
        AND name = old_file_path;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically clean up old profile images
DROP TRIGGER IF EXISTS cleanup_profile_images_trigger ON profiles;
CREATE TRIGGER cleanup_profile_images_trigger
  AFTER UPDATE OF avatar_url ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_profile_images();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;