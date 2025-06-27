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
  const { currentWallpaper } = useWallpaper();
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Content for each slide
  const slides = [
    {
      title: "Welcome to Riya",
      subtitle: "Your AI-powered shopping assistant",
      description: "Discover a new way to shop with personalized recommendations and voice assistance."
    },
    {
      title: "Smart Shopping",
      subtitle: "Tailored to your preferences",
      description: "Riya learns your style and budget to find the perfect items for you."
    },
    {
      title: "Voice Enabled",
      subtitle: "Shop hands-free",
      description: "Simply ask Riya to find products, compare prices, or place orders with your voice."
    }
  ];

  // Handle slide navigation
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      ></div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"></div>

      {/* Main Content Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center z-10 px-6">
        {/* Logo */}
        <div className={`mb-8 ${animationReady ? 'scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center pulse">
            <span className="text-4xl font-bold text-white">R</span>
          </div>
        </div>

        {/* Content Card */}
        <div 
          className={`bg-black/30 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full ${animationReady ? 'scale-in' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white text-center">
            {slides[currentSlide].title}
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-purple-300 text-center">
            {slides[currentSlide].subtitle}
          </h2>
          <p className="text-lg text-gray-200 text-center mb-8">
            {slides[currentSlide].description}
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-purple-500 scale-125' : 'bg-gray-400'
                }`}
              ></div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              className={`px-4 py-2 rounded-full ${
                currentSlide === 0 
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              } transition-all duration-300`}
              disabled={currentSlide === 0}
            >
              Previous
            </button>
            
            <button
              onClick={nextSlide}
              className={`px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-300 float`}
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
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
  );
};

export default NewLandingPage;
