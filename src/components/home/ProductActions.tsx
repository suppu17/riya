import React from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { Star, Plus, Minus, ShoppingBag } from "lucide-react";

const ProductActions: React.FC = () => {
  const { selectedProduct, addToCart, quantity, setQuantity } = useShopping();

  if (!selectedProduct) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <ShoppingBag className="w-8 h-8 text-white/40" />
          </motion.div>
          <p className="text-white/60 text-sm">
            Select a product to view details
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        borderColor: "rgba(255, 255, 255, 0.25)",
        scale: 1.01,
      }}
    >
      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.h2
          className="text-white text-xl font-bold mb-3 leading-tight"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {selectedProduct.name}
        </motion.h2>

        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.8 + i * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    i < selectedProduct.rating
                      ? "text-yellow-400 fill-current"
                      : "text-white/30"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <motion.span
            className="text-white/60 text-xs ml-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            ({selectedProduct.rating})
          </motion.span>
        </motion.div>

        {selectedProduct.description && (
          <motion.p
            className="text-white/70 text-xs mb-4 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            {selectedProduct.description}
          </motion.p>
        )}

        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.0,
            type: "spring",
            stiffness: 150,
          }}
        >
          <div className="text-white/60 text-xs mb-1">Price</div>
          <div className="text-white text-2xl font-bold">
            ${selectedProduct.price}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <div className="text-white/60 text-xs mb-3">Quantity</div>
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-200 border border-white/10"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>

            <motion.span
              className="text-white text-xl font-bold px-4"
              key={quantity}
              initial={{ scale: 1.2, color: "rgba(34, 197, 94, 1)" }}
              animate={{ scale: 1, color: "rgba(255, 255, 255, 1)" }}
              transition={{ duration: 0.3 }}
            >
              {quantity}
            </motion.span>

            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-200 border border-white/10"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductActions;
