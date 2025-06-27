import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { useShopping, type ModelImage } from "../contexts/ShoppingContext";

interface ModelOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelOverlay: React.FC<ModelOverlayProps> = ({ isOpen, onClose }) => {
  const { selectedModelId, setSelectedModelId, modelImages } = useShopping();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<ModelImage | null>(
    selectedModelId
      ? modelImages.find((p) => p.id === selectedModelId) || null
      : null
  );

  // Sync selectedPhoto with selectedModelId from context
  useEffect(() => {
    const photo = selectedModelId
      ? modelImages.find((p) => p.id === selectedModelId) || null
      : null;
    setSelectedPhoto(photo);
  }, [selectedModelId, modelImages]);

  const handlePhotoSelect = (photo: ModelImage, index: number) => {
    setSelectedPhoto(photo);
    setSelectedModelId(photo.id);
    setCurrentImageIndex(index);
  };

  const handlePrevious = () => {
    const newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : modelImages.length - 1;
    setCurrentImageIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentImageIndex < modelImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
  };

  const handleSelectAndClose = () => {
    if (modelImages[currentImageIndex]) {
      handlePhotoSelect(modelImages[currentImageIndex], currentImageIndex);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-white/10 backdrop-blur-3xl overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-h-[calc(100%-4rem)] flex flex-col p-6 pt-16">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Select Model
                    </h2>
                    <p className="text-white/70 text-base">
                      Choose a model for virtual try-on
                    </p>
                  </div>
                  {/* Selected Model Thumbnail */}
                  {selectedPhoto && (
                    <div className="relative">
                      <div className="w-20 h-24 bg-white/15 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden shadow-xl">
                        <img
                          src={selectedPhoto.url}
                          alt={selectedPhoto.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-white/90 text-sm mt-2 text-center truncate max-w-20 font-medium">
                        Selected
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image Display */}
              <div className="flex-1 flex items-center justify-center mb-8">
                <motion.div
                  className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 overflow-hidden shadow-2xl max-w-md w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative aspect-[3/4] w-full">
                    <motion.img
                      key={currentImageIndex}
                      src={modelImages[currentImageIndex].url}
                      alt={modelImages[currentImageIndex].name}
                      className="w-full h-full object-cover rounded-2xl"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Selection indicator */}
                    {selectedPhoto?.id ===
                      modelImages[currentImageIndex].id && (
                      <motion.div
                        className="absolute top-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevious}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </motion.div>

                {/* Model Info */}
                <div className="text-center mt-6">
                  <h3 className="text-white text-xl font-semibold mb-4">
                    {modelImages[currentImageIndex].name}
                  </h3>
                  <button
                    onClick={handleSelectAndClose}
                    className="px-12 py-4 text-base font-semibold rounded-2xl transition-all duration-200 border bg-green-500/30 text-green-200 border-green-500/50 hover:bg-green-500/40 shadow-xl hover:shadow-green-500/30"
                  >
                    Select & Continue
                  </button>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="relative pb-6">
                <h4 className="text-white/90 text-sm font-semibold mb-4">
                  All Models
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide justify-center">
                  {modelImages.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className={`relative flex-shrink-0 cursor-pointer group ${
                        index === currentImageIndex
                          ? "ring-2 ring-white/60"
                          : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <div className="w-16 h-20 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden hover:border-white/50 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Selection indicator on thumbnail */}
                      {selectedPhoto?.id === photo.id && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Check className="w-2 h-2 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModelOverlay;
