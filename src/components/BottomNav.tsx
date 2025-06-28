import React, { useState } from "react";
import { Home, Camera, Settings, ShoppingBag, Check, User } from "lucide-react";
import { useShopping } from "../contexts/ShoppingContext";
import { useTheme } from "../contexts/ThemeContext";
import ModelOverlay from "./ModelOverlay";

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { selectedModelId } = useShopping();
  const { isDarkMode, currentTheme } = useTheme();
  const [isModelOverlayOpen, setIsModelOverlayOpen] = useState(false);
  const [navItems, setNavItems] = useState([
    { id: "home", icon: Home, label: "Home" },
    { id: "photos", icon: Camera, label: "Photos" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "cart", icon: ShoppingBag, label: "Cart" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = navItems.findIndex(item => item.id === draggedItem);
    const targetIndex = navItems.findIndex(item => item.id === targetId);

    const newNavItems = [...navItems];
    const [draggedItemData] = newNavItems.splice(draggedIndex, 1);
    newNavItems.splice(targetIndex, 0, draggedItemData);

    setNavItems(newNavItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <>
      <div 
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-16 backdrop-blur-xl rounded-t-3xl z-30 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-black/10 border border-black/20'
        }`}
        style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : `linear-gradient(135deg, ${currentTheme.surface}20, ${currentTheme.primary}10)`
        }}
      >
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (item.id === "photos") {
                    setIsModelOverlayOpen(true);
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-move ${
                  isActive 
                    ? isDarkMode ? "text-white" : "text-gray-800"
                    : isDarkMode ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-800"
                } ${
                  draggedItem === item.id ? "opacity-50 scale-95" : ""
                }`}
                style={{
                  color: isActive ? currentTheme.primary : undefined
                }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
                {item.id === "photos" && selectedModelId && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Render ModelOverlay at the top level */}
      <ModelOverlay 
        isOpen={isModelOverlayOpen} 
        onClose={() => setIsModelOverlayOpen(false)} 
      />
    </>
  );
};

export default BottomNav;
