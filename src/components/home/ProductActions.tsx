import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';
import { Plus, Minus, Star, Truck, Store } from 'lucide-react';

const ProductActions: React.FC = () => {
  const { selectedProduct, quantity, setQuantity, handleAddToCart } = useShopping();

  if (!selectedProduct) {
    return null;
  }

  return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-2xl font-bold">${selectedProduct.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < selectedProduct.rating ? 'text-yellow-400' : 'text-white/40'}`} fill="currentColor" />
            ))}
            <span className="text-white/60 text-xs ml-1">({selectedProduct.rating})</span>
          </div>
        </div>

        <p className="text-white/70 text-xs mb-6 h-16 overflow-y-auto pr-2">
          {selectedProduct.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-white font-medium">Quantity</span>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center text-white/80 hover:bg-white/20">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white w-8 text-center font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center text-white/80 hover:bg-white/20">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <button onClick={handleAddToCart} className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl mb-6 hover:bg-indigo-600 transition-colors">
          Add to Cart
        </button>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-white text-xs font-medium">Free shipping & returns</span>
            </div>
            <i className="fas fa-chevron-right text-white/60"></i>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-white text-xs font-medium">In store - Check stock</span>
            </div>
            <i className="fas fa-chevron-right text-white/60"></i>
          </div>
        </div>
      </div>
  );
};

export default ProductActions;
