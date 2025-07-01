import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWallpaper } from '../contexts/WallpaperContext';

interface FirstTimeWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FirstTimeWallpaperModal: React.FC<FirstTimeWallpaperModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();
  const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper);
  const [isApplying, setIsApplying] = useState(false);

  const handleWallpaperSelect = (wallpaperUrl: string) => {
    setSelectedWallpaper(wallpaperUrl);
    setWallpaper(wallpaperUrl);
  };

  const handleComplete = async () => {
    setIsApplying(true);
    
    // Small delay for better UX
    setTimeout(() => {
      setIsApplying(false);
      onComplete();
    }, 800);
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome! Choose Your Style
                </h2>
                <p className="text-white/70">
                  Select a wallpaper to personalize your experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
              aria-label="Close modal"
              tabIndex={0}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wallpaper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {wallpapers.map((wallpaper) => {
              const isSelected = selectedWallpaper === wallpaper.url;
              return (
                <motion.div
                  key={wallpaper.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 aspect-[16/9] ${
                    isSelected
                      ? 'border-white/60 shadow-lg shadow-white/25 ring-2 ring-white/30'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => handleWallpaperSelect(wallpaper.url)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${wallpaper.name} wallpaper`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleWallpaperSelect(wallpaper.url);
                    }
                  }}
                >
                  <img
                    src={wallpaper.url}
                    alt={wallpaper.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Wallpaper Name */}
                  <div className={`absolute bottom-3 left-3 transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <h3 className="text-white font-semibold text-sm">
                      {wallpaper.name}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-white/70 hover:text-white transition-colors duration-200 font-medium"
              tabIndex={0}
            >
              Skip for now
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 font-medium border border-white/20"
                tabIndex={0}
              >
                Cancel
              </button>
              
              <button
                onClick={handleComplete}
                disabled={isApplying}
                className="px-8 py-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-white/30 hover:border-white/40"
                tabIndex={0}
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Continue
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FirstTimeWallpaperModal;