import React from "react";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

interface MainContentProps {
  currentView: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const renderPage = () => {
    switch (currentView) {
      case "home":
        return <HomePage />;
      case "search":
        return <SearchPage />;
      case "categories":
        return <CategoriesPage />;
      case "cart":
        return <CartPage />;
      case "wishlist":
        return <WishlistPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "finance":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Finance</h2>
            <p className="text-white/60">Financial dashboard coming soon...</p>
          </div>
        );
      case "security":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Security</h2>
            <p className="text-white/60">Security settings coming soon...</p>
          </div>
        );
      case "photos":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Photos</h2>
            <p className="text-white/60">Photo gallery coming soon...</p>
          </div>
        );
      case "news":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">News</h2>
            <p className="text-white/60">News feed coming soon...</p>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return <div className="w-full">{renderPage()}</div>;
};

export default MainContent;
