import React, { useState } from "react";
import MainContent from "./components/MainContent";
import BottomNav from "./components/BottomNav";
import WallpaperSettings from "./components/WallpaperSettings";
import NewLandingPage from "./components/NewLandingPage";

import { ShoppingProvider } from "./contexts/ShoppingContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { WallpaperProvider, useWallpaper } from "./contexts/WallpaperContext";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showLanding, setShowLanding] = useState(true);
  const { currentWallpaper } = useWallpaper();

  const handleShopNow = () => {
    setShowLanding(false);
    setCurrentView("shop");
  };

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
    </div>
  );
};

function App() {
  return (
    <WallpaperProvider>
      <VoiceProvider>
        <ShoppingProvider>
          <AppContent />
        </ShoppingProvider>
      </VoiceProvider>
    </WallpaperProvider>
  );
}

export default App;
