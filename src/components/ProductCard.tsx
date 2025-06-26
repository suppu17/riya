import React from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useShopping } from "../contexts/ShoppingContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  size?: "small" | "medium" | "large";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = "medium",
}) => {
  const { addToCart, addToWishlist, wishlist } = useShopping();
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const sizeClasses = {
    small: "w-32 h-40",
    medium: "w-40 h-48",
    large: "w-48 h-56",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden group hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20`}
    >
      <div className="relative h-2/3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <button
          onClick={() => addToWishlist(product)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 ${
            isInWishlist
              ? "bg-red-500/80 text-white"
              : "bg-white/10 text-white/60 hover:text-red-400"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">
            {product.rating}
          </span>
        </div>
      </div>

      <div className="p-3 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-white truncate">
            {product.name}
          </h3>
          <p className="text-xs text-white/60">{product.category}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
              product.inStock
                ? "bg-purple-500/80 hover:bg-purple-600/80 text-white hover:scale-110"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
