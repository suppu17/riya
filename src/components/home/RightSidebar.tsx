import React from 'react';
import { Star, Minus, Plus } from 'lucide-react';
import RiyaVoiceAgent from '../RiyaVoiceAgent';
import { Product } from '../../contexts/ShoppingContext';

interface RightSidebarProps {
  selectedProduct: Product;
  quantity: number;
  selectedImageIndex: number;
  isTryingOn: boolean;
  tryOnError: string | null;
  onQuantityChange: (newQuantity: number) => void;
  onImageSelect: (index: number) => void;
  onAddToCart: () => void;
  onTryOnMe: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  selectedProduct, 
  quantity, 
  selectedImageIndex, 
  isTryingOn, 
  tryOnError, 
  onQuantityChange, 
  onImageSelect, 
  onAddToCart, 
  onTryOnMe 
}) => {
  return (
    <div className="col-span-3">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-white">
            {selectedProduct.name}
          </h1>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="text-white font-medium">4.8</span>
          </div>
        </div>

        <p className="text-white/70 mb-6">
          {selectedProduct.description}
        </p>

        {/* Image thumbnails */}
        <div className="flex gap-2 mb-6">
          {selectedProduct.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${selectedProduct.name} thumbnail ${index + 1}`}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                selectedImageIndex === index
                  ? "border-white"
                  : "border-transparent"
              }`}
              onClick={() => onImageSelect(index)}
            />
          ))}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-white/10 rounded-lg p-2 mb-4">
          <span className="text-white/80">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white font-medium">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors mb-4"
        >
          Add to Cart
        </button>

        {/* Try On Me Button */}
        <button
          onClick={onTryOnMe}
          disabled={isTryingOn}
          className="w-full bg-pink-600 text-white rounded-lg py-3 font-semibold hover:bg-pink-700 transition-colors disabled:bg-pink-800 disabled:cursor-not-allowed"
        >
          {isTryingOn ? "Please wait..." : "Try On Me"}
        </button>

        {tryOnError && (
          <p className="text-red-400 text-sm mt-4">{tryOnError}</p>
        )}
      </div>

      <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <RiyaVoiceAgent />
      </div>
    </div>
  );
};

export default RightSidebar;
