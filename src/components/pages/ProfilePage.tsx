import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Settings,
  CreditCard,
  MapPin,
  Calendar,
  Star,
  PlusSquare,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  MessageCircle,
  Share,
  Bell,
  Shield,
  LogOut,
  Camera,
  Upload,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  Move,
  ShoppingBag,
  Crown,
  Edit3,
  Compass,
  TrendingUp,
  Users,
  Award,
  Download,
  Link,
  Trash2,
  Instagram,
  Twitter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import TopNavigationBar from "../home/TopNavigationBar";
import { demoGeneratedImages, GeneratedImageData } from "../../data/demo";

interface ReelPost extends GeneratedImageData {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  username: string;
  avatar: string;
  caption: string;
}

const ReelCard: React.FC<{ post: ReelPost; isActive: boolean }> = ({ post, isActive }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(post.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.productName}-${post.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
    setShowDropdown(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.productName,
          text: post.caption,
          url: post.url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(post.url);
      alert('Link copied to clipboard!');
    }
    setShowDropdown(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(post.url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      // TODO: Implement delete functionality
      console.log('Delete image:', post.id);
    }
    setShowDropdown(false);
  };

  return (
    <motion.div
      className="relative bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden w-full h-full group cursor-pointer"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main Image */}
      <div className="absolute inset-0">
        <img
          src={post.url}
          alt={post.productName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Profile picture removed */}
            <div>
              {/* Username and model text removed */}
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Three dots clicked, current state:', showDropdown);
                setShowDropdown(!showDropdown);
              }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl py-2 min-w-[160px] z-[9999] border border-gray-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Download clicked');
                    handleDownload();
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Share clicked');
                    handleShare();
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                >
                  <Share className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Copy Link clicked');
                    handleCopyLink();
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                >
                  <Link className="w-4 h-4" />
                  Copy Link
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Delete clicked');
                    handleDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Caption */}
          <div className="text-white">
            <p className="text-sm leading-relaxed">
              {post.caption}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>
              <button className="flex items-center gap-2 text-white hover:text-blue-400">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
            </div>
            <div className="text-white/60 text-xs">
              #{post.productName.replace(/\s+/g, '').toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const ProfilePage: React.FC = () => {
  const {} = useShopping();
  const { user, profile, uploadProfileImageFromBase64, updateProfile, refreshProfile } = useAuth();
  const [reelPosts, setReelPosts] = useState<ReelPost[]>([]);
  const [activeReel, setActiveReel] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string>(profile?.avatar_url || 'https://i.pravatar.cc/150?u=supriya');
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profile?.bio || 'Welcome to my fashion profile! I love exploring new styles and creating unique looks.');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);

  // Handle scroll detection for active reel
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const currentIndex = Math.round(scrollTop / containerHeight);
        setActiveReel(currentIndex);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [reelPosts]);

  // Update bioText when profile changes
  useEffect(() => {
    if (profile?.bio !== undefined) {
      setBioText(profile.bio);
    }
  }, [profile?.bio]);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // For direct upload without cropping, use this:
        // const result = await uploadProfileImage(file);
        // if (result.success && result.url) {
        //   setProfilePicture(result.url);
        // }
        
        // For cropping workflow, read as data URL first
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setTempImage(result);
          setImagePosition({ x: 0, y: 0 });
          setImageScale(1);
          setShowCropModal(true);
          setIsUploading(false);
          // Clear the input value to allow re-uploading the same file
          if (event.target) {
            event.target.value = '';
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error preparing image:', error);
        setIsUploading(false);
      }
    }
  };

  // Handle image dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleZoomIn = () => {
    setImageScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setImageScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // Reset image position and scale
  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
  };

  // Handle bio update
  const handleBioUpdate = async () => {
    console.log('🔄 Starting bio update...', { bioText, user: !!user, profile: !!profile });
    
    if (!user) {
      console.error('❌ No user found - cannot update bio');
      alert('Please log in to save changes');
      return;
    }
    
    setIsSavingBio(true);
    
    try {
      console.log('📝 Updating profile with bio:', bioText);
      const result = await updateProfile({ bio: bioText });
      console.log('📋 Update result:', result);
      
      if (result.success) {
        console.log('✅ Bio updated successfully!');
        setIsEditingBio(false);
        // Refresh profile to get updated data
        await refreshProfile();
        console.log('🔄 Profile refreshed');
        alert('Bio updated successfully!');
      } else {
        console.error('❌ Failed to update bio:', result.error);
        alert(`Failed to update bio: ${result.error}`);
      }
    } catch (error) {
      console.error('💥 Error updating bio:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsSavingBio(false);
    }
  };

  // Cancel bio edit
  const cancelBioEdit = () => {
    setBioText(profile?.bio || 'Welcome to my fashion profile! I love exploring new styles and creating unique looks.');
    setIsEditingBio(false);
  };

  // Enhance image with optimized dimensions (1024x1024 max)
  const enhanceImageOptimized = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set optimized dimensions (max 1024x1024 for profile pictures)
        const maxSize = 1024;
        const targetWidth = maxSize;
        const targetHeight = maxSize;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        if (ctx) {
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Fill canvas with white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // The crop area dimensions (from the modal)
          const cropAreaHeight = 300;
          const cropAreaAspect = 1; // Square aspect ratio for profile pictures
          const cropAreaWidth = 300;
          
          // Calculate how the image should be scaled to fit the crop area initially
          const imgAspect = img.width / img.height;
          let baseFitWidth, baseFitHeight;
          
          if (imgAspect > cropAreaAspect) {
            // Image is wider - fit to height of crop area
            baseFitHeight = cropAreaHeight;
            baseFitWidth = cropAreaHeight * imgAspect;
          } else {
            // Image is taller - fit to width of crop area
            baseFitWidth = cropAreaWidth;
            baseFitHeight = cropAreaWidth / imgAspect;
          }
          
          // Apply user's scale from the crop modal
          const scaledFitWidth = baseFitWidth * imageScale;
          const scaledFitHeight = baseFitHeight * imageScale;
          
          // Scale to canvas size
          const scaleToCanvas = targetWidth / cropAreaWidth;
          const finalWidth = scaledFitWidth * scaleToCanvas;
          const finalHeight = scaledFitHeight * scaleToCanvas;
          
          // Apply user's position from crop modal, scaled to canvas
          const finalX = imagePosition.x * scaleToCanvas;
          const finalY = imagePosition.y * scaleToCanvas;
          
          // Draw the optimized image
          ctx.drawImage(
            img,
            finalX,
            finalY,
            finalWidth,
            finalHeight
          );
          
          // Convert to optimized JPEG (0.85 quality for smaller file size)
          const optimizedImage = canvas.toDataURL('image/jpeg', 0.85);
          resolve(optimizedImage);
        } else {
          resolve(imageSrc);
        }
      };
      img.src = imageSrc;
    });
  };

  // Apply cropped image with enhancement and upload to Supabase
  const applyCroppedImage = async () => {
    setIsEnhancing(true);
    try {
      console.log('🔄 Starting image upload process...');
      console.log('📊 User:', user?.id);
      console.log('📊 Current profile:', profile);
      
      // Create a smaller, optimized version instead of 8K to avoid storage quota issues
      console.log('🖼️ Enhancing image...');
      const optimizedImage = await enhanceImageOptimized(tempImage);
      console.log('✅ Image enhanced, size:', optimizedImage.length, 'characters');
      
      // Upload to Supabase Storage
      console.log('📤 Uploading to Supabase...');
      const result = await uploadProfileImageFromBase64(optimizedImage);
      console.log('📤 Upload result:', result);
      
      if (result.success && result.url) {
        console.log('✅ Upload successful, URL:', result.url);
        console.log('🔄 Refreshing profile...');
        // Force refresh profile to ensure state consistency
        await refreshProfile();
        console.log('🔄 Profile refreshed, updating local state...');
        // Set local state after profile refresh to ensure consistency
        setProfilePicture(result.url);
        setShowCropModal(false);
        console.log('✅ Profile picture updated successfully!');
        
        // Show success message
        alert('Profile picture updated successfully!');
      } else {
        console.error('❌ Upload failed:', result.error);
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Error processing image:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback: try uploading original cropped image
      try {
        console.log('🔄 Trying fallback upload...');
        const result = await uploadProfileImageFromBase64(tempImage);
        if (result.success && result.url) {
          await refreshProfile();
          setProfilePicture(result.url);
          console.log('✅ Fallback upload successful!');
          alert('Profile picture updated successfully (fallback)!');
        } else {
          console.error('❌ Fallback upload also failed:', result.error);
          alert(`Fallback upload failed: ${result.error || 'Unknown error'}`);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback upload failed:', fallbackError);
        alert(`Fallback error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
      }
      setShowCropModal(false);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Cancel cropping
  const cancelCropping = () => {
    setShowCropModal(false);
    setTempImage('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };



  // Load profile picture from Supabase profile data
  useEffect(() => {
    if (profile?.avatar_url) {
      console.log('🔄 Profile avatar_url changed:', profile.avatar_url);
      setProfilePicture(profile.avatar_url);
      console.log('✅ Local profilePicture state updated');
    }
  }, [profile?.avatar_url]);

  // Force re-render when profile updates
  useEffect(() => {
    if (profile?.avatar_url && profile.avatar_url !== profilePicture) {
      setProfilePicture(profile.avatar_url);
    }
  }, [profile?.avatar_url]);

  // Load data from demo.ts and localStorage
  useEffect(() => {
    const loadReelData = () => {
      // Get latest data from localStorage
      const storedData = localStorage.getItem('generatedImages');
      let latestImages: GeneratedImageData[] = [];
      
      if (storedData) {
        try {
          latestImages = JSON.parse(storedData);
        } catch (error) {
          console.error('Error parsing stored images:', error);
        }
      }

      // Combine demo data with localStorage data
      const allImages = [...latestImages, ...demoGeneratedImages];
      
      // Transform to reel posts
      const transformedPosts: ReelPost[] = allImages.map((image, index) => ({
        ...image,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 20) + 2,
        isLiked: Math.random() > 0.7,
        username: profile?.full_name || user?.name || 'User',
        avatar: profilePicture,
        caption: `Loving this ${image.productName}! Generated with AI fashion technology. What do you think? ✨ #AIFashion #Style`
      }));

      setReelPosts(transformedPosts);
    };

    loadReelData();

    // Note: No longer using localStorage for images
  }, [profilePicture]);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TopNavigationBar />
      </motion.div>

      <motion.div
        className="grid grid-cols-12 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left Sidebar */}
        <motion.div
          className="col-span-3 space-y-8"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Profile Header */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Profile Banner Image Section */}
            <motion.div
              className="relative h-48 overflow-hidden group cursor-pointer"
              onClick={triggerFileInput}
            >
              {/* Profile Image as Banner */}
              <div className="absolute inset-0">
                <img
                  src={profilePicture}
                  alt="Profile Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              
              {/* Upload Button Overlay */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  disabled={isUploading || isEnhancing}
                  className={`bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-110 ${
                    isUploading || isEnhancing ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : isEnhancing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                disabled={isUploading || isEnhancing}
              />
            </motion.div>

            {/* Profile Info Section */}
            <motion.div
              className="p-4 pb-6"
            >

              <div className="mb-2 text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile?.full_name || user?.name || 'User'}
                </h2>
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {profile?.membership_type === 'premium' ? 'Premium Member' : 'Premium member'}
                </p>

                <div className="text-white/60 text-sm mt-4">
                  <div className="relative group">
                    {!isEditingBio ? (
                      <>
                        <p className="leading-relaxed pr-8">
                          {profile?.bio || 'Welcome to my fashion profile! I love exploring new styles and creating unique looks.'}
                        </p>
                        <button
                          onClick={() => setIsEditingBio(true)}
                          className="absolute top-0 right-0 p-1 text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Edit bio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <textarea
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/40 transition-colors"
                          placeholder="Tell us about yourself..."
                          rows={3}
                          maxLength={200}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40">
                            {bioText.length}/200 characters
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={cancelBioEdit}
                              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleBioUpdate}
                              disabled={isSavingBio}
                              className={`px-3 py-1 text-xs text-white rounded-md transition-colors ${
                                isSavingBio 
                                  ? 'bg-blue-400 cursor-not-allowed' 
                                  : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            >
                              {isSavingBio ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-4 mb-3">
                    {profile?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/40" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <span>Joined June 16th, 2025</span>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="mt-2">
                    <p className="text-sm text-white/60 mb-2">Connect with me</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => window.open('https://instagram.com', '_blank')}
                        className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:scale-110 transition-transform duration-200"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-white" />
                      </button>
                      
                      <button 
                        onClick={() => window.open('https://twitter.com', '_blank')}
                        className="p-2 bg-black rounded-lg hover:scale-110 transition-transform duration-200"
                        title="Twitter/X"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </button>
                      
                      <button 
                        onClick={() => window.open('https://tiktok.com', '_blank')}
                        className="p-2 bg-black rounded-lg hover:scale-110 transition-transform duration-200"
                        title="TikTok"
                      >
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </button>
                      
                      <button 
                             onClick={() => window.open('https://snapchat.com', '_blank')}
                             className="p-2 bg-yellow-400 rounded-lg hover:scale-110 transition-transform duration-200"
                             title="Snapchat"
                           >
                             <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                               <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c.64.16 1.31.26 2 .26s1.36-.1 2-.26V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-2 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                               <path d="M7 19c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z"/>
                             </svg>
                           </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Explore Section */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-white/80 text-lg font-semibold mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Explore
            </h3>
            
            <div className="space-y-1">
               {[
                  {
                    icon: Compass,
                    label: "Discover",
                    desc: "Find new styles",
                    color: "from-green-500 to-teal-500"
                  },
                  {
                    icon: Users,
                    label: "Community",
                    desc: "Connect with others",
                    color: "from-blue-500 to-purple-500"
                  },
                  {
                    icon: TrendingUp,
                    label: "Trending",
                    desc: "What's hot now",
                    color: "from-orange-500 to-red-500"
                  }
                ].map((item) => (
                 <motion.button
                   key={item.label}
                   className="w-full flex items-center gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <item.icon className="w-5 h-5 text-white" />
                   </div>
                   <div className="text-left">
                     <p className="font-semibold text-white/90 text-sm">
                       {item.label}
                     </p>
                     <p className="text-xs text-white/60">{item.desc}</p>
                   </div>
                 </motion.button>
               ))}
             </div>
          </motion.div>
        </motion.div>

        {/* Main Content - Reels Feed */}
        <motion.div
          className="col-span-6"
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full"
          >
            <motion.div
              className="flex items-center justify-between mb-6"
            >
              <h3 className="text-white/80 text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5" />
                My AI SnapStyler Feed
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span>{reelPosts.length} posts</span>
              </div>
            </motion.div>

            {/* Reels Vertical Scroll */}
            <div 
              ref={scrollContainerRef}
              className="h-[70vh] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
            >
              {reelPosts.length > 0 ? (
                <div className="space-y-0">
                  {reelPosts.map((post, index) => (
                    <div key={post.id} className="h-[70vh] snap-start">
                      <ReelCard
                        post={post}
                        isActive={index === activeReel}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-white/5 rounded-full p-8 mb-4">
                    <Play className="w-12 h-12 text-white/40" />
                  </div>
                  <h4 className="text-white/80 text-lg font-semibold mb-2">
                    No AI Fashion Reels Yet
                  </h4>
                  <p className="text-white/60 text-sm max-w-sm">
                    Start creating AI-generated fashion content to see your reels here!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          className="col-span-3 space-y-6"
        >
          {/* Account Settings */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white/80 text-lg font-semibold mb-4">
              Account Settings
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: ShoppingBag,
                  label: "Cart Items",
                  desc: "View your cart items",
                },
                {
                  icon: MapPin,
                  label: "Addresses",
                  desc: "Your delivery addresses",
                },
                {
                  icon: CreditCard,
                  label: "Payment Methods",
                  desc: "Manage your payment options",
                },
                {
                  icon: Crown,
                  label: "Confirm & Checkout",
                  desc: "Complete your purchase",
                },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  className="w-full flex items-center gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white/90 text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Shopping Journey */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white/80 text-lg font-semibold mb-4">
              Shopping Journey
            </h3>
            
            {/* Shopping Journey Options */}
            <div className="space-y-3 mb-6">
              {[
                {
                  icon: ShoppingBag,
                  label: "My Orders",
                  desc: "Track orders",
                },
                {
                  icon: Heart,
                  label: "Wishlist",
                  desc: "Saved items",
                },
                {
                  icon: Crown,
                  label: "Membership",
                  desc: "Benefits",
                },
              ].map((option) => (
                <motion.button
                  key={option.label}
                  className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 w-full"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <option.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white/90 text-sm">
                      {option.label}
                    </p>
                    <p className="text-xs text-white/60">{option.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image Crop Modal */}
      {showCropModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Adjust Your Profile Image</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    8K Quality Enhancement
                  </div>
                  <span className="text-white/60 text-xs">7680×4320 resolution</span>
                </div>
              </div>
              <button
                onClick={cancelCropping}
                className="text-white/60 hover:text-white transition-colors"
                disabled={isEnhancing}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative bg-black/20 rounded-xl overflow-hidden mb-6" style={{ height: '300px' }}>
              <div
                className="absolute inset-0 cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={cropImageRef}
                  src={tempImage}
                  alt="Crop preview"
                  className="absolute transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    transformOrigin: 'center',
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover',
                    userSelect: 'none',
                    pointerEvents: isDragging ? 'none' : 'auto'
                  }}
                  draggable={false}
                />
              </div>
              
              {/* Crop Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-lg" />
                <div className="absolute top-2 left-2 text-white/60 text-xs flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Drag to position
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleZoomOut}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white/60 text-sm min-w-[60px] text-center">
                  {Math.round(imageScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={resetImagePosition}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Reset Position
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelCropping}
                disabled={isEnhancing}
                className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={applyCroppedImage}
                disabled={isEnhancing}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-400 disabled:to-pink-400 text-white py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isEnhancing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enhancing to 8K...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Apply 8K Enhancement
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}


    </motion.div>
  );
};

export default ProfilePage;