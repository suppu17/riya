import React from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import ProductListCard from "../ProductListCard";

const ProductListSidebar: React.FC = () => {
  const { products, currentCategory, selectedProduct, setSelectedProduct } =
    useShopping();

  const filteredProducts = products.filter(
    (product) =>
      currentCategory === "all" || product.category === currentCategory
  );

  return (
    <motion.div
      className="bg-pink-100/10 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 h-fit"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{
        backgroundColor: "rgba(255, 182, 193, 0.12)",
        borderColor: "rgba(255, 182, 193, 0.25)",
      }}
    >
      <motion.h3
        className="text-white/80 text-lg font-semibold mb-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        Products ({filteredProducts.length})
      </motion.h3>

      <motion.div
        className="space-y-3 max-h-[40vh] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.6 + index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ProductListCard
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onClick={() => setSelectedProduct(product)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProductListSidebar;