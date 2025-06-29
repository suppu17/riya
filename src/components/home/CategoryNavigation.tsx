import React from "react";
import { Shirt, ShoppingBag, Clock, Footprints, Gift } from "lucide-react";
import { useShopping } from "../../contexts/ShoppingContext";

const CategoryNavigation: React.FC = () => {
  const { currentCategory, handleCategoryChange } = useShopping();

  const categories = [
    {
      id: "Clothing",
      label: "Clothing & Fashion",
      icon: Shirt,
      showTryON: true,
    },
    {
      id: "Bags",
      label: "Bags & Handbags",
      icon: ShoppingBag,
    },
    { id: "Watches", label: "Watches", icon: Clock },
    {
      id: "Shoes",
      label: "Shoes & Footwear",
      icon: Footprints,
    },
    { id: "Gifts", label: "Gifts", icon: Gift },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-4 h-20">
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
            role="button"
          >
            <category.icon size={20} />
            <span className="text-base font-large">
              {category.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
