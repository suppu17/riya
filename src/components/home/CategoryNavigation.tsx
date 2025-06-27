import React from "react";
import { useShopping } from "../../contexts/ShoppingContext";

const CategoryNavigation: React.FC = () => {
  const { currentCategory, handleCategoryChange } = useShopping();

  const categories = [
    { id: "Clothing", label: "Clothing & Fashion", icon: "fa-tshirt" },
    { id: "Bags", label: "Bags & Handbags", icon: "fa-shopping-bag" },
    { id: "Beauty", label: "Beauty & Skincare", icon: "fa-spa" },
    { id: "Accessories", label: "Accessories", icon: "fa-gem" },
    { id: "Shoes", label: "Shoes & Footwear", icon: "fa-shoe-prints" },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-6 h-20">
      <div className="flex items-center gap-3 px-4 py-2 h-full overflow-x-auto scrollbar-hide scroll-smooth">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 whitespace-nowrap min-w-fit ${
              currentCategory === category.id
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            r
          >
            <i className={`fas ${category.icon} text-xl`}></i>
            <span className="text-base font-medium">
              {category.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
