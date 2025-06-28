import React, { useState, useEffect } from "react";
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

.fade-in {
  animation: fadeIn 1.5s ease forwards;
}

.slide-up {
  animation: slideUp 1s ease forwards;
}

.pulse {
  animation: pulse 2s infinite;
}
`;

interface NewLandingPageProps {
  onComplete: () => void;
  onShopNow: () => void;
}

const NewLandingPage: React.FC<NewLandingPageProps> = ({ onComplete, onShopNow }) => {
  const { currentWallpaper } = useWallpaper();
  const [showElements] = useState(true);

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
            Discover Your Perfect Style with <span className="text-indigo-400">Riya</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your AI-powered shopping assistant that helps you find exactly what you're looking for
          </p>
        </div>

        {/* Feature Highlights */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mt-8 opacity-0 ${showElements ? "slide-up" : ""}`} style={{ animationDelay: "0.8s" }}>
          {[
            {
              title: "Smart Recommendations",
              description: "AI-powered suggestions based on your style preferences",
              icon: "✨"
            },
            {
              title: "Virtual Try-On",
              description: "See how items look before you buy them",
              icon: "👗"
            },
            {
              title: "Voice Shopping",
              description: "Shop hands-free with voice commands",
              icon: "🎤"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
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
      </div>

      {/* Wallpaper Settings */}
      <div className="relative z-20">
        <WallpaperSettings />
      </div>
    </div>
  );
};

export default NewLandingPage;
