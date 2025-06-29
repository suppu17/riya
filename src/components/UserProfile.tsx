import React, { useState } from 'react';
import { User, LogOut, Settings, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setUpdateMessage('');
  };

  const handleSave = async () => {
    if (!user) return;

    setIsUpdating(true);
    const result = await updateProfile({
      name: editData.name,
      email: editData.email
    });

    if (result.success) {
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } else {
      setUpdateMessage(result.error || 'Failed to update profile');
    }
    setIsUpdating(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

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
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 w-full max-w-md shadow-2xl"
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

            {/* Profile Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
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
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{user.name}</h3>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <p className="text-white/40 text-xs mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
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
                  />
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
                        Save
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
              /* Action Buttons */
              <div className="space-y-4">
                <button
                  onClick={handleEdit}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
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
            )}

            {/* User Stats */}
            {!isEditing && user.preferences && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white/80 font-medium mb-4">Preferences</h4>
                <div className="space-y-2 text-sm">
                  {user.preferences.favoriteCategories.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Favorite Categories:</span>
                      <span className="text-white">{user.preferences.favoriteCategories.join(', ')}</span>
                    </div>
                  )}
                  {user.preferences.size && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Size:</span>
                      <span className="text-white">{user.preferences.size}</span>
                    </div>
                  )}
                  {user.preferences.style.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Style:</span>
                      <span className="text-white">{user.preferences.style.join(', ')}</span>
                    </div>
                  )}
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