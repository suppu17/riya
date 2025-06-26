import React from "react";

// Interface for product data type
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category: string;
  rating: number;
  images?: string[];
  inStock: boolean;
  designer?: string;
  articleNumber?: string;
}

interface ProductListCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

const ProductListCard: React.FC<ProductListCardProps> = ({ 
  product, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? "bg-white/20 border border-white/30 shadow-lg"
          : "bg-white/5 hover:bg-white/10 border border-white/10 hover:shadow-md"
      }`}
    >
      <div className="w-[30%] aspect-square rounded-l-2xl overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-3 pr-4 flex items-center min-w-0">
        <div className="min-w-0 w-full">
          <h3 className="text-white font-medium text-sm truncate">
            {product.name}
          </h3>
          <p className="text-white/60 text-xs truncate">
            {product.description?.split(".")[0] || product.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
