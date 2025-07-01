import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopping } from "../../contexts/ShoppingContext";
import { Loader2, Clock, X, CheckCircle, AlertCircle, Download, Share, MoreHorizontal } from "lucide-react";
import "./TryOnDisplay.css";

const TryOnDisplay: React.FC = () => {
  const {
    isTryingOn,
    tryOnStatus,
    tryOnProgress,
    predictionId,
    tryOnError,
    tryOnResult,
    setIsTryingOn,
    setTryOnError,
    setTryOnResult,
    selectedProduct,
  } = useShopping();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Only show try-on for clothing category
  const isClothingCategory = selectedProduct?.category === "Clothing";

  // Don't render anything if not clothing category
  if (!isClothingCategory) {
    return null;
  }

  const handleDownload = async () => {
    if (!tryOnResult) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(tryOnResult);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_TryOn_${selectedProduct?.name?.replace(/\s+/g, '_') || 'Result'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = (platform?: string) => {
    if (!tryOnResult) return;
    
    const shareText = `Check out my AI virtual try-on result with ${selectedProduct?.name || 'this amazing outfit'}! #AIFashion #VirtualTryOn #Style`;
    const shareUrl = tryOnResult;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShowShareMenu(false);
      setShowActionMenu(false);
    } else {
      // Native share API
      if (navigator.share) {
        navigator.share({
          title: 'AI Virtual Try-On Result',
          text: shareText,
          url: shareUrl,
        });
      } else {
        setShowShareMenu(!showShareMenu);
      }
    }
  };

  const getStatusText = () => {
    switch (tryOnStatus) {
      case "in_queue":
        return "Waiting in queue...";
      case "starting":
        return "Starting virtual try-on...";
      case "processing":
        return "Processing your virtual try-on...";
      default:
        return "Creating your virtual try-on...";
    }
  };

  return (
    <>
      <AnimatePresence>
        {isTryingOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />
              <div className="absolute inset-0 backdrop-blur-xl" />
            </div>

            {/* Floating Particles with CSS Animation */}
            <div className="particles-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className={`particle particle-${i % 5}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            {/* Matrix Rain Effect */}
            <div className="matrix-rain">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`matrix-${i}`}
                  className="matrix-column"
                  style={{
                    left: `${i * 7}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                >
                  {[...Array(10)].map((_, j) => (
                    <span key={j} className="matrix-char">
                      {String.fromCharCode(0x30a0 + Math.random() * 96)}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Glowing Orbs */}
            <div className="orbs-container">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`orb-${i}`}
                  className={`glowing-orb orb-${i}`}
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Status Text */}
              <motion.h2
                className="text-2xl font-bold text-white mb-6"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {getStatusText()}
              </motion.h2>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${tryOnProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Progress Percentage */}
              <motion.p
                className="mt-4 text-white/80 font-medium"
                initial={{ scale: 0.9 }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {tryOnProgress}%
              </motion.p>

              {/* Animated Dots */}
              <div className="flex gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-orange-300 rounded-full"
                    animate={{
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              {/* AI Magic Sparkles with CSS */}
              <div className="sparkles-container">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className={`sparkle sparkle-${i % 4}`}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Energy Waves */}
              <div className="energy-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {tryOnError && !isTryingOn && (
        <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-red-500/70 text-white text-sm px-4 py-2 rounded-lg">
          {tryOnError}
        </div>
      )}

      {tryOnResult && !isTryingOn && (
        <>
          {/* Try-on result image */}
          <div className="relative w-full h-full flex items-center justify-center group">
            <img
              src={tryOnResult}
              alt="Virtual Try-On Result"
              className="max-h-full max-w-full object-contain rounded-xl"
              onError={(e) => {
                console.error(
                  "Failed to load try-on result image:",
                  tryOnResult
                );
                setTryOnError("Failed to load try-on result image");
                setTryOnResult(null);
              }}
            />
            
            {/* Overlay with actions - visible on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            
            {/* Action buttons */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/40 backdrop-blur-xl rounded-lg p-2">
                <p className="text-white text-sm font-medium">AI Try-On Result</p>
                <p className="text-white/70 text-xs">{selectedProduct?.name}</p>
              </div>
              
              <div className="flex gap-2">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-black/40 backdrop-blur-xl p-2 rounded-lg text-white hover:bg-black/60 transition-colors disabled:opacity-50"
                  title="Download Image"
                >
                  {isDownloading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
                
                {/* Share Button */}
                <div className="relative">
                  <button
                    onClick={() => handleShare()}
                    className="bg-black/40 backdrop-blur-xl p-2 rounded-lg text-white hover:bg-black/60 transition-colors"
                    title="Share Image"
                  >
                    <Share className="w-5 h-5" />
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 min-w-[120px] z-10">
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                      >
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                      >
                        Facebook
                      </button>
                    </div>
                  )}
                </div>
                
                {/* More Options */}
                <div className="relative">
                  <button
                    onClick={() => setShowActionMenu(!showActionMenu)}
                    className="bg-black/40 backdrop-blur-xl p-2 rounded-lg text-white hover:bg-black/60 transition-colors"
                    title="More Options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {/* Action Menu */}
                  {showActionMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 min-w-[140px] z-10">
                      <button
                        onClick={() => {
                          setTryOnResult(null);
                          setShowActionMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reset Try On
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Close menus when clicking outside */}
          {(showShareMenu || showActionMenu) && (
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => {
                setShowShareMenu(false);
                setShowActionMenu(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default TryOnDisplay;
