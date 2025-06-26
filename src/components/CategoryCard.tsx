import React from "react";

interface Category {
  name: string;
  image: string;
  count: number;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="w-32 h-20 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden group hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="relative w-full h-full">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-xs font-medium text-white truncate">
            {category.name}
          </h3>
          <p className="text-xs text-white/60">{category.count} items</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
