import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopping } from "../../contexts/ShoppingContext";
import { Loader2, Clock, X, CheckCircle, AlertCircle } from "lucide-react";

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

  const getStatusIcon = () => {
    if (tryOnProgress === 100) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (tryOnError) {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
    return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
  };

  return (
    <>
      <AnimatePresence>
        {isTryingOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center z-50"
          >
            {/* Full Card Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/100 via-blue-600/100 to-indigo-700/100 backdrop-blur-md rounded-2xl" />

            {/* Enhanced Liquid Progress Animation */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center relative"
              >
                {/* Floating Particles */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-64 h-16">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${Math.random() * 40}px`,
                      }}
                      animate={{
                        y: [-10, -30, -10],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.2, 0.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Status Text with Glow Effect */}
                <motion.p
                  className="text-white/90 text-sm font-medium mb-4 relative"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(147, 51, 234, 0.5)",
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 10px rgba(147, 51, 234, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Process going on...
                </motion.p>

                {/* Liquid Progress Container */}
                <div className="relative w-56 h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  {/* Background Wave Animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: "200% 100%",
                    }}
                  />

                  {/* Main Progress Fill with Liquid Effect */}
                  <motion.div
                    className="relative h-full overflow-hidden"
                    initial={{ width: "0%" }}
                    animate={{ width: `${tryOnProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Liquid Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />

                    {/* Liquid Wave Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/80 via-blue-400/80 to-indigo-400/80"
                      animate={{
                        transform: [
                          "translateX(-100%) skewX(0deg)",
                          "translateX(100%) skewX(5deg)",
                          "translateX(-100%) skewX(0deg)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        transform: ["translateX(-100%)", "translateX(100%)"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />

                    {/* Bubble Effects */}
                    {tryOnProgress > 20 && (
                      <div className="absolute inset-0">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white/40 rounded-full"
                            style={{
                              left: `${20 + i * 25}%`,
                              top: "50%",
                            }}
                            animate={{
                              y: [-2, -8, -2],
                              scale: [0.5, 1, 0.5],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.3,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Progress Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(147, 51, 234, 0.3)",
                        "inset 0 0 30px rgba(59, 130, 246, 0.4)",
                        "inset 0 0 20px rgba(147, 51, 234, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Enhanced Progress Text */}
                <motion.p
                  className="text-white/80 text-xs mt-3 font-medium"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.span
                    className="inline-block"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    key={tryOnProgress}
                  >
                    {tryOnProgress}%
                  </motion.span>{" "}
                  <span className="text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Complete
                  </span>
                </motion.p>

                {/* Status Indicator Dots */}
                <div className="flex justify-center mt-3 space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
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
                console.error(
                  "Failed to load try-on result image:",
                  tryOnResult
                );
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
              <i className="fas fa-refresh"></i>
              Reset Try On
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TryOnDisplay;
