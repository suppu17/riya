import React from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useShopping } from "../../contexts/ShoppingContext";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, getTotalPrice, clearCart } = useShopping();

  if (cart.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
          <ShoppingBag className="w-16 h-16 text-white/30 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-white/60 mb-8">
            Start shopping to add items to your cart
          </p>
          <button className="px-8 py-3 bg-white text-black rounded-2xl font-medium hover:bg-white/90 transition-all duration-300">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="font-medium text-white">{item.name}</h3>
                <p className="text-white/60 text-sm">{item.category}</p>
                <p className="text-white font-semibold">${item.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 bg-red-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-semibold text-white">Total:</span>
            <span className="text-2xl font-bold text-white">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
