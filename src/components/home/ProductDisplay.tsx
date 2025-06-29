import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
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

  const [showModelModal, setShowModelModal] = useState(false);

  const handleTryOnClick = async () => {
    if (!selectedModelId) {
      setShowModelModal(true);
      return;
    }
    await handleTryOnMe();
  };

  if (!selectedProduct) {
    return (
      <motion.div
        className="bg-pink-100/10 backdrop-blur-xl rounded-2xl p-8 border border-pink-200/20 flex items-center justify-center h-96"
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
        className="bg-pink-100/10 backdrop-blur-xl rounded-2xl p-4 border border-pink-200/20 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{
          backgroundColor: "rgba(255, 182, 193, 0.12)",
          borderColor: "rgba(255, 182, 193, 0.25)",
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
                  border: "1px solid rgba(255, 182, 193, 0.2)",
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
                {/* AI Try On Button Overlay with Pink Theme */}
                <div className="absolute top-4 right-4 group/tooltip">
                  <motion.button
                    onClick={handleTryOnClick}
                    disabled={isTryingOn}
                    className="w-12 h-12 bg-gradient-to-br from-pink-600/80 via-rose-600/80 to-pink-700/80 backdrop-blur-md border-3 border-pink-200/50 rounded-full text-white hover:from-pink-500/90 hover:via-rose-500/90 hover:to-pink-600/90 hover:border-pink-200/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg shadow-pink-500/30"
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
                      boxShadow: "0 12px 40px rgba(236, 72, 153, 0.5)",
                      border: "3px solid rgba(255, 182, 193, 0.9)",
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
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-200/50 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border border-pink-200/50"></div>
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Tooltip with Pink Theme */}
                  <motion.div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-pink-200/20 whitespace-nowrap pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 0, y: -5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent font-semibold">
                      {isTryingOn ? "AI Processing..." : "✨ Try On with AI"}
                    </span>
                    {/* Tooltip Arrow */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-pink-200/20 rotate-45"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail Navigation with Pink Accents */}
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
                      ? "border-pink-300 shadow-lg scale-110"
                      : "border-pink-200/30 hover:border-pink-200/60"
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
    </>
  );
};

export default ProductDisplay;