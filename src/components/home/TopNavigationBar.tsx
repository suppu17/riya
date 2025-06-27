import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';
import { Mic, ShoppingCart } from 'lucide-react';

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const cartCount = getCartItemCount();

  return (
    <div className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
      <div className="flex items-center gap-4">
        <span className="text-white/60 text-lg pl-4 font-bold">
          Shopbeauty.ai
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors">
          <Mic className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20">
          <ShoppingCart className="w-4 h-4 text-white/80" />
          <span className="text-white text-sm">{cartCount} items</span>
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar;
