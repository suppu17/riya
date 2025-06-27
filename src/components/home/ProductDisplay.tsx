import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import TryOnDisplay from "./TryOnDisplay";
import { Camera } from "lucide-react";

const ProductDisplay: React.FC = () => {
  const {
    selectedProduct,
    tryOnResult,
    selectedImageIndex,
    handleImageChange,
    handleTryOnMe,
    isTryingOn,
  } = useShopping();

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
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 relative overflow-hidden"
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
          className="relative h-[550px] flex items-center justify-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {tryOnResult ? (
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
              <motion.div className="relative w-full h-full flex items-center justify-center">
                <motion.img
                  key={`product-${selectedProduct.id}-${selectedImageIndex}`}
                  src={
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? selectedProduct.images[selectedImageIndex]
                      : selectedProduct.image
                  }
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain rounded-xl mx-auto"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.02,
                    filter: "brightness(1.03)",
                  }}
                />

                {/* Try On Me Button Overlay */}
                <motion.button
                  onClick={handleTryOnMe}
                  disabled={isTryingOn}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={isTryingOn ? "Processing..." : "Try On Me"}
                >
                  {isTryingOn ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Camera size={20} />
                    </motion.div>
                  ) : (
                    <Camera size={20} />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail Navigation */}
        {selectedProduct.images && selectedProduct.images.length > 1 && (
          <motion.div
            className="absolute bottom-8 right-5 transform -translate-x-1/2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <motion.div className="flex flex-col gap-2 bg-black/20 backdrop-blur-md rounded-full p-2">
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

      <motion.div
        className="mt-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.div
          className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderColor: "rgba(255, 255, 255, 0.15)",
            y: -2,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="flex items-center justify-between">
            <motion.div>
              <motion.h3
                className="text-white font-semibold text-lg mb-1"
                key={selectedProduct.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {selectedProduct.name}
              </motion.h3>
              <motion.p
                className="text-white/60 text-xs"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {selectedProduct.description}
              </motion.p>
            </motion.div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <motion.span
                className="text-white font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                ${selectedProduct.price}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProductDisplay;
