import React, { useState } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useAuth } from "../../contexts/AuthContext";
import { Mic, ShoppingCart, Bell, LogOut } from "lucide-react";
import CartModal from "../CartModal";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const { navigateToHome } = useNavigation();
  const { logout } = useAuth();
  const cartCount = getCartItemCount();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

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
