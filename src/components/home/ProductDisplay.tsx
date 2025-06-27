import React from 'react';
import { Loader2, Clock } from 'lucide-react';
import { Product } from '../../contexts/ShoppingContext';

interface ProductDisplayProps {
  selectedProduct: Product;
  isTransitioning: boolean;
  fadeDirection: string;
  tryOnResult: string | null;
  isTryingOn: boolean;
  tryOnStatus: string | null;
  predictionId: string | null;
  selectedImageIndex: number;
  onCancelTryOn: () => void;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ 
  selectedProduct, 
  isTransitioning, 
  fadeDirection, 
  tryOnResult, 
  isTryingOn, 
  tryOnStatus, 
  predictionId, 
  selectedImageIndex,
  onCancelTryOn
}) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 h-[650px] overflow transition-opacity duration-300 ease-in-out ${
        isTransitioning
          ? "opacity-" + (fadeDirection === "out" ? "50" : "100")
          : "opacity-100"
      }`}
    >
      <div className="relative h-full w-full">
        <img
          src={
            tryOnResult ||
            selectedProduct.images?.[selectedImageIndex] ||
            selectedProduct.image
          }
          alt={tryOnResult ? "Try On Result" : selectedProduct.name}
          className="w-full h-full object-cover rounded-2xl"
        />

        {isTryingOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
              <p className="text-white font-medium">
                {tryOnStatus === "in_queue" && "Waiting in queue..."}
                {tryOnStatus === "processing" &&
                  "Processing your virtual try-on..."}
                {tryOnStatus === "starting" &&
                  "Starting virtual try-on..."}
                {!tryOnStatus && "Creating your virtual try-on..."}
              </p>
              {predictionId && (
                <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> This may take up to 40
                  seconds
                </p>
              )}
              <p className="text-white/60 text-xs mt-2">
                {predictionId &&
                  `Prediction ID: ${predictionId.substring(0, 8)}...`}
                {tryOnStatus && ` | Status: ${tryOnStatus}`}
              </p>
              <button
                onClick={onCancelTryOn}
                className="mt-4 text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
