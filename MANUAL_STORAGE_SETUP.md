# Manual Supabase Storage Setup

## 🚨 Quick Fix for Profile Image Upload Error

The automated setup couldn't execute policies directly, so you need to run these SQL commands manually in your Supabase Dashboard.

## Step 1: Go to Supabase SQL Editor

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **"New query"**

## Step 2: Create Storage Bucket (if not exists)

First, check if the `profile-images` bucket exists by going to **Storage** in your dashboard. If it doesn't exist:

1. Go to **Storage** → **"New bucket"**
2. Name: `profile-images`
3. **Make it Public**: ✅ Check this
4. File size limit: `10MB`
5. Allowed MIME types: `image/jpeg, image/png, image/webp`
6. Click **"Create bucket"**

## Step 3: Run These SQL Commands

Copy and paste this SQL into the SQL Editor and click **"Run"**:

```sql
-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- Create new policies for profile-images bucket
CREATE POLICY "Users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');
```

## Step 4: Test the Fix

1. **Refresh your app** at http://localhost:5174/
2. **Go to the profile page**
3. **Try uploading a profile image**
4. **Check the browser console** for any errors
5. **Verify in Storage** that the image appears in the `profile-images` bucket

## What These Policies Do

- **Upload Policy**: Users can only upload images to their own folder (`user_id/filename`)
- **Update Policy**: Users can only update their own images
- **Delete Policy**: Users can only delete their own images  
- **Read Policy**: Anyone can view profile images (public access)

## Expected Result

After running the SQL:
- ✅ Profile image uploads should work without "Bucket not found" errors
- ✅ Images will be stored in Supabase Storage instead of localStorage
- ✅ Old images will be automatically cleaned up when new ones are uploaded
- ✅ Images will be accessible via public URLs

## Troubleshooting

If you still get errors:

1. **Check Authentication**: Make sure you're logged in when uploading
2. **Verify Bucket**: Ensure the `profile-images` bucket exists and is public
3. **Check Policies**: Go to Storage → Policies and verify the 4 policies are listed
4. **Browser Console**: Look for detailed error messages during upload

## Success Indicators

✅ **SQL runs without errors**  
✅ **4 policies appear in Storage → Policies**  
✅ **Profile image upload works in the app**  
✅ **Images appear in Storage → profile-images bucket**  
✅ **No more localStorage quota errors**  

Once you complete these steps, your profile image storage will be fully migrated to Supabase Storage!