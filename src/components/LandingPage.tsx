import React, { useState, useEffect } from "react";
import { Play, ArrowRight, LogIn, User } from "lucide-react";
import WallpaperSettings from "./WallpaperSettings";
import AuthModal from "./auth/AuthModal";
import UserProfile from "./UserProfile";
import { useWallpaper } from "../contexts/WallpaperContext";
import { useAuth } from "../contexts/AuthContext";

interface LandingPageProps {
  onComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onComplete }) => {
  const { currentWallpaper } = useWallpaper();
  const { user, isAuthenticated } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Animate content in after component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Redirect to dashboard when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Small delay to show the login success state
      const redirectTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, user, onComplete]);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // The useEffect above will handle the redirect
  };

  const handleEnterExperience = () => {
    if (isAuthenticated) {
      onComplete();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-pink-400/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Main Glass Container */}
      <div
        className={`relative w-[95vw] h-[90vh] max-w-7xl transition-all duration-1000 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Glass Morphism Container */}
        <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
            <div className="text-2xl font-light text-white tracking-wider">
              riya
            </div>
            <div className="flex items-center gap-6">
              <button className="text-white/80 hover:text-white transition-colors text-sm">
                + menu
              </button>
              
              {/* Authentication Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  {isAuthenticated ? (
                    <>
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-white text-sm font-medium">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                      <span className="text-white/80 group-hover:text-white text-sm font-medium transition-colors">
                        Sign In
                      </span>
                    </>
                  )}
                </button>
                
                <div className="text-6xl font-light text-white/60">01</div>
              </div>
            </div>
          </div>

          {/* Success Message for Logged In Users */}
          {isAuthenticated && user && (
            <div className="absolute top-24 right-8 z-20">
              <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl px-4 py-2">
                <p className="text-green-300 text-sm font-medium">
                  Welcome back, {user.name?.split(' ')[0]}! Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="absolute inset-0 p-8 pt-24">
            <div className="grid grid-cols-12 gap-8 h-full">
              {/* Left Section - Video Preview */}
              <div className="col-span-4 flex flex-col justify-center">
                <div className="relative">
                  {/* Decorative Circles */}
                  <div className="absolute -top-12 -left-8 flex gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm" />
                    <div className="w-8 h-8 bg-white/15 rounded-full backdrop-blur-sm" />
                    <div className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm" />
                    <div className="w-8 h-8 bg-white/5 rounded-full backdrop-blur-sm" />
                  </div>

                  {/* Video Container */}
                  <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/20 aspect-[4/5] overflow-hidden group cursor-pointer hover:bg-white/20 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
                    
                    {/* Model Image */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src="https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_1.png"
                        alt="AI Fashion Model"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full animate-pulse" />
                    <div className="absolute bottom-6 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000" />
                  </div>
                </div>
              </div>

              {/* Center Section - Main Content */}
              <div className="col-span-5 flex flex-col justify-center items-center text-center">
                {/* Large R Logo */}
                <div className="relative mb-8">
                  <div className="text-[12rem] font-light text-white/90 leading-none select-none">
                    R
                  </div>
                  <div className="absolute inset-0 text-[12rem] font-light text-white/20 leading-none select-none transform translate-x-2 translate-y-2">
                    R
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-2 mb-8">
                  <h1 className="text-4xl font-light text-white leading-tight tracking-wide">
                    EXPERIENCE
                  </h1>
                  <h1 className="text-4xl font-light text-white leading-tight tracking-wide">
                    OF AI-POWERED
                  </h1>
                  <h1 className="text-4xl font-light text-white leading-tight tracking-wide">
                    FASHION
                  </h1>
                </div>

                {/* Description */}
                <div className="max-w-md text-white/80 text-sm leading-relaxed mb-8">
                  Discover our revolutionary AI shopping experience. 
                  Try on luxury fashion virtually with cutting-edge technology. 
                  Explore trends and realities through our intelligent 
                  virtual try-on system powered by advanced AI.
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleEnterExperience}
                  className="group flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-xl rounded-full border border-white/30 text-white hover:bg-white/25 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-sm font-medium">
                    {isAuthenticated ? 'Continue to Dashboard' : 'Enter Experience'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Sign In Prompt for Non-Authenticated Users */}
                {!isAuthenticated && (
                  <p className="text-white/60 text-xs mt-4">
                    Sign in required to access the full experience
                  </p>
                )}
              </div>

              {/* Right Section - Clean Video Background */}
              <div className="col-span-3 relative overflow-hidden rounded-3xl">
                {/* Video Background - Edge to Edge */}
                <video
                  src="https://cdn.midjourney.com/video/67efa2d7-f26b-4593-bc87-c511cb9c012d/2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Minimal Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/5 to-black/10" />
              </div>
            </div>
          </div>

          {/* Bottom Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/40 rounded-full" />
            <div className="w-2 h-2 bg-white/40 rounded-full" />
            <div className="w-2 h-2 bg-white/40 rounded-full" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wallpaper Settings */}
      <div className="absolute top-6 right-6 z-50">
        <WallpaperSettings />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default LandingPage;