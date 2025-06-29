import React, { useState, useEffect } from "react";
import MainContent from "./components/MainContent";
import BottomNav from "./components/BottomNav";
import WallpaperSettings from "./components/WallpaperSettings";
import NewLandingPage from "./components/NewLandingPage";
import TestComponent from './TestComponent';

import { ShoppingProvider } from "./contexts/ShoppingContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { WallpaperProvider, useWallpaper } from "./contexts/WallpaperContext";
import { UserProvider } from "./contexts/UserContext";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showLanding, setShowLanding] = useState(true);
  const { currentWallpaper } = useWallpaper();

  const handleShopNow = () => {
    setShowLanding(false);
    setCurrentView("shop");
  };

  // Listen for navigation to profile page event
  useEffect(() => {
    const handleNavigateToProfile = (event: CustomEvent) => {
      setShowLanding(false);
      setCurrentView("profile");
      
      // If scrollToSubscriptions is requested, scroll to manage subscriptions section
      if (event.detail?.scrollToSubscriptions) {
        setTimeout(() => {
          const subscriptionElement = document.querySelector('[data-subscription-section]');
          if (subscriptionElement) {
            subscriptionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };

    window.addEventListener('navigateToProfile', handleNavigateToProfile as EventListener);
    
    return () => {
      window.removeEventListener('navigateToProfile', handleNavigateToProfile as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Landing Page */}
      {showLanding && <NewLandingPage onComplete={() => setShowLanding(false)} onShopNow={handleShopNow} />}

      {/* Main App Content */}
      <div
        className={`transition-opacity duration-500 ${
          showLanding ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Dynamic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentWallpaper}')` }}
        ></div>

        {/* Multiple Shadow/Dark Overlays for Better Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Main Content - Full Width */}
        <div className="relative z-10 min-h-screen">
          <div className="w-full">
            <MainContent currentView={currentView} />
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

        {/* Wallpaper Settings */}
        <WallpaperSettings />
      </div>
    </div>
  );
};

function App() {
  return (
    <WallpaperProvider>
      <UserProvider>
        <VoiceProvider>
          <ShoppingProvider>
            <AppContent />
          </ShoppingProvider>
        </VoiceProvider>
      </UserProvider>
    </WallpaperProvider>
  );
}

export default App;
