import React, { useState } from 'react';
import { User, LogOut, Settings, Edit3, Save, X, Heart, Star, Package, Edit, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, profile, logout, updateProfile, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [preferences, setPreferences] = useState({
    favoriteCategories: user?.preferences?.favoriteCategories || [],
    size: user?.preferences?.size || '',
    style: user?.preferences?.style || []
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setPreferences({
      favoriteCategories: user?.preferences?.favoriteCategories || [],
      size: user?.preferences?.size || '',
      style: user?.preferences?.style || []
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setPreferences({
      favoriteCategories: user?.preferences?.favoriteCategories || [],
      size: user?.preferences?.size || '',
      style: user?.preferences?.style || []
    });
    setUpdateMessage('');
  };

  const handleSave = async () => {
    if (!user) return;

    setIsUpdating(true);
    
    // Update profile
    const profileResult = await updateProfile({
      name: editData.name,
      email: editData.email
    });

    // Update preferences
    const preferencesResult = await updatePreferences(preferences);

    if (profileResult.success && preferencesResult.success) {
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      setUpdateMessage(profileResult.error || preferencesResult.error || 'Failed to update profile');
    }
    setIsUpdating(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category]
    }));
  };

  const handleStyleToggle = (style: string) => {
    setPreferences(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }));
  };

  if (!user) return null;

  const availableCategories = ['Clothing', 'Bags', 'Shoes', 'Watches', 'Beauty'];
  const availableStyles = ['Casual', 'Formal', 'Sporty', 'Elegant', 'Trendy', 'Classic'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile</h2>
                  <p className="text-white/60 text-sm">Manage your account settings</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-3 text-white/60 hover:text-white transition-all duration-300 rounded-2xl hover:bg-white/10 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 group-hover:text-red-400 transition-colors" />
              </motion.button>
            </div>

            {/* Profile Avatar and Basic Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center p-1 shadow-2xl">
                  <div className="w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center overflow-hidden border border-white/20">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {!isEditing && (
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{user.name}</h3>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <p className="text-white/40 text-xs mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <motion.div 
                      className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-3 border border-red-500/30 text-center"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">12</div>
                      <div className="text-xs text-white/60">Favorites</div>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-3 border border-blue-500/30 text-center"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Package className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">8</div>
                      <div className="text-xs text-white/60">Orders</div>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-3 border border-yellow-500/30 text-center"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">★</div>
                      <div className="text-xs text-white/60">Premium</div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Update Message */}
            {updateMessage && (
              <motion.div
                className={`mb-6 p-4 rounded-2xl border ${
                  updateMessage.includes('success')
                    ? 'bg-green-500/20 border-green-500/30 text-green-300'
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm">{updateMessage}</p>
              </motion.div>
            )}

            {/* Edit Form */}
            {isEditing ? (
              <div className="space-y-6 mb-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Basic Information</h4>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Preferences</h4>
                  
                  {/* Favorite Categories */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Favorite Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            preferences.favoriteCategories.includes(category)
                              ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                              : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Preferred Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setPreferences(prev => ({ ...prev, size }))}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            preferences.size === size
                              ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                              : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Style Preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableStyles.map(style => (
                        <button
                          key={style}
                          onClick={() => handleStyleToggle(style)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            preferences.style.includes(style)
                              ? 'bg-white/30 text-white border border-white/50'
                              : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-green-400/30 backdrop-blur-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: !isUpdating ? 1.02 : 1, y: !isUpdating ? -1 : 0 }}
                    whileTap={{ scale: !isUpdating ? 0.98 : 1 }}
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-400/30 backdrop-blur-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Current Preferences Display */}
                {user.preferences && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Your Preferences</h4>
                    
                    {user.preferences.favoriteCategories.length > 0 && (
                      <div>
                        <p className="text-white/60 text-sm mb-2">Favorite Categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.favoriteCategories.map(category => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.preferences.size && (
                      <div>
                        <p className="text-white/60 text-sm mb-2">Preferred Size:</p>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30">
                          {user.preferences.size}
                        </span>
                      </div>
                    )}

                    {user.preferences.style.length > 0 && (
                      <div>
                        <p className="text-white/60 text-sm mb-2">Style Preferences:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.style.map(style => (
                            <span
                              key={style}
                              className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="group w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white py-5 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-between shadow-2xl hover:shadow-blue-500/25 border border-blue-400/30 backdrop-blur-xl"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Edit className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Edit Profile & Preferences</div>
                        <div className="text-sm text-white/70">Update your personal information</div>
                      </div>
                     </div>
                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </motion.button>

                  <motion.button
                    onClick={() => {/* Navigate to settings */}}
                    className="group w-full bg-gradient-to-r from-gray-600 via-slate-700 to-gray-800 hover:from-gray-700 hover:via-slate-800 hover:to-gray-900 text-white py-5 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-between shadow-2xl hover:shadow-gray-500/25 border border-gray-400/30 backdrop-blur-xl"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Settings</div>
                        <div className="text-sm text-white/70">Manage app preferences</div>
                      </div>
                     </div>
                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </motion.button>

                   <motion.button
                     onClick={handleLogout}
                    className="group w-full bg-gradient-to-r from-red-500 via-rose-600 to-red-700 hover:from-red-600 hover:via-rose-700 hover:to-red-800 text-white py-5 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-between shadow-2xl hover:shadow-red-500/25 border border-red-400/30 backdrop-blur-xl"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Sign Out</div>
                        <div className="text-sm text-white/70">End your current session</div>
                      </div>
                     </div>
                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </motion.button>
                 </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;