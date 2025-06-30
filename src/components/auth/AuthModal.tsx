import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  UserPlus,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: "login" | "signup";
}

type AuthMode = "login" | "signup" | "forgot-password";

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { login, signup, resetPassword, loginWithGoogle } = useAuth();

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    setErrors({});
    setSuccessMessage("");
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
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (for login and signup)
    if (mode !== "forgot-password") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (mode === "signup" && formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    // Name validation (for signup)
    if (mode === "signup") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
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
        case "login":
          result = await login(formData.email, formData.password);
          if (result.success) {
            setShowSuccess(true);
            setSuccessMessage("Welcome back! Redirecting to dashboard...");
            setTimeout(() => {
              onSuccess?.();
              onClose();
              resetForm();
            }, 1500);
          } else {
            // Enhanced error handling for login with user-friendly messages
            const errorMessage = result.error || "";

            if (
              errorMessage.includes("email or password") ||
              errorMessage.includes("incorrect") ||
              errorMessage.includes("invalid")
            ) {
              setErrors({
                submit: "❌ Incorrect email or password",
                hint: 'Please double-check your credentials. If you don\'t have an account, click "Sign up" below.',
                showSwitchToSignup: "true",
              });
            } else if (
              errorMessage.includes("confirm") ||
              errorMessage.includes("verification")
            ) {
              setErrors({
                submit: "📧 Please verify your email",
                hint: "Check your inbox for a verification email and click the link to activate your account.",
              });
            } else if (
              errorMessage.includes("too many") ||
              errorMessage.includes("wait")
            ) {
              setErrors({
                submit: "⏰ Too many attempts",
                hint: "Please wait a few minutes before trying again for security reasons.",
              });
            } else if (
              errorMessage.includes("network") ||
              errorMessage.includes("connection")
            ) {
              setErrors({
                submit: "🌐 Connection problem",
                hint: "Please check your internet connection and try again.",
              });
            } else if (
              errorMessage.includes("no account") ||
              errorMessage.includes("not found")
            ) {
              setErrors({
                submit: "👤 Account not found",
                hint: "No account exists with this email. Please sign up for a new account or check your email address.",
                showSwitchToSignup: "true",
              });
            } else {
              setErrors({
                submit: errorMessage || "Login failed",
                hint: "If this problem persists, please contact support.",
              });
            }
          }
          break;

        case "signup":
          result = await signup(
            formData.email,
            formData.password,
            formData.name
          );
          if (result.success) {
            setShowSuccess(true);
            setSuccessMessage(
              "Account created successfully! Welcome to SnapStyler!"
            );
            setTimeout(() => {
              onSuccess?.();
              onClose();
              resetForm();
            }, 1500);
          } else {
            // Enhanced error handling for signup - STAY ON MODAL
            const errorMessage = result.error || "";

            if (
              errorMessage.includes("already exists") ||
              errorMessage.includes("already registered") ||
              errorMessage.includes("user already")
            ) {
              setErrors({
                submit: "👤 Account already exists",
                hint: 'An account with this email already exists. Try signing in instead, or use "Forgot password" if needed.',
                showSwitchToLogin: "true",
              });
            } else if (
              errorMessage.includes("password") &&
              errorMessage.includes("security")
            ) {
              setErrors({
                submit: "🔒 Password too weak",
                hint: "Please choose a stronger password with at least 6 characters.",
              });
            } else if (errorMessage.includes("invalid email")) {
              setErrors({
                submit: "📧 Invalid email format",
                hint: "Please enter a valid email address.",
              });
            } else if (
              errorMessage.includes("disabled") ||
              errorMessage.includes("registration")
            ) {
              setErrors({
                submit: "🚫 Registration disabled",
                hint: "Account registration is currently disabled. Please contact support.",
              });
            } else {
              setErrors({
                submit: errorMessage || "Signup failed",
                hint: "Please try again or contact support if the problem persists.",
              });
            }
          }
          break;

        case "forgot-password":
          result = await resetPassword(formData.email);
          if (result.success) {
            setSuccessMessage(
              "Password reset instructions have been sent to your email."
            );
            setTimeout(() => {
              handleModeChange("login");
            }, 3000);
          } else {
            const errorMessage = result.error || "";

            if (
              errorMessage.includes("not found") ||
              errorMessage.includes("no account")
            ) {
              setErrors({
                submit: "👤 Account not found",
                hint: "No account exists with this email address. Please check the email or sign up for a new account.",
                showSwitchToSignup: "true",
              });
            } else if (errorMessage.includes("too many")) {
              setErrors({
                submit: "⏰ Too many requests",
                hint: "Please wait a few minutes before requesting another password reset.",
              });
            } else {
              setErrors({
                submit: errorMessage || "Failed to send reset email",
                hint: "Please check that the email address is correct and try again.",
              });
            }
          }
          break;
      }
    } catch (error) {
      setErrors({
        submit: "🚨 Unexpected error occurred",
        hint: "Please try again. If the problem persists, contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        // OAuth redirect will handle the rest
        setSuccessMessage("Redirecting to Google...");
      } else {
        setErrors({
          submit: result.error || "Google sign-in failed",
          hint: "Please try again or use email/password login instead.",
        });
      }
    } catch (error) {
      setErrors({
        submit: "🚨 Google sign-in error",
        hint: "Please try again or use email/password login instead.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear submit errors when user starts typing
    if (errors.submit || errors.hint) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        delete newErrors.hint;
        delete newErrors.showSwitchToLogin;
        delete newErrors.showSwitchToSignup;
        return newErrors;
      });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "SnapStyler";
      case "forgot-password":
        return "Reset Password";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Sign in to your account";
      case "signup":
        return "Create your AI fashion account";
      case "forgot-password":
        return "Enter your email to reset password";
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
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass Morphism Container with Blue Tints */}
            <div className="relative w-full h-full bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-[3rem] overflow-hidden shadow-2xl flex">
              {/* Gradient Overlays with Blue Tones */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-teal-600/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-cyan-800/10" />

              {/* Left Section - Authentication */}
              <div className="relative z-10 w-1/2 flex flex-col justify-center p-12">
                {/* Header */}
                <div className="mb-8">
                  {/* Back Button for Forgot Password */}
                  {mode === "forgot-password" && (
                    <motion.button
                      onClick={() => handleModeChange("login")}
                      className="absolute top-8 left-8 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-cyan-100/10"
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
                    className="absolute top-8 right-8 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-cyan-100/10"
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
                    <p className="text-white/70 text-sm">{getSubtitle()}</p>
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
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full" />
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
                      <div className="w-2 h-2 bg-cyan-300/60 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-cyan-300/60 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-cyan-300/60 rounded-full animate-pulse delay-200" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    {/* Success Message */}
                    {successMessage && !showSuccess && (
                      <motion.div
                        className="mb-6 p-4 bg-cyan-500/20 border border-cyan-400/30 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <CheckCircle className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                        <p className="text-cyan-200 text-sm">
                          {successMessage}
                        </p>
                      </motion.div>
                    )}

                    {/* Google Sign In Button */}
                    {mode !== "forgot-password" && (
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.button
                          onClick={handleGoogleLogin}
                          disabled={isSubmitting}
                          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 px-6 text-white font-medium hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-3 group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              Continue with Google
                            </>
                          )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-white/60">
                              or
                            </span>
                          </div>
                        </div>
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
                      {mode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Full Name
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${
                                  errors.name
                                    ? "border-red-500/50"
                                    : "border-cyan-200/20"
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
                        transition={{ delay: mode === "signup" ? 0.6 : 0.5 }}
                      >
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Email Address
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${
                                errors.email
                                  ? "border-red-500/50"
                                  : "border-cyan-200/20"
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
                      {mode !== "forgot-password" && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: mode === "signup" ? 0.7 : 0.6 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) =>
                                  handleInputChange("password", e.target.value)
                                }
                                className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${
                                  errors.password
                                    ? "border-red-500/50"
                                    : "border-cyan-200/20"
                                }`}
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
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
                      {mode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Confirm Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                              <input
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                  handleInputChange(
                                    "confirmPassword",
                                    e.target.value
                                  )
                                }
                                className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${
                                  errors.confirmPassword
                                    ? "border-red-500/50"
                                    : "border-cyan-200/20"
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

                      {/* Enhanced Submit Error Display */}
                      {errors.submit && (
                        <motion.div
                          className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm space-y-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-red-300 text-sm font-medium">
                                {errors.submit}
                              </p>

                              {/* Additional helpful hint */}
                              {errors.hint && (
                                <div className="mt-2 pt-2 border-t border-red-500/20">
                                  <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-red-300/80 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-200/90 text-xs leading-relaxed">
                                      {errors.hint}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Quick action buttons */}
                              <div className="mt-3 pt-2 border-t border-red-500/20 flex gap-3">
                                {errors.showSwitchToLogin &&
                                  mode === "signup" && (
                                    <button
                                      type="button"
                                      onClick={() => handleModeChange("login")}
                                      className="inline-flex items-center gap-1 text-xs text-red-200 hover:text-red-100 underline transition-colors"
                                    >
                                      <LogIn className="w-3 h-3" />
                                      Switch to Sign In
                                    </button>
                                  )}

                                {errors.showSwitchToSignup &&
                                  (mode === "login" ||
                                    mode === "forgot-password") && (
                                    <button
                                      type="button"
                                      onClick={() => handleModeChange("signup")}
                                      className="inline-flex items-center gap-1 text-xs text-red-200 hover:text-red-100 underline transition-colors"
                                    >
                                      <UserPlus className="w-3 h-3" />
                                      Create Account
                                    </button>
                                  )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Submit Button - Cyan Glass morphism style */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 disabled:from-cyan-500/10 disabled:to-blue-500/10 backdrop-blur-xl border border-cyan-300/30 hover:border-cyan-300/50 disabled:border-cyan-300/20 text-white font-semibold rounded-2xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Cyan morphism glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {mode === "login"
                                ? "Signing In..."
                                : mode === "signup"
                                ? "Creating Account..."
                                : "Sending Email..."}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              {mode === "login"
                                ? "Sign In"
                                : mode === "signup"
                                ? "Create Account"
                                : "Send Reset Email"}
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
                      {mode === "login" && (
                        <>
                          <button
                            onClick={() => handleModeChange("forgot-password")}
                            className="text-white/60 hover:text-white text-sm transition-colors hover:underline"
                          >
                            Forgot your password?
                          </button>
                          <div className="text-white/60 text-sm">
                            Don't have an account?{" "}
                            <button
                              onClick={() => handleModeChange("signup")}
                              className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors hover:underline"
                            >
                              Sign up
                            </button>
                          </div>
                        </>
                      )}

                      {mode === "signup" && (
                        <div className="text-white/60 text-sm">
                          Already have an account?{" "}
                          <button
                            onClick={() => handleModeChange("login")}
                            className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors hover:underline"
                          >
                            Sign in
                          </button>
                        </div>
                      )}

                      {/* Helpful Tips Section */}
                      <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <p className="text-cyan-300 text-xs font-medium">
                            {mode === "login"
                              ? "Having trouble signing in?"
                              : mode === "signup"
                              ? "Creating your account"
                              : "Password reset help"}
                          </p>
                        </div>
                        <p className="text-cyan-200/80 text-xs">
                          {mode === "login"
                            ? "Make sure your email and password are correct, or create a new account if you're new here."
                            : mode === "signup"
                            ? "Choose a strong password and make sure your email is correct for account verification."
                            : "Check your email (including spam folder) for password reset instructions."}
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Right Section - Custom Image */}
              <div className="relative w-1/2 overflow-hidden">
                {/* Custom Image Background */}
                <img
                  src="https://cdn.midjourney.com/39d6ab8a-ced7-415e-9089-9ba8239780e3/0_0.png"
                  alt="Login Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Minimal Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-900/5 to-cyan-900/10" />
              </div>

              {/* Floating Particles with Cyan Glow */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-300/30 rounded-full"
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

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};

export default AuthModal;
