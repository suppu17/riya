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
} from "lucide-react";
import { motion } from "motion/react";
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
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
            <img
              src={post.avatar}
              alt={post.username}
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
            <div>
              <p className="text-white font-semibold text-sm">{post.username}</p>
              <p className="text-white/70 text-xs">{post.modelUsed}</p>
            </div>
          </div>
          <button className="text-white/80 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Caption */}
          <div className="text-white">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">{post.username}</span> {post.caption}
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
    try {
      const result = await updateProfile({ bio: bioText });
      if (result.success) {
        setIsEditingBio(false);
        // Refresh profile to get updated data
        await refreshProfile();
      } else {
        console.error('Failed to update bio:', result.error);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
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
      // Create a smaller, optimized version instead of 8K to avoid storage quota issues
      const optimizedImage = await enhanceImageOptimized(tempImage);
      
      // Upload to Supabase Storage
      const result = await uploadProfileImageFromBase64(optimizedImage);
      
      if (result.success && result.url) {
        setProfilePicture(result.url);
        setShowCropModal(false);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback: try uploading original cropped image
      try {
        const result = await uploadProfileImageFromBase64(tempImage);
        if (result.success && result.url) {
          setProfilePicture(result.url);
        }
      } catch (fallbackError) {
        console.error('Fallback upload failed:', fallbackError);
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
      setProfilePicture(profile.avatar_url);
    }
  }, [profile]);

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
        caption: `Loving this ${image.productName}! Generated with AI fashion technology. What do you think? ✨ #AIFashion #Style #${image.modelUsed.replace(/\s+/g, '')}`
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
        className="grid grid-cols-12 gap-6 p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left Sidebar */}
        <motion.div
          className="col-span-3 space-y-4"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Profile Header */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 h-fit overflow-hidden"
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
              className="p-6"
            >

              <div className="mb-6 text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile?.full_name || user?.name || 'User'}
                </h2>
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {profile?.membership_type === 'premium' ? 'Premium Member' : 'Member'}
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
                      <div className="space-y-3">
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
                              className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    {profile?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/40" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <span>Joined {profile?.join_date ? new Date(profile.join_date).getFullYear() : new Date(user?.createdAt || '').getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                My AI Fashion Reels
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