import React, { useState } from 'react';
import { User, LogOut, Settings, Edit3, Save, X, Heart, Star, Package } from 'lucide-react';
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
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar and Basic Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              
              {!isEditing && (
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{user.name}</h3>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <p className="text-white/40 text-xs mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-white/80">12 Favorites</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80">8 Orders</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80">Premium</span>
                    </div>
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
                              ? 'bg-pink-500/30 text-pink-200 border border-pink-400/50'
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
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
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
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
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
                              className="px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-sm border border-pink-400/30"
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
                  <button
                    onClick={handleEdit}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile & Preferences
                  </button>

                  <button
                    onClick={() => {/* Navigate to settings */}}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
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