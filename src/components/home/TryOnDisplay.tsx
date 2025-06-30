import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useVoice } from "../../contexts/VoiceContext";
import './TryOnDisplay.css';

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
  } = useShopping();

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
                    animationDuration: `${3 + Math.random() * 4}s`
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
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                >
                  {[...Array(10)].map((_, j) => (
                    <span key={j} className="matrix-char">
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
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
                    animationDelay: `${i * 0.5}s`
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
                      animationDelay: `${i * 0.3}s`
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
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={tryOnResult}
              alt="Virtual Try-On Result"
              className="max-h-full max-w-full object-contain rounded-xl"
              onError={(e) => {
                console.error("Failed to load try-on result image:", tryOnResult);
                setTryOnError("Failed to load try-on result image");
                setTryOnResult(null);
              }}
            />
          </div>

          {/* Reset button */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-xl px-3 py-1.5 rounded-xl">
            <button
              onClick={() => setTryOnResult(null)}
              className="text-gray-300 text-xs font-medium flex items-center gap-1 hover:bg-white/20 px-2 py-1 rounded transition-colors"
            >
              <RotateCcw size={16} />
              Reset Try On
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TryOnDisplay;
