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
      {/* Dynamic Background with Crystal Clear Tones */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      />

      {/* Crystal Glass Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-teal-600/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-cyan-800/15" />

      {/* Main Glass Container - Full Width */}
      <div
        className={`relative w-[95vw] h-[90vh] max-w-7xl transition-all duration-1000 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Crystal Glass Morphism Container */}
        <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-[3rem] overflow-hidden shadow-2xl flex">
          {/* Header - Positioned Above Content */}
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-30">
            <div className="text-2xl font-light text-white tracking-wider">
              riya
            </div>
            <div className="flex items-center gap-6">
              
              {/* Authentication Section with Crystal Accents */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-cyan-200/20 hover:bg-white/15 transition-all duration-300 group"
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
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-white text-sm font-medium">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
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
                
              </div>
            </div>
          </div>

          {/* Success Message for Logged In Users */}
          {isAuthenticated && user && (
            <div className="absolute top-24 right-8 z-30">
              <div className="bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl px-4 py-2">
                <p className="text-cyan-200 text-sm font-medium">
                  Welcome back, {user.name?.split(' ')[0]}! Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

           {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div className={`opacity-0 ${showContent ? 'fade-in-up' : ''}`} style={{animationDelay: '0.2s'}}>
                  <div className="text-lg uppercase tracking-widest text-white/60 mb-4">EXHIBITION</div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white leading-tight">
                    OF CONTEMPORARY
                    <br />
                    <span className="font-light">AI FASHION</span>
                  </h1>
                </div>
                


                <div className={`opacity-0 ${showContent ? 'fade-in-up' : ''}`} style={{animationDelay: '0.6s'}}>
                  <p className="text-white/80 text-lg leading-relaxed max-w-md">
                    Discover our curated collection of contemporary fashion. Experience the future of personal styling with AI-powered recommendations.
                  </p>
                </div>
              </div>

          {/* Right Section - Clean Video Only */}
          <div className="w-1/2 relative">
            {/* Video Background - Full Coverage */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                src="https://cdn.midjourney.com/video/5dfd741c-cc74-4ed4-bbfa-601bc946ae6e/0.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Minimal Video Overlay - Crystal Clear */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-900/5 to-blue-900/10" />
          </div>

          {/* Bottom Navigation Dots with Crystal Accent */}
          <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 flex gap-3 z-30">
            <div className="w-2 h-2 bg-cyan-300 rounded-full" />
            <div className="w-2 h-2 bg-cyan-200/40 rounded-full" />
            <div className="w-2 h-2 bg-cyan-200/40 rounded-full" />
            <div className="w-2 h-2 bg-cyan-200/40 rounded-full" />
          </div>

          {/* Floating Particles - Only on Left Side with Crystal Glow */}
          <div className="absolute inset-0 pointer-events-none w-1/2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-300/20 rounded-full animate-pulse"
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