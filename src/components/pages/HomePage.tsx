import React from "react";
import TopNavigationBar from "../home/TopNavigationBar";
import ProductListSidebar from "../home/ProductListSidebar";
import CategoryNavigation from "../home/CategoryNavigation";
import ProductDisplay from "../home/ProductDisplay";
import ProductActions from "../home/ProductActions";
import RiyaVoiceAgent from "../RiyaVoiceAgent";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TopNavigationBar />
      <div className="grid grid-cols-12 gap-6">
        <ProductListSidebar />
        <div className="col-span-6">
          <CategoryNavigation />
          <ProductDisplay />
        </div>
        <div className="col-span-3 space-y-6">
          <RiyaVoiceAgent />
          <ProductActions />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
