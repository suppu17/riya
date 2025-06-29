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
      {/* Dynamic Background - Using a beautiful portrait similar to the reference */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')` 
        }}
      ></div>

      {/* Multiple Shadow/Dark Overlays for Better Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Full screen container */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {/* Main content container with glassmorphism effect */}
        <div
          className={`relative w-[90vmin] max-w-4xl overflow-hidden rounded-3xl opacity-0 ${
            showContainer ? "elastic-appear" : ""
          }`}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20 z-10"></div>

          {/* Content overlay */}
          <div
            className={`relative z-20 flex flex-col items-center justify-center p-12 text-white opacity-0 min-h-[60vh] ${
              showContent ? "fade-in" : ""
            }`}
          >
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 text-center bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Riya
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* Main heading */}
            <h2 className="text-2xl md:text-4xl font-light mb-6 text-center max-w-3xl leading-relaxed">
              Your Personal AI Shopping Assistant
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-center mb-12 max-w-2xl text-white/80 leading-relaxed">
              Experience the future of fashion with AI-powered virtual try-ons, 
              personalized recommendations, and seamless shopping experiences.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Virtual Try-On</h3>
                <p className="text-sm text-white/70">See how clothes look on you with AI</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Voice Shopping</h3>
                <p className="text-sm text-white/70">Shop hands-free with voice commands</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-sm text-white/70">Personalized suggestions just for you</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onComplete}
              className={`group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${showButton ? "float" : ""}`}
            >
              <span className="relative z-10">Enter Riya</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Skip option */}
            <p className="text-sm text-white/60 mt-6">
              Auto-entering in 15 seconds...
            </p>
          </div>
        </div>
      </div>

      {/* Wallpaper Settings */}
      <div className="relative z-20">
        <WallpaperSettings />
      </div>
    </div>
  );
};

export default LandingPage;