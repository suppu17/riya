import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";

interface CategoryImage {
  id: string;
  name: string;
  image: string;
  category: string;
}

const CategoryGallery: React.FC = () => {
  const { products } = useShopping();

  const categoryImages: CategoryImage[] = useMemo(() => {
    const categoryMap = new Map<string, CategoryImage[]>();

    // Filter out Beauty category and group products by category
    products.forEach((product) => {
      if (
        product.category !== "Beauty" &&
        product.images &&
        product.images.length > 0
      ) {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, []);
        }
        const categoryProducts = categoryMap.get(product.category)!;

        // Take only 1 image per product, but from different products (2 products per category)
        if (categoryProducts.length < 2) {
          categoryProducts.push({
            id: product.id,
            name: product.name,
            image: product.images[0], // Take random image from first 4 images
            category: product.category,
          });
        }
      }
    });

    // Flatten the map to get all images (2 per category)
    const allImages: CategoryImage[] = [];
    categoryMap.forEach((products) => {
      allImages.push(...products);
    });

    return allImages.slice(0, 8);
  }, [products]);

  return (
    <motion.div
      className="bg-pink-100/10 backdrop-blur-xl rounded-2xl border border-pink-200/20 p-4 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3 className="text-white font-semibold text-bold mb-3">Trending</h3>
      <div className="grid grid-cols-4 gap-2">
        {categoryImages.map((category, index) => (
          <motion.div
            key={category.id}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryGallery;