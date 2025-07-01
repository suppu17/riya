import React, { useState } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import { ShoppingCart, User, LogIn, LogOut } from "lucide-react";
import CartModal from "../CartModal";
import AuthModal from "../auth/AuthModal";
import Logo from "../Logo";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount, isCartModalOpen, openCartModal, closeCartModal, cartModalRef } = useShopping();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartItemCount();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);



  const handleCartClick = () => {
    openCartModal();
  };

  const handleCloseCartModal = () => {
    closeCartModal();
  };

  const handleDirectLogout = () => {
    logout();
  };

  return (
    <motion.div
      className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 relative shadow-2xl"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center gap-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className="pl-4"
          whileHover={{
            scale: 1.05,
          }}
          transition={{ duration: 0.2 }}
        >
          <Logo size="sm" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
      

        {/* Sign Off (Logout) Icon */}
        {isAuthenticated && (
          <motion.button
            onClick={handleDirectLogout}
            className="flex items-center justify-center w-10 h-10 bg-white-600/20 hover:bg-white-600/30 backdrop-blur-xl rounded-full border border-white-500/30 hover:border-white-500/50 cursor-pointer transition-all duration-200"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            title="Sign Out"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <LogOut className="w-4 h-4 text-white" />
            </motion.div>
          </motion.button>
        )}

        {/* Login Button for non-authenticated users */}
        {!isAuthenticated && (
          <motion.button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/30 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
              <LogIn className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Sign In</span>
          </motion.button>
        )}



        <motion.button
          onClick={handleCartClick}
          className="relative flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/30 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-white-600/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-white-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white text-sm font-medium">Cart</span>
            <span className="text-white/60 text-xs">
              {cartCount === 0 ? 'Empty' : `${cartCount} item${cartCount > 1 ? 's' : ''}`}
            </span>
          </div>
        </motion.button>
      </motion.div>

      {/* Cart Modal */}
      <CartModal ref={cartModalRef} isOpen={isCartModalOpen} onClose={handleCloseCartModal} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />


    </motion.div>
  );
};

export default TopNavigationBar;