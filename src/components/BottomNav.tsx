import React, { useState } from "react";
import { Home, Camera, Settings, ShoppingBag, Check, User } from "lucide-react";
import { useShopping } from "../contexts/ShoppingContext";
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
  const [isModelOverlayOpen, setIsModelOverlayOpen] = useState(false);
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "photos", icon: Camera, label: "Photos" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "cart", icon: ShoppingBag, label: "Cart" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-t-3xl z-30">
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "photos") {
                    setIsModelOverlayOpen(true);
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
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
