import React from "react";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PhotosPage from "./pages/PhotosPage";

interface MainContentProps {
  currentView: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const renderPage = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="px-4 py-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Welcome to SnapStyler</h2>
              <p className="text-white/80 mb-6">Your personal shopping assistant</p>
              <button 
                onClick={() => window.location.href = "#shop"} 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-medium transition-all duration-300"
              >
                Start Shopping
              </button>
            </div>
          </div>
        );
      case "shop":
        return <HomePage />;
      case "search":
        return (
          <div className="px-4 py-6">
            <SearchPage />
          </div>
        );
      case "categories":
        return (
          <div className="px-4 py-6">
            <CategoriesPage />
          </div>
        );
      case "cart":
        return (
          <div className="px-4 py-6">
            <CartPage />
          </div>
        );
      case "wishlist":
        return (
          <div className="px-4 py-6">
            <WishlistPage />
          </div>
        );
      case "profile":
        return (
          <div className="px-4 py-6">
            <ProfilePage />
          </div>
        );
      case "settings":
        return (
          <div className="px-4 py-6">
            <SettingsPage />
          </div>
        );
      case "finance":
        return (
          <div className="px-4 py-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Finance</h2>
              <p className="text-white/60">Financial dashboard coming soon...</p>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="px-4 py-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Security</h2>
              <p className="text-white/60">Security settings coming soon...</p>
            </div>
          </div>
        );
      case "photos":
        return (
          <div className="px-4 py-6">
            <PhotosPage />
          </div>
        );
      case "news":
        return (
          <div className="px-4 py-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">News</h2>
              <p className="text-white/60">News feed coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="px-4 py-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Welcome to SnapStyler</h2>
              <p className="text-white/80">Please select a valid view</p>
            </div>
          </div>
        );
    }
  };

  return <div className="w-full">{renderPage()}</div>;
};

export default MainContent;
