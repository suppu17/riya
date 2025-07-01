import React, { useState } from "react";
import { MoreVertical, Download, Share, Heart } from "lucide-react";
import { motion } from "motion/react";

interface PhotoItem {
  id: string;
  url: string;
  title: string;
}

const PhotoGridTest: React.FC = () => {
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);

  // Sample photos for testing
  const photos: PhotoItem[] = [
    {
      id: "1",
      url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(3).png",
      title: "AI Fashion Look 1"
    },
    {
      id: "2", 
      url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(4).png",
      title: "AI Fashion Look 2"
    },
    {
      id: "3",
      url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(5).png", 
      title: "AI Fashion Look 3"
    },
    {
      id: "4",
      url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/Created+/output_0+(6).png",
      title: "AI Fashion Look 4"
    }
  ];

  const handleDownload = async (photo: PhotoItem) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${photo.title.replace(/\s+/g, "_")}_${photo.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setShowMenu(null);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleShare = (photo: PhotoItem, platform?: string) => {
    const shareText = `Check out this amazing AI-generated outfit: ${photo.title}! #AIFashion #Style`;
    const shareUrl = photo.url;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank"
      );
    } else if (platform === "copy") {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShowShareMenu(null);
      setShowMenu(null);
    } else {
      // Native share API
      if (navigator.share) {
        navigator.share({
          title: "AI Fashion Creation",
          text: shareText,
          url: shareUrl,
        });
      } else {
        setShowShareMenu(photo.id);
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <h3 className="text-xl font-semibold text-white mb-4">My AI Fashion Photos</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="relative group cursor-pointer bg-black/20 rounded-lg overflow-hidden aspect-square"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Photo Image */}
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Three Dots Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(showMenu === photo.id ? null : photo.id);
                setShowShareMenu(null);
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Action Menu */}
            {showMenu === photo.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-12 right-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 min-w-[140px] z-10"
              >
                <button
                  onClick={() => handleDownload(photo)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => handleShare(photo)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  <Share className="w-4 h-4" />
                  Share
                </button>
              </motion.div>
            )}

            {/* Share Submenu */}
            {showShareMenu === photo.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-12 right-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 p-2 min-w-[120px] z-20"
              >
                <button
                  onClick={() => handleShare(photo, "copy")}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => handleShare(photo, "twitter")}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleShare(photo, "facebook")}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm transition-colors"
                >
                  Facebook
                </button>
              </motion.div>
            )}

            {/* Photo Title */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium truncate">{photo.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Click outside to close menus */}
      {(showMenu || showShareMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowMenu(null);
            setShowShareMenu(null);
          }}
        />
      )}
    </div>
  );
};

export default PhotoGridTest;