import React, { createContext, useContext, useState, ReactNode } from "react";

interface WallpaperContextType {
  currentWallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  wallpapers: { id: string; name: string; url: string }[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(
  undefined
);

const wallpapers = [
  {
    id: "luxury-living",
    name: "Luxury Living Room",
    url: "https://cdn.midjourney.com/53ba0ea5-ebe4-41de-b24e-bea50de22b17/0_0.png",
  },
  {
    id: "modern-apartment",
    name: "Modern Apartment",
    url: "https://cdn.midjourney.com/fc57f582-fdd5-4cfc-b3fc-a677709cda82/0_0.png",
  },
  {
    id: "white-interior",
    name: "White Interior",
    url: "https://cdn.midjourney.com/8cc34dd7-3dc9-4024-b871-2eb973ad742a/0_0.png",
  },
  {
    id: "minimalist",
    name: "Minimalist Space",
    url: "https://cdn.midjourney.com/d06635dc-bdda-421b-bff8-f0780c38f03e/0_0.png",
  },
  {
    id: "cozy-home",
    name: "Cozy Home",
    url: "https://cdn.midjourney.com/ebeb2c8e-6a92-495b-aed0-08868d11c738/0_2.png",
  },
  {
    id: "cozy-home",
    name: "Cozy Home",
    url: "https://cdn.midjourney.com/56baa031-637c-4565-8da1-3807ce240933/0_0.png",
  },
  {
    id: "cozy-home",
    name: "Cozy Home",
    url: "https://cdn.midjourney.com/3f3a4c53-60cd-4421-969d-d604e173fdb2/0_0.png",
  },
  {
    id: "cozy-home",
    name: "Cozy Home",
    url: "https://cdn.midjourney.com/82b7954f-6304-4296-957e-161fe141e0fd/0_1.png",
  },
];

export const WallpaperProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load wallpaper from localStorage or use default
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    try {
      const savedWallpaper = localStorage.getItem('selectedWallpaper');
      return savedWallpaper || wallpapers[0].url;
    } catch (error) {
      console.error('Error loading wallpaper from localStorage:', error);
      return wallpapers[0].url;
    }
  });

  const setWallpaper = (wallpaper: string) => {
    try {
      // Save to localStorage
      localStorage.setItem('selectedWallpaper', wallpaper);
      setCurrentWallpaper(wallpaper);
    } catch (error) {
      console.error('Error saving wallpaper to localStorage:', error);
      // Still update the state even if localStorage fails
      setCurrentWallpaper(wallpaper);
    }
  };

  return (
    <WallpaperContext.Provider
      value={{
        currentWallpaper,
        setWallpaper,
        wallpapers,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
};
