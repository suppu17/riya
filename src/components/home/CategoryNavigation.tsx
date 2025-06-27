import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';

const CategoryNavigation: React.FC = () => {
  const { currentCategory, handleCategoryChange } = useShopping();

  const categories = [
    { id: "Clothing", label: "Clothing & Fashion", icon: "fa-tshirt" },
    { id: "Beauty", label: "Beauty & Skincare", icon: "fa-spa" },
    { id: "Electronics", label: "Electronics", icon: "fa-laptop" },
    { id: "Plants", label: "Plants & Garden", icon: "fa-leaf" },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 mb-6">
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              currentCategory === category.id
                ? "bg-white/20 text-white border border-white/30"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <i className={`fas ${category.icon} text-lg`}></i>
            <span className="text-sm font-medium">
              {category.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
