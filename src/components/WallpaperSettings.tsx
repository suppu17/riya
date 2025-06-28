import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';

const WallpaperSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();

  // Wallpaper settings functionality has been moved to the main Settings page
  // This component is no longer needed as a standalone settings button
  return null;
};

export default WallpaperSettings;