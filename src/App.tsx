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

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showLanding, setShowLanding] = useState(true);
  const { currentWallpaper } = useWallpaper();
  const { isAuthenticated, isLoading } = useAuth();

  // Reset showLanding when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
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
      <WallpaperProvider>
        <VoiceProvider>
          <ShoppingProvider>
            <AppContent />
          </ShoppingProvider>
        </VoiceProvider>
      </WallpaperProvider>
    </AuthProvider>
  );
}

export default App;