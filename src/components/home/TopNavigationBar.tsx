import React, { useState } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import { Mic, ShoppingCart, User, LogIn } from "lucide-react";
import CartModal from "../CartModal";
import AuthModal from "../auth/AuthModal";
import UserProfile from "../UserProfile";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const { user, isAuthenticated } = useAuth();
  const cartCount = getCartItemCount();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20"
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
          className="text-white/60 text-lg pl-4 font-bold"
          whileHover={{
            color: "rgba(255, 255, 255, 0.9)",
            scale: 1.05,
          }}
          transition={{ duration: 0.2 }}
        >
          Shopbeauty.ai
        </motion.span>
      </motion.div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.button
          className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors"
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            rotate: 5,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Mic className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* User Profile/Auth Button */}
        <motion.button
          onClick={handleUserClick}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20 cursor-pointer"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{
              rotate: isAuthenticated ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: isAuthenticated ? 1 : 0,
            }}
          >
            {isAuthenticated ? (
              user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white/80" />
              )
            ) : (
              <LogIn className="w-4 h-4 text-white/80" />
            )}
          </motion.div>
          <motion.span
            className="text-white text-sm"
            key={isAuthenticated ? 'authenticated' : 'guest'}
            initial={{ scale: 1.2, color: "rgba(34, 197, 94, 1)" }}
            animate={{ scale: 1, color: "rgba(255, 255, 255, 1)" }}
            transition={{ duration: 0.3 }}
          >
            {isAuthenticated ? (user?.name?.split(' ')[0] || 'User') : 'Sign In'}
          </motion.span>
        </motion.button>

        <motion.button
          onClick={handleCartClick}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20 cursor-pointer"
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{
              rotate: cartCount > 0 ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: cartCount > 0 ? 1 : 0,
            }}
          >
            <ShoppingCart className="w-4 h-4 text-white/80" />
          </motion.div>
          <motion.span
            className="text-white text-sm"
            key={cartCount}
            initial={{ scale: 1.2, color: "rgba(34, 197, 94, 1)" }}
            animate={{ scale: 1, color: "rgba(255, 255, 255, 1)" }}
            transition={{ duration: 0.3 }}
          >
            {cartCount} items
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </motion.div>
  );
};

export default TopNavigationBar;