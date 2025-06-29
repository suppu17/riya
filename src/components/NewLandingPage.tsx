import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import WallpaperSettings from "./WallpaperSettings";
import { useWallpaper } from "../contexts/WallpaperContext";

// Define keyframes for animations
const animations = `
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.fade-in {
  animation: fadeIn 1.5s ease forwards;
}

.slide-up {
  animation: slideUp 1s ease forwards;
}

.pulse {
  animation: pulse 2s infinite;
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}
`;

interface NewLandingPageProps {
  onComplete: () => void;
  onShopNow: () => void;
}

const NewLandingPage: React.FC<NewLandingPageProps> = ({ onComplete, onShopNow }) => {
  const { currentWallpaper } = useWallpaper();
  const [showElements] = useState(true);

  // Dynamic color theming based on wallpaper
  const getThemeColors = () => {
    const wallpaperThemes: { [key: string]: { text: string; accent: string } } = {
      'luxury-living': { text: 'text-amber-100', accent: 'text-amber-200' },
      'modern-apartment': { text: 'text-slate-100', accent: 'text-slate-200' },
      'white-interior': { text: 'text-gray-800', accent: 'text-gray-700' },
      'minimalist': { text: 'text-gray-100', accent: 'text-gray-200' },
      'cozy-home': { text: 'text-orange-100', accent: 'text-orange-200' },
    };
    
    const wallpaperId = currentWallpaper.split('/').pop()?.split('_')[0] || 'default';
    return wallpaperThemes[wallpaperId] || { text: 'text-white', accent: 'text-white/80' };
  };

  const themeColors = getThemeColors();

  // Animation sequence
  useEffect(() => {
    // Create and inject the stylesheet
    const style = document.createElement("style");
    style.innerHTML = animations;
    document.head.appendChild(style);

    // Auto-proceed to main app after delay (optional)
    const autoProceedTimer = setTimeout(() => {
      onComplete();
    }, 30000); // 30 seconds

    return () => {
      clearTimeout(autoProceedTimer);
      document.head.removeChild(style);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Top Right Corner - Settings and Bolt Badge */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
        {/* Wallpaper Settings */}
        <div>
          <WallpaperSettings />
        </div>
        
        {/* Bolt Badge for Devpost Hackathon */}
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 0L8.5 8H0l6.5 16L18.5 16H24L13 0z"/>
          </svg>
          <span className="text-sm font-semibold">Built with Bolt</span>
        </a>
      </div>

      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      ></div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>

      {/* Content Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center z-10 px-4">
        {/* Hero Section */}
        <div className={`max-w-4xl text-center opacity-0 ${showElements ? "fade-in" : ""}`} style={{ animationDelay: "0.3s" }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Discover Your Perfect Style with <span className="text-indigo-400">SnapStyler</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your AI-powered shopping assistant that helps you find exactly what you're looking for
          </p>
        </div>

        {/* Feature Highlights */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-8 opacity-0 ${showElements ? "slide-up" : ""}`} style={{ animationDelay: "0.8s" }}>
          {[
            {
              title: "AI Voice Shopping",
              description: "Shop hands-free with voice commands",
              icon: "🎤"
            },
            {
              title: "Virtual Try-On",
              description: "See how items look before you buy them",
              icon: "👗"
            },
            {
              title: "Smart Recommendations",
              description: "AI-powered suggestions based on your style preferences",
              icon: "✨"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">
                {feature.title === "AI Voice Shopping" ? (
                  <Mic className="w-10 h-10 text-white" />
                ) : feature.title === "Virtual Try-On" ? (
                  <span className="text-red-500">👗</span>
                ) : (
                  feature.icon
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-12 opacity-0 ${showElements ? "slide-up" : ""}`} style={{ animationDelay: "1.3s" }}>
          <button
            onClick={onShopNow}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-medium transition-all duration-300 pulse"
          >
            Shop Now
          </button>
          
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-full text-lg font-medium backdrop-blur-sm transition-all duration-300"
          >
            Explore App
          </button>
        </div>

        {/* Sponsors Section */}
        <div className="mt-16 opacity-0 slide-up" style={{ animationDelay: "1.5s" }}>

          <div className="overflow-hidden">
            <div className="flex animate-scroll space-x-8 whitespace-nowrap">
              {/* First set of logos */}
              <div className="flex space-x-12 items-center">
                 {/* DEV Logo */}
                 <svg alt="DEV" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect x="4" y="6" width="16" height="12" rx="2" fill="white"/>
                   <text x="8" y="15" fill="black" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">DEV</text>
                 </svg>
                 {/* G/ Logo */}
                 <svg alt="G/" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold">G/</text>
                 </svg>
                 {/* ElevenLabs Logo */}
                 <svg alt="ElevenLabs" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">||ElevenLabs</text>
                 </svg>
                 {/* Algorand Logo */}
                 <svg alt="Algorand" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <polygon points="8,18 12,6 16,18" fill="white"/>
                   <text x="22" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">lgorand</text>
                 </svg>
                 {/* RevenueCat Logo */}
                 <svg alt="RevenueCat" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">RevenueCat</text>
                   <path d="M110 8 L118 12 L110 16 Z" fill="white"/>
                 </svg>
               </div>
               {/* Duplicate set for seamless loop */}
               <div className="flex space-x-12 items-center">
                 {/* DEV Logo */}
                 <svg alt="DEV" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect x="4" y="6" width="16" height="12" rx="2" fill="white"/>
                   <text x="8" y="15" fill="black" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">DEV</text>
                 </svg>
                 {/* G/ Logo */}
                 <svg alt="G/" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold">G/</text>
                 </svg>
                 {/* ElevenLabs Logo */}
                 <svg alt="ElevenLabs" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">||ElevenLabs</text>
                 </svg>
                 {/* Algorand Logo */}
                 <svg alt="Algorand" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <polygon points="8,18 12,6 16,18" fill="white"/>
                   <text x="22" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">lgorand</text>
                 </svg>
                 {/* RevenueCat Logo */}
                 <svg alt="RevenueCat" className="h-6 opacity-70 hover:opacity-100 transition-opacity" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <text x="2" y="16" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="500">RevenueCat</text>
                   <path d="M110 8 L118 12 L110 16 Z" fill="white"/>
                 </svg>
               </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NewLandingPage;
