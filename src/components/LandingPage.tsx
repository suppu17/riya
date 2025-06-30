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
        className={`relative w-[90vw] h-[90vh] max-w-none transition-all duration-1000 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Crystal Glass Morphism Container */}
        <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-[3rem] overflow-hidden shadow-2xl flex">
          {/* Left Side - Content Section */}
          <div className="w-1/2 relative flex flex-col justify-center px-16 py-20">
            {/* Header with Menu */}
            <div className="absolute top-8 left-8 flex items-center gap-4 z-30">
              <div className="text-3xl font-bold text-white tracking-wide">
                SnapStyler
                <span className="text-sm text-white/80 font-medium">.app</span>
              </div>
            </div>

            {/* Success Message for Logged In Users */}
            {isAuthenticated && user && (
              <div className="absolute top-24 left-8 z-30">
                <div className="bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl px-4 py-2">
                  <p className="text-cyan-200 text-sm font-medium">
                    Welcome back, {user.name?.split(" ")[0]}! Redirecting to
                    dashboard...
                  </p>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="space-y-8">
              <div
                className={`opacity-0 ${showContent ? "fade-in-up" : ""}`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-sm uppercase tracking-[0.3em] text-white/90 mb-6 font-semibold">
                  NEXT-GEN FASHION
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tight">
                  YOUR
                  <br />
                  PERSONAL
                  <br />
                  CONVERSATIONAL
                  <br />
                  <span className="font-semibold flex items-center gap-2">
                    REALTIME-AI STYLIST
                    <svg
                      className="w-12 h-12 text-cyan-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </span>
                </h1>
              </div>

              <div
                className={`opacity-0 ${showContent ? "fade-in-up" : ""}`}
                style={{ animationDelay: "0.4s" }}
              >
                <p className="text-white/90 text-base leading-relaxed max-w-xxl font-light">
                  Meet SnapStyler — the next era of web shopping, where
                  hands-free, AI-powered experiences redefine how you discover
                  and try on fashion.
                </p>
              </div>

              <div
                className={`opacity-0 ${showContent ? "fade-in-up" : ""}`}
                style={{ animationDelay: "0.6s" }}
              >
                <button
                  onClick={handleEnterExperience}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-3 text-white font-light text-sm tracking-wide hover:bg-white/15 transition-all duration-300 group"
                >
                  {isAuthenticated
                    ? "Enter Experience"
                    : "Sign In to Experience"}
                </button>
              </div>
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
          <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 z-30">
            <div className="text-white/70 text-sm mb-2 text-left">
              App Powered by:
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-3">
                <div className="i-bolt-supabase text-white"></div>
                <div className="i-bolt-elevenlabs text-white"></div>
                <div className="i-bolt-netlify"></div>
                <div className="i-bolt-entri text-white"></div>
                <div className="i-bolt-expo text-white"></div>
                <div className="i-bolt-revenuecat text-white"></div>
              </div>
            </div>
          </div>

          {/* Sponsers*/}
          <div className="absolute inset-0 pointer-events-none w-1/2"></div>
        </div>
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

      <div className="fixed top-5 right-12 z-99">
        <img src="./bolt.svg" alt="Badge" className="w-20 h-20" />
      </div>
    </div>
  );
};

export default LandingPage;
