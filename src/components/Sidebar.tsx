import React from 'react';
import { Home, Search, Settings, ShoppingBag, Heart, User, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'categories', icon: Zap, label: 'Categories' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 space-y-6">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-8">
        <ShoppingBag className="w-6 h-6 text-white" />
      </div>
      
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${isActive 
                ? 'bg-white/20 text-white shadow-lg shadow-purple-500/25' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;