import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useUser } from "../../contexts/UserContext";
import TryOnDisplay from "./TryOnDisplay";
import PhotoSelectionModal from "../PhotoSelectionModal";

const ProductDisplay: React.FC = () => {
  const {
    selectedProduct,
    tryOnResult,
    selectedImageIndex,
    handleImageChange,
    handleTryOnMe,
    isTryingOn,
    selectedModelId,
    modelImages,
  } = useShopping();
  
  const { isPremium } = useUser();
  const [showModelModal, setShowModelModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleTryOnClick = async () => {
    // Check if user is premium
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    
    if (!selectedModelId) {
      setShowModelModal(true);
      return;
    }
    await handleTryOnMe();
  };

  const handleGoToSubscriptions = () => {
    setShowPremiumModal(false);
    // Navigate to profile page and scroll to manage subscriptions
    const event = new CustomEvent('navigateToProfile', { detail: { scrollToSubscriptions: true } });
    window.dispatchEvent(event);
  };

  if (!selectedProduct) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 flex items-center justify-center h-96"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.p
          className="text-white/60 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          Select a product to view
        </motion.p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderColor: "rgba(255, 255, 255, 0.25)",
          scale: 1.01,
        }}
        layout
      >
        <motion.div
          className="relative h-[590px] flex items-center justify-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {tryOnResult || isTryingOn ? (
              <motion.div
                key="tryon"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <TryOnDisplay />
              </motion.div>
            ) : (
              <motion.div
                className="relative w-full h-full flex items-center justify-center  rounded-lg box-border"
                key={`product-${selectedProduct.id}-${selectedImageIndex}`}
                style={{
                  backgroundImage: `url(${
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images[selectedImageIndex]
                      : selectedProduct.image
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                }}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{
                  scale: 1.02,
                  filter: "brightness(1.03)",
                }}
              >
                {/* AI Try On Button Overlay */}
                <div className="absolute top-4 right-4 group/tooltip">
                  <motion.button
                    onClick={handleTryOnClick}
                    disabled={isTryingOn}
                    className="w-12 h-12 bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-indigo-700/80 backdrop-blur-md border-3 border-white/50 rounded-full text-white hover:from-purple-500/90 hover:via-blue-500/90 hover:to-indigo-600/90 hover:border-white/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg shadow-purple-500/30"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 12px 40px rgba(147, 51, 234, 0.5)",
                      border: "3px solid rgba(255, 255, 255, 0.9)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isTryingOn ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 16 16"
                        className="text-white drop-shadow-lg"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          scale: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M7 3.5H1.5v11h13V7"
                        />
                        <circle
                          cx="8"
                          cy="7"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="m5 10.5-1 4h8l-1-4H5Z"
                        />
                        <motion.path
                          fill="#FFD700"
                          stroke="#FFD700"
                          strokeWidth="0.5"
                          d="m12 .5.848 2.151L15 3.5l-2.152.849L12 6.5l-.848-2.151L9 3.5l2.152-.849L12 .5Z"
                          animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [0.9, 1.3, 0.9],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 16 16"
                        className="text-white group-hover:text-yellow-200 transition-colors duration-200 drop-shadow-lg"
                        whileHover={{
                          scale: 1.15,
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M7 3.5H1.5v11h13V7"
                        />
                        <circle
                          cx="8"
                          cy="7"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="m5 10.5-1 4h8l-1-4H5Z"
                        />
                        <motion.path
                          fill="#FFD700"
                          stroke="#FFD700"
                          strokeWidth="0.5"
                          d="m12 .5.848 2.151L15 3.5l-2.152.849L12 6.5l-.848-2.151L9 3.5l2.152-.849L12 .5Z"
                          animate={{
                            opacity: [0.8, 1, 0.8],
                            scale: [0.9, 1.2, 0.9],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.svg>
                    )}
                  </motion.button>

                  {/* Selected Photo Thumbnail */}
                  {selectedModelId && (
                    <motion.div
                      className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10"
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="relative">
                        <img
                          src={
                            modelImages?.find((m) => m.id === selectedModelId)
                              ?.url
                          }
                          alt="Selected photo"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white/50"></div>
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Tooltip */}
                  <motion.div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-white/20 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 0, y: -5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                      {isTryingOn ? "AI Processing..." : "✨ Try On with AI"}
                    </span>
                    {/* Tooltip Arrow */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/20 rotate-45"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail Navigation */}
        {selectedProduct.images && selectedProduct.images.length > 1 && (
          <motion.div
            className="absolute bottom-8 right-7 transform -translate-x-1/2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <motion.div className="flex flex-col gap-2 bg-black/15 backdrop-blur-md rounded-full p-2">
              {selectedProduct.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-white shadow-lg scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                  whileHover={{
                    scale: selectedImageIndex === index ? 1.1 : 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Photo Selection Modal */}
      <PhotoSelectionModal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
      />

      {/* Premium Subscription Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-white"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12 15v5m-3 0h6M12 3a6 6 0 0 1 6 6c0 3-2 5.1-6 5.1S6 12 6 9a6 6 0 0 1 6-6Z"
                    />
                  </svg>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Premium Feature
                </h3>
                
                <p className="text-white/80 mb-6">
                  AI Try-On is available for premium subscribers only. Upgrade to unlock this amazing feature and many more!
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleGoToSubscriptions}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-200 font-medium"
                  >
                    Manage Subscriptions
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDisplay;
