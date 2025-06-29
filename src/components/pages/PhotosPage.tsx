import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Check } from "lucide-react";
import { useShopping, type ModelImage } from "../../contexts/ShoppingContext";
import ModelSelectionModal from "../ModelSelectionModal";

const PhotosPage: React.FC = () => {
  const { selectedModelId, modelImages } = useShopping();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Photo Gallery
          </h2>
          <p className="text-white/60 text-sm">
            Select a model for virtual try-on
          </p>
        </div>

        {/* Model Photo Display */}
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {selectedPhoto ? (
            <motion.div
              onClick={() => setIsModalOpen(true)}
              className="relative cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-80 h-96 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl group-hover:border-white/40 transition-all duration-300">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    {selectedPhoto.name}
                  </h3>
                  <p className="text-white/80 text-sm">Click to Change Photo</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="w-80 h-96 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex flex-col items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-16 h-16 mb-4" />
              <span className="text-lg font-medium">Select Photo</span>
              <span className="text-sm text-white/60 mt-2">Choose a model for photo selection</span>
            </motion.button>
          )}

          {!selectedPhoto && (
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white/60 text-sm">
                No model selected. Click above to choose a model for photo selection.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Model Selection Modal */}
      <ModelSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PhotosPage;
