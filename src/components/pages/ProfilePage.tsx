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
import { useState } from "react";
import TopNavigationBar from "../home/TopNavigationBar";

const ProfilePage: React.FC = () => {
  const { generatedImages, deleteGeneratedImage } = useShopping();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

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
                { action: "Updated profile", time: "1 day ago", icon: User },
                {
                  action: "Added to wishlist",
                  time: "3 days ago",
                  icon: Heart,
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <activity.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{activity.action}</p>
                    <p className="text-white/50 text-xs">{activity.time}</p>
                  </div>
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
    </motion.div>
  );
};

export default ProfilePage;
