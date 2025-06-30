import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useShopping, type ModelImage } from '../contexts/ShoppingContext';

interface ModelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({ isOpen, onClose }) => {
  const { selectedModelId, setSelectedModelId, modelImages } = useShopping();
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

  const handlePhotoSelect = (photo: ModelImage) => {
    setSelectedPhoto(photo);
    setSelectedModelId(photo.id);
  };

  const handleDone = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Select Photo</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {modelImages.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handlePhotoSelect(photo)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 aspect-[3/4] ${
                selectedPhoto?.id === photo.id
                  ? 'border-white/50 ring-2 ring-white/30'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <img 
                src={photo.url} 
                alt={photo.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {selectedPhoto?.id === photo.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="absolute bottom-2 left-2">
                <h3 className="text-white text-sm font-medium">{photo.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <button
            onClick={handleDone}
            className="w-full py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionModal;