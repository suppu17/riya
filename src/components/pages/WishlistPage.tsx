import React from "react";
import { Heart } from "lucide-react";
import { useShopping } from "../../contexts/ShoppingContext";
import ProductCard from "../ProductCard";

const WishlistPage: React.FC = () => {
  const { wishlist } = useShopping();

  if (wishlist.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
          <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-white/60 mb-8">Save items you love for later</p>
          <button className="px-8 py-3 bg-gradient-to-r from-white-500 to-white-500 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Wishlist</h2>
          <span className="text-white/60">({wishlist.length} items)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} size="medium" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
