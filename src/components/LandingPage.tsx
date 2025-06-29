import React, { useState, useEffect } from "react";
import WallpaperSettings from "./WallpaperSettings";
import { useWallpaper } from "../contexts/WallpaperContext";

// Define keyframes for elastic animation
const elasticAnimation = `
@keyframes elasticAppear {
  0% { 
    opacity: 0; 
    transform: scale(0.5); 
  }
  70% { 
    opacity: 1; 
    transform: scale(1.05); 
  }
  85% { 
    transform: scale(0.95); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.elastic-appear {
  animation: elasticAppear 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

.fade-in {
  animation: fadeIn 2s ease forwards;
}

.float {
  animation: float 6s ease-in-out infinite;
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}
`;

interface LandingPageProps {
  onComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onComplete }) => {
  const { currentWallpaper } = useWallpaper();
  // Set initial states to true to ensure elements are visible immediately
  const [showContent, setShowContent] = useState(true);
  const [showContainer, setShowContainer] = useState(true);
  const [showButton, setShowButton] = useState(true);

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
  // Animation sequence - only for stylesheet injection and auto-proceed
  useEffect(() => {
    // Create and inject the stylesheet
    const style = document.createElement("style");
    style.innerHTML = elasticAnimation;
    document.head.appendChild(style);

    // Auto-proceed to main app after delay (optional)
    const autoProceedTimer = setTimeout(() => {
      onComplete();
    }, 15000); // 15 seconds

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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 0L8.5 8H0l6.5 16L18.5 16H24L13 0z"/>
          </svg>
          <span className="text-sm font-semibold">Built with Bolt</span>
        </div>
      </div>

      {/* Dynamic Background - Same as main app */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      ></div>

      {/* Multiple Shadow/Dark Overlays for Better Contrast - Same as main app */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Full screen container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {/* Square video container with blur effect */}
        <div
          className={`relative aspect-square w-[90vmin] max-w-3xl overflow-hidden rounded-3xl opacity-0 ${
            showContainer ? "elastic-appear" : ""
          }`}
        >
          {/* Blur overlay on top of the video */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/30 z-10"></div>

          {/* Video element that fills the container */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* Replace with your actual video path */}
            <source src="/assets/landing-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Content overlay */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-white opacity-0 ${
              showContent ? "fade-in" : ""
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              Welcome to SnapStyler
            </h1>
            <p className="text-xl md:text-2xl text-center mb-8 max-w-md">
              Your personal shopping assistant
            </p>

            {/* Skip button */}
            <button
              onClick={onComplete}
              className="mt-8 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-300 elastic-appear float"
            >
              Enter App
            </button>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="py-4">

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

export default LandingPage;
