import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';
import TryOnDisplay from './TryOnDisplay';

const ProductDisplay: React.FC = () => {
  const {
    selectedProduct,
    selectedImageIndex,
    setSelectedImageIndex,
    tryOnResult,
    isTransitioning,
    fadeDirection,
    handleTryOnMe,
  } = useShopping();

  if (!selectedProduct) {
    return null; // or a loading/error state
  }

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

        <TryOnDisplay />

        {/* Product Title Overlay on Left Side with Shadow */}
        <div className="absolute top-4 left-8 max-w-[60%]" >
          <h1 className="text-4xl font-bold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">
            {selectedProduct.name}
          </h1>
        </div>

        {/* Try On Me button - right side */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleTryOnMe}
            className="bg-white/20 backdrop-blur-xl text-white font-medium py-2 px-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <i className="fas fa-magic"></i>
            Try On Me
          </button>
        </div>

        {/* Product Images Thumbnails */}
        {selectedProduct.images && selectedProduct.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 justify-center">
            {selectedProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`
                  relative overflow-hidden border-2 rounded-lg bg-white/10 backdrop-blur-sm
                  transition-all duration-300 ease-in-out
                  ${
                    selectedImageIndex === index
                      ? "border-white w-16 h-16 shadow-lg"
                      : "border-transparent hover:border-white/50 w-14 h-14 opacity-70 hover:opacity-100"
                  }`}
              >
                <img
                  src={image}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
