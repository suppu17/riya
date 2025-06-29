import React from "react";
import {
  User,
  Settings,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Download,
  Share2,
  Eye,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useShopping } from "../../contexts/ShoppingContext";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";
import TopNavigationBar from "../home/TopNavigationBar";

const ProfilePage: React.FC = () => {
  const { generatedImages, deleteGeneratedImage } = useShopping();
  const { isPremium, setIsPremium } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const stats = [
    { label: "Orders", value: "23", icon: Package },
    { label: "Wishlist", value: "14", icon: Heart },
    {
      label: "Generated Images",
      value: generatedImages.length.toString(),
      icon: Eye,
    },
  ];

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TopNavigationBar />
      </motion.div>

      <motion.div
        className="grid grid-cols-12 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left Sidebar */}
        <motion.div
          className="col-span-3 space-y-4"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Profile Header */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 h-fit overflow-hidden"
            whileHover={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderColor: "rgba(255, 255, 255, 0.25)",
            }}
          >
            {/* Cover Image Section */}
            <motion.div
              className="relative h-48 overflow-hidden"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {/* Background Image */}
              {generatedImages.length > 0 ? (
                <div className="absolute inset-0">
                  <img
                    src={generatedImages[generatedImages.length - 1].url}
                    alt="Profile Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}
            </motion.div>

            {/* Profile Info Section */}
            <motion.div
              className="p-6 pt-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  Supriya Korukonda
                </h2>
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Premium Member
                </p>

                <div className="text-white/60 text-sm mt-4">
                  <p className="leading-relaxed">
                    Hi! I'm passionate about fashion and technology. I love
                    exploring new styles and creating unique looks using AI.
                    When I'm not experimenting with virtual try-ons, you can
                    find me discovering new fashion trends and sharing style
                    tips.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span>New York, USA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <span>Joined 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + index * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-white/80" />
                      </div>
                      <span className="text-white/80 text-sm">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-white font-semibold">
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Content - Generated Images Gallery */}
        <motion.div
          className="col-span-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="text-white/80 text-lg font-semibold">
                My Generated Images
              </h3>
              <div className="text-sm text-white/60">
                {generatedImages.length} images
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {generatedImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Product thumbnail reference */}
                    {image.productImage && (
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30 bg-white/10 backdrop-blur-sm">
                        <img
                          src={image.productImage}
                          alt={`${image.productName} reference`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedImageIndex(index)}
                          className="p-2 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-colors">
                          <Download className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-colors">
                          <Share2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGeneratedImage(image.id);
                          }}
                          className="p-2 bg-red-500/20 backdrop-blur-xl rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image info */}
                  <div className="p-3">
                    <h4 className="font-medium text-white text-sm mb-1 truncate">
                      {image.productName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      {image.modelUsed}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {generatedImages.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Eye className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h4 className="text-white/60 font-medium mb-2">
                  No generated images yet
                </h4>
                <p className="text-white/40 text-sm">
                  Start trying on products to see your generated images here!
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          className="col-span-3 space-y-6"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Account Settings */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h3
              className="text-white/80 text-lg font-semibold mb-6"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              Account Settings
            </motion.h3>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              {[
                {
                  icon: User,
                  label: "Personal Information",
                  desc: "Update your profile details",
                },
                {
                  icon: CreditCard,
                  label: "Payment Methods",
                  desc: "Manage your payment options",
                },
                {
                  icon: MapPin,
                  label: "Addresses",
                  desc: "Your delivery addresses",
                },
                {
                  icon: Settings,
                  label: "Privacy Settings",
                  desc: "Control your privacy",
                },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  className="w-full flex items-center gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-white text-sm">
                      {item.label}
                    </h4>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>



          {/* Recent Activity */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-white/80 text-lg font-semibold mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                {
                  action: "Generated new image",
                  time: "2 hours ago",
                  icon: Eye,
                },
                { 
                  action: "Manage Subscriptions", 
                  time: "1 day ago", 
                  icon: CreditCard,
                  isPremiumSection: true
                },
                {
                  action: "Added to wishlist",
                  time: "3 days ago",
                  icon: Heart,
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className={`p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 ${
                    activity.isPremiumSection ? 'space-y-3' : 'flex items-center gap-3'
                  }`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                  {...(activity.action === "Manage Subscriptions" && { "data-subscription-section": true })}
                >
                  {activity.isPremiumSection ? (
                    <>
                      {/* Manage Subscriptions Header - Clickable */}
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="flex items-center gap-3 w-full text-left hover:bg-white/5 rounded-lg p-2 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                          <activity.icon className="w-4 h-4 text-white/80" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/80 text-sm">{activity.action}</p>
                          <p className="text-white/50 text-xs">{activity.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/50" />
                      </button>
                      
                      {/* Current Plan Status */}
                      <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isPremium ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-white/10'
                          }`}>
                            <Star className={`w-4 h-4 ${
                              isPremium ? 'text-white' : 'text-white/60'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-xs">
                              {isPremium ? 'Premium Member' : 'Free Member'}
                            </h4>
                            <p className="text-xs text-white/50">
                              {isPremium ? 'All features unlocked' : 'Limited features'}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          isPremium 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {isPremium ? 'Active' : 'Basic'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-white/80" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/80 text-sm">{activity.action}</p>
                        <p className="text-white/50 text-xs">{activity.time}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {generatedImages[selectedImageIndex].productName}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    Created on{" "}
                    {new Date(
                      generatedImages[selectedImageIndex].createdAt
                    ).toLocaleDateString()}{" "}
                    • {generatedImages[selectedImageIndex].modelUsed}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="p-2 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="relative bg-white/5 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={generatedImages[selectedImageIndex].url}
                    alt={generatedImages[selectedImageIndex].productName}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex > 0
                            ? selectedImageIndex - 1
                            : generatedImages.length - 1
                        )
                      }
                      className="p-2 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <span className="px-3 py-2 bg-white/10 backdrop-blur-xl rounded-xl text-white text-sm">
                      {selectedImageIndex + 1} / {generatedImages.length}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex < generatedImages.length - 1
                            ? selectedImageIndex + 1
                            : 0
                        )
                      }
                      className="p-2 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSubscriptionModal(false)}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Subscription Plans</h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Subscription Plans */}
            <div className="space-y-4">
              {/* Free Plan */}
              <div className={`p-4 rounded-xl border transition-all duration-200 ${
                !isPremium 
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gray-500/20 rounded-full">
                      <span className="text-xs font-medium text-white/80">FREE</span>
                    </div>
                    {!isPremium && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">$0</div>
                    <div className="text-xs text-white/50">per month</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    <span>Basic AI Try-On (5 per day)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    <span>Standard resolution images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    <span>Basic product catalog</span>
                  </div>
                </div>
                {!isPremium ? (
                  <div className="mt-3 px-3 py-1.5 bg-green-500/20 rounded-lg text-center">
                    <span className="text-xs font-medium text-green-300">Current Plan</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsPremium(false);
                      setShowSubscriptionModal(false);
                    }}
                    className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg text-xs font-medium text-white transition-all duration-200"
                  >
                    Downgrade to Free
                  </button>
                )}
              </div>

              {/* Premium Plan */}
              <div className={`p-4 rounded-xl border transition-all duration-200 ${
                isPremium 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                      <span className="text-xs font-medium text-white">PREMIUM</span>
                    </div>
                    {isPremium && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">$9.99</div>
                    <div className="text-xs text-white/50">per month</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <span>Unlimited AI Try-On</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <span>High-resolution images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <span>Premium product catalog</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <span>Priority support</span>
                  </div>
                </div>
                {isPremium ? (
                  <div className="mt-3 space-y-2">
                    <div className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-center">
                      <span className="text-xs font-medium text-yellow-300">Current Plan</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsPremium(false);
                        setShowSubscriptionModal(false);
                      }}
                      className="w-full px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-xs font-medium text-white transition-all duration-200"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsPremium(true);
                      setShowSubscriptionModal(false);
                    }}
                    className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg text-xs font-medium text-white transition-all duration-200"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>

              {/* Premium Plus Plan */}
              <div className="p-4 rounded-xl border bg-white/5 border-white/10 hover:border-white/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <span className="text-xs font-medium text-white">PREMIUM+</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">$19.99</div>
                    <div className="text-xs text-white/50">per month</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>Everything in Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>4K ultra-high resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>Exclusive designer collections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>Advanced AI customization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span>24/7 dedicated support</span>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <button 
                    onClick={() => setShowSubscriptionModal(false)}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-lg text-xs font-medium text-white transition-all duration-200"
                  >
                    Upgrade to Premium+
                  </button>
                  {isPremium && (
                    <button
                      onClick={() => {
                        setIsPremium(false);
                        setShowSubscriptionModal(false);
                      }}
                      className="w-full px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg text-xs font-medium text-white transition-all duration-200"
                    >
                      Cancel & Downgrade to Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;