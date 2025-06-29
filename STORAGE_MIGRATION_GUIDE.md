# Profile Image Storage Migration Guide

## Overview

This guide explains the migration from localStorage-based profile image storage to Supabase Storage, which resolves the "QuotaExceededError" and provides better scalability.

## What Changed

### Before (localStorage)
- Profile images stored as base64 strings in browser localStorage
- Limited to ~5-10MB total storage per domain
- Images lost when clearing browser data
- Large 8K images caused quota exceeded errors

### After (Supabase Storage)
- Profile images stored in Supabase Storage bucket
- Virtually unlimited storage
- Images persist across devices and browsers
- Optimized image processing (1024x1024 max)
- Automatic cleanup of old images

## Setup Instructions

### 1. Manual Supabase Storage Setup

Since the automated migration had RLS policy issues, follow these manual steps:

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to Storage section

2. **Create Storage Bucket**
   - Click "New bucket"
   - Name: `profile-images`
   - Make it **Public**
   - Set file size limit: 10MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

3. **Set Up RLS Policies**
   
   Go to Storage > Policies and add these policies for the `profile-images` bucket:

   **Policy 1: Allow users to upload their own images**
   ```sql
   CREATE POLICY "Users can upload profile images" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'profile-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 2: Allow users to update their own images**
   ```sql
   CREATE POLICY "Users can update profile images" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'profile-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 3: Allow users to delete their own images**
   ```sql
   CREATE POLICY "Users can delete profile images" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'profile-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 4: Allow public read access**
   ```sql
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'profile-images');
   ```

### 2. Code Changes Made

#### New Files Created:
- `src/lib/storage.ts` - Storage service for handling uploads
- `apply-storage-migration.js` - Migration script
- `supabase/migrations/20250102000001_setup_profile_storage.sql` - SQL migration

#### Modified Files:
- `src/contexts/AuthContext.tsx` - Added upload functions
- `src/components/pages/ProfilePage.tsx` - Updated image handling

#### Key Features:
- **Image Compression**: Images are optimized to 1024x1024 max resolution
- **Automatic Cleanup**: Old profile images are deleted when new ones are uploaded
- **Progress Indicators**: UI shows upload and processing status
- **Error Handling**: Graceful fallbacks if upload fails
- **Security**: RLS policies ensure users can only access their own images

### 3. Testing the Migration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test profile image upload**:
   - Go to the profile page
   - Click the camera icon to upload a new image
   - Crop and enhance the image
   - Verify it uploads to Supabase Storage

3. **Verify in Supabase Dashboard**:
   - Go to Storage > profile-images bucket
   - Check that uploaded images appear
   - Verify the file structure: `{user_id}/profile-{timestamp}.jpg`

### 4. Migration Benefits

✅ **Resolved Issues**:
- No more "QuotaExceededError"
- Images persist across browsers/devices
- Better performance with optimized images

✅ **New Features**:
- Automatic image compression
- Old image cleanup
- Upload progress indicators
- Better error handling

✅ **Scalability**:
- Virtually unlimited storage
- CDN-backed image delivery
- Secure access controls

### 5. Troubleshooting

**If uploads fail**:
1. Check Supabase Storage bucket exists and is public
2. Verify RLS policies are correctly set up
3. Ensure user is authenticated
4. Check browser console for detailed error messages

**If images don't display**:
1. Verify the bucket is public
2. Check the image URL format
3. Ensure the profile.avatar_url is updated in the database

**If old localStorage images are still showing**:
1. Clear browser localStorage
2. Refresh the profile data
3. Upload a new image to override

### 6. Environment Variables

Ensure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 7. Next Steps

- [ ] Test profile image upload functionality
- [ ] Verify images are stored in Supabase Storage
- [ ] Check that old images are automatically cleaned up
- [ ] Test on different devices/browsers
- [ ] Monitor storage usage in Supabase dashboard

## Technical Details

### Storage Service (`src/lib/storage.ts`)
- Handles file validation and compression
- Manages upload to Supabase Storage
- Provides base64 to blob conversion
- Implements automatic cleanup

### Auth Context Updates
- Added `uploadProfileImage()` function
- Added `uploadProfileImageFromBase64()` function
- Integrated with profile update workflow

### Profile Page Updates
- Removed localStorage dependencies
- Added upload progress indicators
- Optimized image enhancement (1024x1024 instead of 8K)
- Improved error handling and user feedback

The migration is now complete and ready for testing!