import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Camera, Upload, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShopping, type ModelImage } from '../contexts/ShoppingContext';

interface PhotoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected?: () => void;
}

const PhotoSelectionModal: React.FC<PhotoSelectionModalProps> = ({ isOpen, onClose, onPhotoSelected }) => {
  const { selectedModelId, setSelectedModelId, modelImages, addCustomPhoto } = useShopping();
  const [selectedPhoto, setSelectedPhoto] = useState<ModelImage | null>(
    selectedModelId
      ? modelImages.find((p) => p.id === selectedModelId) || null
      : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Sync selectedPhoto with selectedModelId from context
  useEffect(() => {
    const photo = selectedModelId
      ? modelImages.find((p) => p.id === selectedModelId) || null
      : null;
    setSelectedPhoto(photo);
  }, [selectedModelId, modelImages]);

  // Cleanup camera stream when modal closes
  useEffect(() => {
    if (!isOpen && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [isOpen, stream]);

  const handlePhotoSelect = (photo: ModelImage) => {
    console.log('PhotoSelectionModal: Selecting photo:', photo.name, 'with ID:', photo.id);
    setSelectedPhoto(photo);
    setSelectedModelId(photo.id);
    console.log('PhotoSelectionModal: selectedModelId set to:', photo.id);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newPhoto: ModelImage = {
          id: `custom-${Date.now()}`,
          name: `Custom Photo ${modelImages.length + 1}`,
          url: imageUrl,
          isCustom: true
        };
        
        if (addCustomPhoto) {
          addCustomPhoto(newPhoto);
        }
        handlePhotoSelect(newPhoto);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newPhoto: ModelImage = {
          id: `camera-${Date.now()}`,
          name: `Camera Photo ${modelImages.length + 1}`,
          url: imageUrl,
          isCustom: true
        };
        
        if (addCustomPhoto) {
          addCustomPhoto(newPhoto);
        }
        handlePhotoSelect(newPhoto);
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setIsCameraActive(false);
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.8);
  };

  const handleDone = () => {
    console.log('PhotoSelectionModal: handleDone called with selectedPhoto:', selectedPhoto?.name, selectedPhoto?.id);
    // Save the selected photo to context if one is selected
    if (selectedPhoto) {
      console.log('PhotoSelectionModal: Setting selectedModelId to:', selectedPhoto.id);
      setSelectedModelId(selectedPhoto.id);
    } else {
      console.log('PhotoSelectionModal: No photo selected, selectedModelId remains unchanged');
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    onClose();
    
    // Trigger try-on functionality if photo is selected and callback is provided
    if (selectedPhoto && onPhotoSelected) {
      console.log('PhotoSelectionModal: Triggering try-on functionality');
      setTimeout(() => {
        onPhotoSelected();
      }, 100); // Small delay to ensure modal closes first
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDone();
            }
          }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Your Photo
              </h2>
              <button
                onClick={handleDone}
                className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Camera View */}
            {isCameraActive && (
              <motion.div
                className="mb-6 flex-shrink-0"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative bg-black/20 rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                    <button
                      onClick={handleTakePhoto}
                      className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-white font-medium hover:bg-white/30 transition-all duration-200 border border-white/30"
                    >
                      Take Photo
                    </button>
                    <button
                      onClick={() => {
                        if (stream) {
                          stream.getTracks().forEach(track => track.stop());
                          setStream(null);
                        }
                        setIsCameraActive(false);
                      }}
                      className="px-4 py-2 bg-red-500/20 backdrop-blur-xl rounded-full text-white font-medium hover:bg-red-500/30 transition-all duration-200 border border-red-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </motion.div>
            )}

            {/* Upload Options */}
            {!isCameraActive && (
              <div className="mb-6 flex gap-3 flex-shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload from Files'}
                </button>
                <button
                  onClick={handleCameraCapture}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 backdrop-blur-xl rounded-2xl text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <Camera className="w-4 h-4" />
                  Use Camera
                </button>
              </div>
            )}

            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modelImages.map((photo) => (
                  <motion.div
                    key={photo.id}
                    onClick={() => handlePhotoSelect(photo)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 group aspect-[3/4] ${
                      selectedPhoto?.id === photo.id
                        ? 'border-white/50 ring-2 ring-white/30 scale-105'
                        : 'border-white/20 hover:border-white/40 hover:scale-102'
                    }`}
                    whileHover={{ scale: selectedPhoto?.id === photo.id ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {selectedPhoto?.id === photo.id && (
                      <motion.div 
                        className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-xs font-medium truncate">
                        {photo.name}
                      </h3>
                      {photo.isCustom && (
                        <span className="text-xs text-blue-300 opacity-80">Custom</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-white/20 flex-shrink-0">
              <button
                onClick={handleDone}
                className="w-full py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Done
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal outside of parent container
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};

export default PhotoSelectionModal;