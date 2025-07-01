import React from "react";
import { X, Play } from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-title"
    >
      <div className="relative w-[90vw] max-w-4xl h-[90vh] max-h-[600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Play className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2
                id="demo-video-title"
                className="text-lg font-semibold text-white"
              >
                Product Demo
              </h2>
              <p className="text-sm text-white/70">See SnapStyler in action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Close demo video"
            tabIndex={0}
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Video Content */}
        <div className="relative w-full h-[calc(100%-80px)]">
          <iframe
            src="https://www.youtube.com/embed/9yQzZdF8qgs?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1"
            title="SnapStyler - The next era of online Shopping | Product Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
