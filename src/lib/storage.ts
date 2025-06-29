import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class StorageService {
  private readonly BUCKET_NAME = 'profile-images';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Upload profile image to Supabase Storage
   */
  async uploadProfileImage(userId: string, file: File): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        return { success: false, error: 'Failed to upload image' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  /**
   * Upload base64 image data to Supabase Storage
   */
  async uploadBase64Image(userId: string, base64Data: string, filename?: string): Promise<UploadResult> {
    try {
      // Convert base64 to blob
      const blob = this.base64ToBlob(base64Data);
      if (!blob) {
        return { success: false, error: 'Invalid image data' };
      }

      // Create file from blob
      const file = new File([blob], filename || 'profile-image.jpg', { type: blob.type });
      
      return await this.uploadProfileImage(userId, file);
    } catch (error) {
      console.error('Base64 upload error:', error);
      return { success: false, error: 'Failed to process image' };
    }
  }

  /**
   * Delete old profile image
   */
  async deleteProfileImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === this.BUCKET_NAME);
      
      if (bucketIndex === -1 || bucketIndex === urlParts.length - 1) {
        return false; // Not a valid storage URL
      }

      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File too large. Maximum size is 10MB.' };
    }

    return { valid: true };
  }

  /**
   * Convert base64 to blob
   */
  private base64ToBlob(base64Data: string): Blob | null {
    try {
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Convert to binary
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      
      // Determine MIME type from base64 data
      let mimeType = 'image/jpeg'; // default
      if (base64Data.startsWith('data:image/png')) {
        mimeType = 'image/png';
      } else if (base64Data.startsWith('data:image/webp')) {
        mimeType = 'image/webp';
      }
      
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error('Base64 conversion error:', error);
      return null;
    }
  }

  /**
   * Compress image before upload
   */
  async compressImage(file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // fallback to original
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const storageService = new StorageService();