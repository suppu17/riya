import React, { useState, useEffect } from "react";
import MainContent from "./components/MainContent";
import VoiceAssistant from "./components/VoiceAssistant";
import BottomNav from "./components/BottomNav";
import WallpaperSettings from "./components/WallpaperSettings";
import LandingPage from "./components/LandingPage";


import { ShoppingProvider } from "./contexts/ShoppingContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { WallpaperProvider, useWallpaper } from "./contexts/WallpaperContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showLanding, setShowLanding] = useState(true);
  const { currentWallpaper } = useWallpaper();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Reset showLanding when user becomes authenticated
  useEffect(() => {
    console.log('🔍 App.tsx - Auth state changed:', {
      isAuthenticated,
      isLoading,
      user: user?.email || 'no user',
      showLanding
    });
    if (isAuthenticated) {
      console.log('✅ App.tsx - User authenticated, hiding landing page');
      setShowLanding(false);
    }
  }, [isAuthenticated, isLoading, user, showLanding]);

  // Initialize to home view only on first authentication
  useEffect(() => {
    if (isAuthenticated && showLanding) {
      setCurrentView('home');
    }
  }, [isAuthenticated, showLanding]);

  // Show loading screen while checking authentication
  if (isLoading) {
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

        {/* Main Loading Container */}
        <div className="relative w-[90vw] h-[90vh] max-w-none transition-all duration-1000 opacity-100 scale-100">
          {/* Crystal Glass Morphism Container */}
          <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Loading Content */}
            <div className="text-center">
              {/* App Logo/Title */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-wide mb-4">
                  SnapStyler
                  <span className="text-lg text-white/80 font-medium">.app</span>
                </h1>
                <p className="text-white/70 text-lg">
                  Your Personal AI Stylist
                </p>
              </div>

              {/* Enhanced Loading Animation */}
              <div className="relative mb-8">
                {/* Main Loading Spinner */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 border-4 border-cyan-200/20 rounded-full"></div>
                  
                  {/* Animated Ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"></div>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-2 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full animate-pulse"></div>
                  
                  {/* Center Dot */}
                  <div className="absolute inset-6 bg-white/80 rounded-full"></div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                  <p className="text-white/90 text-lg font-medium">
                    {user ? `Welcome back, ${user.name}!` : 'Loading your experience...'}
                  </p>
                  <p className="text-white/60 text-sm">
                    {user ? 'Setting up your dashboard...' : 'Preparing your AI-powered fashion journey'}
                  </p>
                </div>
              </div>

              {/* Floating Particles Animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse"
                    style={{
                      left: `${15 + (i * 6)}%`,
                      top: `${20 + (i % 4) * 15}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${2 + (i % 3)}s`,
                    }}
                  />
                ))}
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-cyan-300/60 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s',
                    }}
                  />
                ))}
              </div>

              {/* Powered By Section */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="text-white/50 text-sm mb-2 text-center">Powered by:</div>
                <div className="flex items-center justify-center gap-4 opacity-60">
                  <div className="i-bolt-supabase text-white"></div>
                  <div className="i-bolt-elevenlabs text-white"></div>
                  <div className="i-bolt-netlify text-white"></div>
                </div>
              </div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating Orbs */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-xl animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bolt Badge */}
        <div className="fixed top-5 right-12 z-50">
          <img 
            src="./bolt.svg" 
            alt="Badge" 
            className="w-20 h-20 opacity-80"
          />
        </div>
      </div>
    );
  }

  // Show landing page only if not authenticated
  if (!isAuthenticated) {
    return <LandingPage onComplete={() => setShowLanding(false)} />;
  }

  // Only show dashboard if authenticated and landing is complete
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      ></div>

      {/* Multiple Shadow/Dark Overlays for Better Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="w-full max-w-7xl mx-auto">
          <MainContent currentView={currentView} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

      {/* Wallpaper Settings */}
      <WallpaperSettings />
      

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <WallpaperProvider>
          <VoiceProvider>
            <ShoppingProvider>
              <AppContent />
            </ShoppingProvider>
          </VoiceProvider>
        </WallpaperProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;