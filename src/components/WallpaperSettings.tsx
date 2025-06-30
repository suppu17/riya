import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';

const WallpaperSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 z-50"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Wallpaper Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map((wallpaper) => (
                <div
                  key={wallpaper.id}
                  onClick={() => setWallpaper(wallpaper.url)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 aspect-[16/9] ${
                    currentWallpaper === wallpaper.url 
                      ? 'border-white/50 ring-2 ring-white/30' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img 
                    src={wallpaper.url} 
                    alt={wallpaper.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {currentWallpaper === wallpaper.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2">
                    <h3 className="text-white text-sm font-medium">{wallpaper.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WallpaperSettings;