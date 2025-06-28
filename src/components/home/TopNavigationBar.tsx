import React, { useState } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Mic, ShoppingCart, Bell, LogOut } from "lucide-react";
import CartModal from "../CartModal";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const { navigateToHome } = useNavigation();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const cartCount = getCartItemCount();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
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
        <motion.button
          onClick={navigateToHome}
          className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-xl pl-4 font-black tracking-wide cursor-pointer border-none bg-transparent outline-none"
          whileHover={{
            scale: 1.1,
            filter: "brightness(1.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            textShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
          }}
        >
          SnapStyler
        </motion.button>
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
            <Bell className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.div className="relative">
          <motion.button
            onClick={toggleDarkMode}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
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
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </motion.div>
          </motion.button>
          
          {/* Tooltip */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap"
            >
              Switch mode
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80"></div>
            </motion.div>
          )}
        </motion.div>

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

        <motion.button
          onClick={logout}
          className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors"
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            rotate: 5,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          title="Logout"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} />
    </motion.div>
  );
};

export default TopNavigationBar;
