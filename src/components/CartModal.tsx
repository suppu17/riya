import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useShopping } from "../contexts/ShoppingContext";
import { CartItem } from "../contexts/ShoppingContext";
import confetti from "canvas-confetti";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, getTotalPrice, clearCart } =
    useShopping();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleQuantityChange = (item: CartItem, change: number) => {
    if (change > 0) {
      addToCart(item);
    } else if (change < 0 && item.quantity > 1) {
      // Decrease quantity by removing one instance
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      // This is a workaround since we don't have a decreaseQuantity function
      removeFromCart(item.id);
      if (item.quantity > 1) {
        for (let i = 0; i < item.quantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  const generateOrderId = () => {
    return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const triggerConfetti = () => {
    // Create a canvas element for confetti within the modal
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "10000";

    // Append to body temporarily
    document.body.appendChild(canvas);

    // Create confetti instance with custom canvas
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    // Trigger confetti
    myConfetti({
      particleCount: 300,
      spread: 360, // Full spread for container width
      origin: { y: 0 }, // Start from very top
      colors: [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
        "#FFA500",
        "#FF69B4",
      ],
      startVelocity: 45, // Higher initial velocity
      gravity: 1, // Reduced gravity for slower fall
      scalar: 1.2, // Slightly larger particles
      ticks: 500, // More ticks for longer animation
      decay: 0.9, // Slower decay
    });
    // Remove canvas after animation
    setTimeout(() => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }, 3000);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);

    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setOrderConfirmed(true);
    setIsCheckingOut(false);

    // Trigger confetti animation
    triggerConfetti();

    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  const handleClose = () => {
    if (orderConfirmed) {
      setOrderConfirmed(false);
      setOrderId("");
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 h-[60%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {orderConfirmed ? (
            // Order Confirmation
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Order Confirmed!
              </h3>
              <p className="text-white/80 mb-4">Thank you for your purchase</p>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-white/60 text-sm mb-1">Order ID</p>
                <p className="text-white font-mono text-lg">{orderId}</p>
              </div>
              <button
                onClick={handleClose}
                className="mt-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart Items
            <>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white/5 rounded-2xl p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm">
                            {item.name}
                          </h4>
                          <p className="text-white/60 text-sm">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/80 font-semibold">
                        Total:
                      </span>
                      <span className="text-white font-bold text-xl">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || cart.length === 0}
                      className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Checkout"
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CartModal;
