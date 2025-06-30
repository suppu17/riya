import React, { Suspense, lazy } from "react";
import HomePage from "./pages/HomePage";
// Import all pages directly in development for instant loading
import SearchPageDirect from "./pages/SearchPage";
import CategoriesPageDirect from "./pages/CategoriesPage";
import CartPageDirect from "./pages/CartPage";
import WishlistPageDirect from "./pages/WishlistPage";
import ProfilePageDirect from "./pages/ProfilePage";
import PhotosPageDirect from "./pages/PhotosPage";
import { useWallpaper } from "../contexts/WallpaperContext";

// Use direct imports in dev, lazy in production
const SearchPage = import.meta.env.DEV ? SearchPageDirect : lazy(() => import("./pages/SearchPage"));
const CategoriesPage = import.meta.env.DEV ? CategoriesPageDirect : lazy(() => import("./pages/CategoriesPage"));
const CartPage = import.meta.env.DEV ? CartPageDirect : lazy(() => import("./pages/CartPage"));
const WishlistPage = import.meta.env.DEV ? WishlistPageDirect : lazy(() => import("./pages/WishlistPage"));
const ProfilePage = import.meta.env.DEV ? ProfilePageDirect : lazy(() => import("./pages/ProfilePage"));
const PhotosPage = import.meta.env.DEV ? PhotosPageDirect : lazy(() => import("./pages/PhotosPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"></div>
    </div>
  </div>
);

interface MainContentProps {
  currentView: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const { currentWallpaper, setWallpaper, wallpapers } = useWallpaper();
  const renderPage = () => {
    switch (currentView) {
      case "home":
        return <HomePage />;
      case "search":
        return import.meta.env.DEV ? <SearchPage /> : (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        );
      case "categories":
        return import.meta.env.DEV ? <CategoriesPage /> : (
          <Suspense fallback={<PageLoader />}>
            <CategoriesPage />
          </Suspense>
        );
      case "cart":
        return import.meta.env.DEV ? <CartPage /> : (
          <Suspense fallback={<PageLoader />}>
            <CartPage />
          </Suspense>
        );
      case "wishlist":
        return import.meta.env.DEV ? <WishlistPage /> : (
          <Suspense fallback={<PageLoader />}>
            <WishlistPage />
          </Suspense>
        );
      case "profile":
        return import.meta.env.DEV ? <ProfilePage /> : (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        );
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
        return import.meta.env.DEV ? <PhotosPage /> : (
          <Suspense fallback={<PageLoader />}>
            <PhotosPage />
          </Suspense>
        );
      case "settings":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Settings</h2>
            </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {wallpapers.map((wallpaper) => (
                     <div 
                       key={wallpaper.id} 
                       className="relative group cursor-pointer"
                       onClick={() => setWallpaper(wallpaper.url)}
                     >
                       <div className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                         currentWallpaper === wallpaper.url 
                           ? 'border-blue-400 ring-2 ring-blue-400/50' 
                           : 'border-white/20 group-hover:border-white/40'
                       }`}>
                         <img 
                           src={wallpaper.url} 
                           alt={wallpaper.name}
                           className="w-full h-full object-cover"
                         />
                         {currentWallpaper === wallpaper.url && (
                           <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                               </svg>
                             </div>
                           </div>
                         )}
                       </div>
                       <p className="text-white/80 text-sm mt-2 text-center">{wallpaper.name}</p>
                     </div>
                   ))}
                </div>
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
