import React, { useState } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import { ShoppingCart, User, LogIn, LogOut } from "lucide-react";
import CartModal from "../CartModal";
import AuthModal from "../auth/AuthModal";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartItemCount();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);



  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
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
        <motion.span
          className="text-white text-xl pl-4 font-bold"
          whileHover={{
            color: "rgba(255, 255, 255, 0.9)",
            scale: 1.05,
          }}
          transition={{ duration: 0.2 }}
        >
          SnapStyler
        </motion.span>
      </motion.div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* User Profile Icon with Username */}
        {isAuthenticated && (
          <motion.div
            className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/30 shadow-xl"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.4)",
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 1,
              }}
            >
              {user?.avatar ? (
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30 shadow-lg"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
            <motion.span
              className="text-white text-sm font-medium"
              initial={{ scale: 1.2, color: "rgba(34, 197, 94, 1)" }}
              animate={{ scale: 1, color: "rgba(255, 255, 255, 1)" }}
              transition={{ duration: 0.3 }}
            >
              {user?.name?.split(' ')[0] || 'User'}
            </motion.span>
          </motion.div>
        )}

        {/* Sign Off (Logout) Icon */}
        {isAuthenticated && (
          <motion.button
            onClick={handleDirectLogout}
            className="flex items-center justify-center w-10 h-10 bg-red-600/20 hover:bg-red-600/30 backdrop-blur-xl rounded-full border border-red-500/30 hover:border-red-500/50 cursor-pointer transition-all duration-200"
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(239, 68, 68, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            title="Sign Out"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <LogOut className="w-4 h-4 text-red-400" />
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
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            {cartCount > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
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
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />


    </motion.div>
  );
};

export default TopNavigationBar;