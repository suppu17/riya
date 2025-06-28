import React, { useState, useEffect } from 'react';
import WallpaperSettings from "./WallpaperSettings";
import LoginModal from "./LoginModal";
import { useWallpaper } from "../contexts/WallpaperContext";

// Define keyframes for modern animations
const modernAnimations = `
@keyframes slideInFromLeft {
  0% { 
    opacity: 0; 
    transform: translateX(-100px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

@keyframes slideInFromRight {
  0% { 
    opacity: 0; 
    transform: translateX(100px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

@keyframes fadeInUp {
  0% { 
    opacity: 0; 
    transform: translateY(30px); 
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

.slide-in-left {
  animation: slideInFromLeft 1s ease-out forwards;
}

.slide-in-right {
  animation: slideInFromRight 1s ease-out forwards;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.scale-in {
  animation: scaleIn 0.6s ease-out forwards;
}
`;

interface LandingPageProps {
  onComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onComplete }) => {
  const { currentWallpaper } = useWallpaper();
  const [showContent, setShowContent] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simple authentication logic - in real app, this would call an API
    if (email && password) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    }
  };

  useEffect(() => {
    // Create and inject the stylesheet
    const style = document.createElement("style");
    style.innerHTML = modernAnimations;
    document.head.appendChild(style);

    // Staggered animation sequence
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowCards(true), 800);
    const timer3 = setTimeout(() => setShowButton(true), 1200);

    // Remove auto-proceed timer - user must authenticate first

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${currentWallpaper}')` }}
      ></div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>

      {/* Main Content Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* Glassmorphism Main Card */}
        <div className="relative w-full max-w-7xl h-full max-h-[90vh] rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-20">
            <div className={`opacity-0 ${showContent ? 'slide-in-left' : ''}`}>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">SnapStyler</h2>
              <div className="text-sm text-white/70 mt-1">+ menu</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="absolute inset-0 pt-32 pb-20 px-6 md:px-12 flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                <div className={`opacity-0 ${showContent ? 'fade-in-up' : ''}`} style={{animationDelay: '0.2s'}}>
                  <div className="text-lg uppercase tracking-widest text-white/60 mb-4">EXHIBITION</div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white leading-tight">
                    OF CONTEMPORARY
                    <br />
                    <span className="font-light">AI FASHION</span>
                  </h1>
                </div>
                


                <div className={`opacity-0 ${showContent ? 'fade-in-up' : ''}`} style={{animationDelay: '0.6s'}}>
                  <p className="text-white/80 text-lg leading-relaxed max-w-md">
                    Discover our curated collection of contemporary fashion. Experience the future of personal styling with AI-powered recommendations.
                  </p>
                </div>
              </div>

              {/* Right Side - Large Fashion Image */}
              <div className={`opacity-0 ${showCards ? 'slide-in-right' : ''}`} style={{animationDelay: '0.3s'}}>
                <div className="relative">
                  {/* Main Fashion Video Container */}
                  <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl">
                    {/* Gradient overlay for better blending */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 z-10"></div>
                    <video 
                      className="w-full h-full object-cover"
                      autoPlay 
                      muted 
                      loop
                      playsInline
                    >
                      <source src="https://cdn.midjourney.com/video/5dfd741c-cc74-4ed4-bbfa-601bc946ae6e/0.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-inner shadow-white/20 z-20 pointer-events-none"></div>
                  </div>
                  
                  {/* Circular Stamp */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white font-light text-xs leading-tight">
                        <div>Voice It</div>
                        <div>Shop It</div>
                        <div>Slay It</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-20">
            <div className={`opacity-0 ${showButton ? 'fade-in-up' : ''}`}>
              <button
                onClick={isAuthenticated ? onComplete : () => setShowLoginModal(true)}
                className={`px-8 py-3 rounded-full backdrop-blur-xl border border-white/20 text-white transition-all duration-300 hover:scale-105 ${
                  isAuthenticated 
                    ? 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isAuthenticated ? 'Enter Collection' : 'Sign In to Continue'}
              </button>
            </div>
            
            <div className={`opacity-0 ${showButton ? 'fade-in-up' : ''}`} style={{animationDelay: '0.2s'}}>
              <div className="text-white/60 text-sm">
Some text 
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper Settings */}
      <div className="absolute top-4 right-4 z-30">
        <WallpaperSettings />
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default LandingPage;
