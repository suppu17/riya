import React, { useState, useEffect } from "react";
import { useShopping } from "../contexts/ShoppingContext";
import { Plus, Minus, Star } from "lucide-react";

// In a larger app, this would be in a shared types file.
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  rating: number;
  inStock: boolean;
  designer?: string;
  articleNumber?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShopping();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset state when the product prop changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="w-full h-full bg-black rounded-3xl text-white relative overflow-hidden border border-white/20 shadow-2xl">
      {/* Background Image */}
      <img
        src={product.images?.[selectedImageIndex] || product.image}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out"
      />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full p-8 justify-between">
        {/* Top Section: Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-wider [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
              {product.name.toUpperCase()}
            </h1>
            <p className="text-white/90 mt-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] max-w-lg">
              {product.description}
            </p>
            <div className="flex items-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-white/40"
                  } [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]`}
                />
              ))}
              <span className="text-white/90 text-sm ml-1 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                {product.rating}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <span className="text-5xl font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
              ${product.price}
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Product Info */}
          <div className="grid grid-cols-2 gap-6 mb-6 bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div>
              <h3 className="text-white/70 font-semibold mb-1">Designer</h3>
              <p className="text-lg">{product.designer}</p>
            </div>
            <div>
              <h3 className="text-white/70 font-semibold mb-1">
                Article number
              </h3>
              <p className="text-lg">{product.articleNumber}</p>
            </div>
          </div>

          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                    selectedImageIndex === index
                      ? "border-white/50"
                      : "border-white/20 hover:border-white/30"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors border border-white/20"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-white font-semibold text-2xl w-8 text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors border border-white/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-10 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 text-lg"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
