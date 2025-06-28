import React, { useState } from "react";
import MainContent from "./components/MainContent";
import VoiceAssistant from "./components/VoiceAssistant";
import BottomNav from "./components/BottomNav";
import WallpaperSettings from "./components/WallpaperSettings";
import LandingPage from "./components/LandingPage";

import { ShoppingProvider } from "./contexts/ShoppingContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { WallpaperProvider, useWallpaper } from "./contexts/WallpaperContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState("home");
  const [showLanding, setShowLanding] = useState(true);
  const { currentWallpaper } = useWallpaper();
  const { isDarkMode, currentTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Landing Page */}
      {showLanding && <LandingPage onComplete={() => setShowLanding(false)} />}

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

        {/* Theme-aware overlays for better contrast */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-black/40 via-black/20 to-black/50' 
              : 'bg-gradient-to-br from-white/20 via-white/10 to-white/30'
          }`}
        ></div>
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-t from-black/60 via-transparent to-black/30' 
              : 'bg-gradient-to-t from-white/40 via-transparent to-white/20'
          }`}
        ></div>
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isDarkMode ? 'bg-black/20' : 'bg-white/10'
          }`}
          style={{
            background: isDarkMode 
              ? 'rgba(0, 0, 0, 0.2)' 
              : `linear-gradient(135deg, ${currentTheme.background}10, ${currentTheme.surface}05)`
          }}
        ></div>

        {/* Main Content - Centered */}
        <NavigationProvider currentView={currentView} setCurrentView={setCurrentView}>
          <div className="relative z-10 min-h-screen p-8">
            <div className="w-full max-w-7xl mx-auto">
              <MainContent currentView={currentView} />
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        </NavigationProvider>

        {/* Wallpaper Settings */}
        <WallpaperSettings />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <VoiceProvider>
          <ShoppingProvider>
            <AppContent />
          </ShoppingProvider>
        </VoiceProvider>
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;
