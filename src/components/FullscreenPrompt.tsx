import React, { useState, useEffect } from "react";
import { Maximize, X } from "lucide-react";

interface FullscreenPromptProps {
  onDismiss?: () => void;
}

const FullscreenPrompt: React.FC<FullscreenPromptProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  const checkIfMobile = () => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileDevice || isSmallScreen;
  };

  // Check if fullscreen API is supported
  const isFullscreenSupported = () => {
    return !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );
  };

  // Check if currently in fullscreen
  const checkFullscreenStatus = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    setIsFullscreen(isCurrentlyFullscreen);
  };

  // Enter fullscreen
  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  };

  // Handle fullscreen click
  const handleFullscreenClick = async () => {
    await enterFullscreen();
    handleDismiss();
  };

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  // Check mobile status on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };

    // Initial check
    setIsMobile(checkIfMobile());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show prompt after delay if fullscreen is supported, not already in fullscreen, and not on mobile
  useEffect(() => {
    checkFullscreenStatus();

    if (isFullscreenSupported() && !isFullscreen && !isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      checkFullscreenStatus();
      // Hide prompt if user enters fullscreen
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Don't render if fullscreen is not supported, already in fullscreen, or on mobile
  if (!isFullscreenSupported() || isFullscreen || isMobile) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 hidden md:block">
          <div className="flex items-center gap-3 bg-black/10 backdrop-blur-lg rounded-lg px-3 py-2 shadow-lg">
            {/* Content */}
            <div className="text-white/70 text-sm">
              Click for fullscreen mode for best experience
            </div>

            {/* Action Button */}
            <button
              onClick={handleFullscreenClick}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1 rounded-md hover:bg-white/20 transition-all duration-200"
            >
              Enter
            </button>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 ml-1"
              aria-label="Close fullscreen prompt"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenPrompt;
