import React, { useState } from "react";
import { Search, Mic, Bell, ShoppingCart } from "lucide-react";
import { useShopping } from "../contexts/ShoppingContext";
import { useVoice } from "../contexts/VoiceContext";
import CartModal from "./CartModal";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { getCartItemCount } = useShopping();
  const { startListening, isListening } = useVoice();
  const cartCount = getCartItemCount();

  const handleCartClick = () => {
    console.log("Cart clicked");
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <div className="h-12 px-2 flex items-center justify-between bg-white/5 backdrop-blur-xl border-b border-white/10">
      <h1 className="text-2xl font-bold text-white">FutureShop</h1>

      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Search className="w-5 h-5 text-white/60" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for futuristic products..."
            className="w-full h-12 pl-12 pr-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
          <button
            onClick={startListening}
            className={`absolute inset-y-0 right-4 flex items-center transition-all duration-300 ${
              isListening
                ? "text-red-400 animate-pulse"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-3 text-white/60 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={handleCartClick}
          className="relative p-3 text-white/60 hover:text-white transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} />
    </div>
  );
};

export default Header;
