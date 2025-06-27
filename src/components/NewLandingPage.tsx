import React, { useState, useEffect } from "react";
import { useWallpaper } from "../contexts/WallpaperContext";

// Define keyframes for animations
const animations = `
@keyframes fadeInUp {
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes scaleIn {
  0% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.fade-in-up {
  animation: fadeInUp 1s ease forwards;
}

.scale-in {
  animation: scaleIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.float {
  animation: float 6s ease-in-out infinite;
}

.pulse {
  animation: pulse 3s ease-in-out infinite;
}
`;

interface NewLandingPageProps {
  onComplete: () => void;
}

const NewLandingPage: React.FC<NewLandingPageProps> = ({ onComplete }) => {
  // Using wallpaper as background
  const { currentWallpaper } = useWallpaper();
  const [animationReady, setAnimationReady] = useState(false);

  // Animation sequence setup
  useEffect(() => {
    // Create and inject the stylesheet
    const style = document.createElement("style");
    style.innerHTML = animations;
    document.head.appendChild(style);

    // Set animation ready after a small delay
    setTimeout(() => {
      setAnimationReady(true);
    }, 100);

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
      {/* Full screen container with wallpaper background */}
      <div className="relative w-full h-full">
        {/* Wallpaper background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentWallpaper}')` }}
        ></div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        
        {/* Main Content Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10 px-8">
          {/* Logo */}
          <div className={`mb-8 ${animationReady ? 'scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center pulse">
              <span className="text-4xl font-bold text-white">R</span>
            </div>
          </div>

          {/* Content Card */}
          <div 
            className={`bg-black/30 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full ${animationReady ? 'scale-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.6s' }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white text-center tracking-wider">
              RIYA
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-orange-200 text-center">
              Voice it. Get it. Slay it.
            </h2>
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={onComplete}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium hover:opacity-90 transition-all duration-300 float"
              >
                <span className="border-b-2 border-white">Shop now</span>
              </button>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={onComplete}
            className={`mt-8 text-gray-300 hover:text-white transition-colors duration-300 ${animationReady ? 'fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '1s' }}
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLandingPage;
