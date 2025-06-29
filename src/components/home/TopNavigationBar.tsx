import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import { ShoppingCart, User, LogIn, LogOut, Settings, ChevronDown } from "lucide-react";
import CartModal from "../CartModal";
import AuthModal from "../auth/AuthModal";
import UserProfile from "../UserProfile";

const TopNavigationBar: React.FC = () => {
  const { getCartItemCount } = useShopping();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getCartItemCount();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleDirectLogout = () => {
    logout();
  };

  const handleSettingsClick = () => {
    // Navigate to settings page or open settings modal
    setIsDropdownOpen(false);
  };

  return (
    <motion.div
      className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 relative"
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
        {/* Direct Logout Button (only show when authenticated) */}
        {isAuthenticated && (
          <motion.button
            onClick={handleDirectLogout}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 backdrop-blur-xl rounded-lg px-3 py-2 border border-red-500/30 hover:border-red-500/50 cursor-pointer transition-all duration-200"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(239, 68, 68, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </motion.div>
            <motion.span
              className="text-red-400 text-sm font-medium"
              whileHover={{ color: "rgba(248, 113, 113, 1)" }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          </motion.button>
        )}

        {/* User Profile/Auth Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
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
            {isAuthenticated && (
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3 h-3 text-white/60" />
              </motion.div>
            )}
          </motion.button>

          {/* Dropdown Menu - Fixed Z-Index */}
          <AnimatePresence>
            {isAuthenticated && isDropdownOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-[10000]"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ zIndex: 10000 }}
              >
                {/* User Info Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {user?.name}
                      </p>
                      <p className="text-white/60 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <motion.button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-left"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </motion.button>

                  <motion.button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-left"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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