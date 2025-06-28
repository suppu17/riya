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

.elastic-appear {
  animation: elasticAppear 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

.fade-in {
  animation: fadeIn 2s ease forwards;
}

.float {
  animation: float 6s ease-in-out infinite;
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
              Welcome to <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent font-extrabold tracking-wider animate-pulse">SnapStyler</span>
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

      {/* Wallpaper Settings - Same as main app */}
      <div className="relative z-20">
        <WallpaperSettings />
      </div>
    </div>
  );
};

export default LandingPage;
