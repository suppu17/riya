import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { useAuth } from "../../contexts/AuthContext";
import { ShoppingCart, User, LogIn, LogOut, Settings, ChevronDown, ChevronRight } from "lucide-react";
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
            className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/30 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.4)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative"
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
                )
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                  <LogIn className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
            <div className="flex flex-col items-start">
              <motion.span
                className="text-white text-sm font-medium"
                key={isAuthenticated ? 'authenticated' : 'guest'}
                initial={{ scale: 1.2, color: "rgba(34, 197, 94, 1)" }}
                animate={{ scale: 1, color: "rgba(255, 255, 255, 1)" }}
                transition={{ duration: 0.3 }}
              >
                {isAuthenticated ? (user?.name?.split(' ')[0] || 'User') : 'Sign In'}
              </motion.span>
              {isAuthenticated && (
                <span className="text-white/60 text-xs">
                  {user?.email?.split('@')[0] || 'user'}
                </span>
              )}
            </div>
            {isAuthenticated && (
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3 h-3 text-white/60" />
              </motion.div>
            )}
          </motion.button>

          {/* Dropdown Menu - Portal */}
          {isAuthenticated && isDropdownOpen && createPortal(
            <AnimatePresence>
              <motion.div
                ref={dropdownRef}
                className="fixed top-20 right-8 w-56 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl z-[99999] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: 99999 }}
              >
                {/* User Info Header */}
                <div className="p-5 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-lg">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base truncate">
                        {user?.name}
                      </p>
                      <p className="text-white/70 text-sm truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3 space-y-1">
                  <motion.button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-4 px-4 py-3 text-white/80 hover:text-white hover:bg-white/15 rounded-2xl transition-all duration-300 text-left group shadow-sm hover:shadow-lg"
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">View Profile</span>
                      <p className="text-xs text-white/50">Manage your account</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </motion.button>

                  <motion.button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-4 px-4 py-3 text-white/80 hover:text-white hover:bg-white/15 rounded-2xl transition-all duration-300 text-left group shadow-sm hover:shadow-lg"
                    whileHover={{ x: 6, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl flex items-center justify-center group-hover:from-gray-500/30 group-hover:to-gray-600/30 transition-all duration-300">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Settings</span>
                      <p className="text-xs text-white/50">Preferences & privacy</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
        </div>

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

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </motion.div>
  );
};

export default TopNavigationBar;