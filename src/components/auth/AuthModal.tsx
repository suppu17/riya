import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { login, signup, resetPassword } = useAuth();

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setErrors({});
    setSuccessMessage('');
    setIsSubmitting(false);
    setShowSuccess(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (for login and signup)
    if (mode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup' && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    // Name validation (for signup)
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let result;

      switch (mode) {
        case 'login':
          result = await login(formData.email, formData.password);
          if (result.success) {
            setShowSuccess(true);
            setSuccessMessage('Welcome back! Redirecting to dashboard...');
            setTimeout(() => {
              onSuccess?.();
              onClose();
              resetForm();
            }, 1500);
          } else {
            setErrors({ submit: result.error || 'Login failed' });
          }
          break;

        case 'signup':
          result = await signup(formData.email, formData.password, formData.name);
          if (result.success) {
            setShowSuccess(true);
            setSuccessMessage('Account created successfully! Welcome to Riya!');
            setTimeout(() => {
              onSuccess?.();
              onClose();
              resetForm();
            }, 1500);
          } else {
            setErrors({ submit: result.error || 'Signup failed' });
          }
          break;

        case 'forgot-password':
          result = await resetPassword(formData.email);
          if (result.success) {
            setSuccessMessage('Password reset instructions have been sent to your email.');
            setTimeout(() => {
              handleModeChange('login');
            }, 3000);
          } else {
            setErrors({ submit: result.error || 'Failed to send reset email' });
          }
          break;
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join Riya';
      case 'forgot-password': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to your account';
      case 'signup': return 'Create your AI fashion account';
      case 'forgot-password': return 'Enter your email to reset password';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !showSuccess) {
              onClose();
            }
          }}
        >
          {/* Main Container - Split Layout */}
          <motion.div
            className="relative w-full max-w-6xl h-[90vh] max-h-[800px]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass Morphism Container */}
            <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] overflow-hidden shadow-2xl flex">
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-400/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

              {/* Left Section - Authentication */}
              <div className="relative z-10 w-1/2 flex flex-col justify-center p-12">
                {/* Header */}
                <div className="mb-8">
                  {/* Logo */}
                  <motion.div
                    className="mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                  >
                    <div className="text-4xl font-light text-white tracking-wider">
                      riya
                    </div>
                  </motion.div>

                  {/* Back Button for Forgot Password */}
                  {mode === 'forgot-password' && (
                    <motion.button
                      onClick={() => handleModeChange('login')}
                      className="absolute top-8 left-8 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                  )}

                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-light text-white mb-2 tracking-wide">
                      {getTitle()}
                    </h2>
                    <p className="text-white/70 text-sm">
                      {getSubtitle()}
                    </p>
                  </motion.div>
                </div>

                {/* Success State */}
                {showSuccess ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="relative w-20 h-20 mx-auto mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full" />
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>
                    
                    <motion.h2 
                      className="text-3xl font-light text-white mb-3 tracking-wide"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Success!
                    </motion.h2>
                    
                    <motion.p 
                      className="text-white/80 text-lg mb-8"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {successMessage}
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    {/* Success Message */}
                    {successMessage && !showSuccess && (
                      <motion.div
                        className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <p className="text-green-300 text-sm">{successMessage}</p>
                      </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {/* Name Field (Signup only) */}
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Full Name
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${
                                  errors.name ? 'border-red-500/50' : 'border-white/20'
                                }`}
                                placeholder="Enter your full name"
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>
                          {errors.name && (
                            <motion.p
                              className="text-red-400 text-xs mt-2 flex items-center gap-1"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.name}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Email Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: mode === 'signup' ? 0.6 : 0.5 }}
                      >
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Email Address
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${
                                errors.email ? 'border-red-500/50' : 'border-white/20'
                              }`}
                              placeholder="Enter your email"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                        {errors.email && (
                          <motion.p
                            className="text-red-400 text-xs mt-2 flex items-center gap-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Password Field (not for forgot password) */}
                      {mode !== 'forgot-password' && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: mode === 'signup' ? 0.7 : 0.6 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${
                                  errors.password ? 'border-red-500/50' : 'border-white/20'
                                }`}
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          {errors.password && (
                            <motion.p
                              className="text-red-400 text-xs mt-2 flex items-center gap-1"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.password}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Confirm Password Field (Signup only) */}
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Confirm Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all ${
                                  errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
                                }`}
                                placeholder="Confirm your password"
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>
                          {errors.confirmPassword && (
                            <motion.p
                              className="text-red-400 text-xs mt-2 flex items-center gap-1"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.confirmPassword}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Submit Error */}
                      {errors.submit && (
                        <motion.div
                          className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <p className="text-red-300 text-sm">{errors.submit}</p>
                        </motion.div>
                      )}

                      {/* Submit Button - Glass morphism style */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full py-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-xl border border-white/30 hover:border-white/50 disabled:border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Glass morphism glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {mode === 'login' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Sending Email...'}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
                            </>
                          )}
                        </div>
                      </motion.button>
                    </motion.form>

                    {/* Footer Links */}
                    <motion.div
                      className="mt-8 text-center space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      {mode === 'login' && (
                        <>
                          <button
                            onClick={() => handleModeChange('forgot-password')}
                            className="text-white/60 hover:text-white text-sm transition-colors hover:underline"
                          >
                            Forgot your password?
                          </button>
                          <div className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <button
                              onClick={() => handleModeChange('signup')}
                              className="text-pink-400 hover:text-pink-300 font-medium transition-colors hover:underline"
                            >
                              Sign up
                            </button>
                          </div>
                        </>
                      )}

                      {mode === 'signup' && (
                        <div className="text-white/60 text-sm">
                          Already have an account?{' '}
                          <button
                            onClick={() => handleModeChange('login')}
                            className="text-pink-400 hover:text-pink-300 font-medium transition-colors hover:underline"
                          >
                            Sign in
                          </button>
                        </div>
                      )}

                      {/* Powered by Supabase */}
                      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <p className="text-blue-300 text-xs font-medium">Powered by Supabase</p>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500" />
                        </div>
                        <p className="text-blue-200/80 text-xs">
                          Secure authentication with real-time database
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Right Section - Video */}
              <div className="relative w-1/2 overflow-hidden">
                {/* Video Background */}
                <video
                  src="https://cdn.midjourney.com/video/e50e647d-a74e-4b29-aa82-b418ac1fff63/3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/30" />
                
                {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-12">
                  {/* Top Right - Menu and Number */}
                  <div className="flex justify-between items-start">
                    <div className="text-white/80 text-sm font-light">+ menu</div>
                    <div className="text-6xl font-light text-white/90">01</div>
                  </div>

                  {/* Center Content */}
                  <div className="text-center">
                    <motion.h1 
                      className="text-4xl font-light text-white leading-tight tracking-wide mb-4"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      EXHIBITION<br />
                      OF CONTEMPORARY<br />
                      PHOTOGRAPHS
                    </motion.h1>
                    
                    {/* Large S Logo */}
                    <motion.div 
                      className="text-8xl font-light text-white/90 my-8"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      S
                    </motion.div>
                    
                    <motion.p 
                      className="text-white/80 text-sm leading-relaxed max-w-md mx-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    >
                      Watch our showreel to learn more about the exhibition. It was created by creative people to reflect the modern vision of the photographer, to observe trends and realities. Get your dose of inspiration from our top photographers.
                    </motion.p>
                  </div>

                  {/* Bottom Right - Hash Number */}
                  <div className="flex justify-end">
                    <div className="text-6xl font-light text-white/90">#9</div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: `${20 + (i % 4) * 20}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};

export default AuthModal;