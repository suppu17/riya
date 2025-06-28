import React, { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  Mic,
  Bell,
  Shield,
  Palette,
  Bot,
  Image,
  Check,
} from "lucide-react";
import AgentSettings from "../AgentSettings";
import { useWallpaper } from "../../contexts/WallpaperContext";
import { useTheme } from "../../contexts/ThemeContext";

const SettingsPage: React.FC = () => {
  const [showWallpaperSettings, setShowWallpaperSettings] = useState(false);
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();
  const { isDarkMode, toggleDarkMode, themePresets, setThemePreset, currentThemeIndex } = useTheme();

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-white/80" />
                  ) : (
                    <Sun className="w-5 h-5 text-white/80" />
                  )}
                  <span className="text-white">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                    isDarkMode ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${
                    isDarkMode ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-white/80" />
                  <span className="text-white">AI Theme Colors</span>
                </div>
                <div className="flex gap-2">
                  {themePresets.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => setThemePreset(index)}
                      className={`w-6 h-6 rounded-full transition-all duration-300 ${
                        currentThemeIndex === index 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
                      }}
                      title={`Theme ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-white/80" />
                    <span className="text-white">Wallpaper</span>
                  </div>
                  <button
                    onClick={() => setShowWallpaperSettings(!showWallpaperSettings)}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {showWallpaperSettings ? 'Hide' : 'Change'}
                  </button>
                </div>
                
                {showWallpaperSettings && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {wallpapers.map((wallpaper) => (
                      <div
                        key={wallpaper.id}
                        onClick={() => setWallpaper(wallpaper.url)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          currentWallpaper === wallpaper.url 
                            ? 'border-white/50 ring-2 ring-white/30' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img 
                          src={wallpaper.url} 
                          alt={wallpaper.name}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {currentWallpaper === wallpaper.url && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-1 left-1">
                          <h4 className="text-white text-xs font-medium">{wallpaper.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice AI "Riya" Configuration */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Voice AI "Riya" Configuration</h3>
            <AgentSettings />
          </div>

          {/* Audio & Voice */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Audio & Voice</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-white/80" />
                  <span className="text-white">Sound Effects</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-white/80" />
                  <span className="text-white">Voice Assistant</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-white/80" />
                  <span className="text-white">Push Notifications</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white/80" />
                  <span className="text-white">Security Alerts</span>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
