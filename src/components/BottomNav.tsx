import React from "react";
import { Home, Camera, Settings, ShoppingBag } from "lucide-react";

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
}) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "photos", icon: Camera, label: "Photos" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "cart", icon: ShoppingBag, label: "Cart" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-t-3xl z-30">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                isActive ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
