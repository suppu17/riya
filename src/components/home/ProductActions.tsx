import React from "react";
import { motion } from "motion/react";
import { useShopping } from "../../contexts/ShoppingContext";
import { Star, Plus, Minus, ShoppingBag, Truck, Clock, Shield } from "lucide-react";

const ProductActions: React.FC = () => {
  const { selectedProduct, quantity, setQuantity, addToCart } = useShopping();

  if (!selectedProduct) {
    return (
      <motion.div
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl"
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
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
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

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.25)",
        scale: 1.01,
      }}
    >
      <motion.div
        className="mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.h2
          className="text-white text-lg font-bold mb-2 leading-tight"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {selectedProduct.name}
        </motion.h2>

        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < selectedProduct.rating
                      ? "text-yellow-400 fill-current"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-white/60 text-xs">
              ({selectedProduct.rating})
            </span>
          </div>
          <div className="text-white text-xl font-bold">
            ${selectedProduct.price}
          </div>
        </motion.div>

        {selectedProduct.description && (
          <motion.p
            className="text-white/70 text-xs mb-3 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            {selectedProduct.description}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <motion.div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-200 border border-white/10 shadow-sm"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 182, 193, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Minus className="w-2 h-2" />
            </motion.button>

            <motion.span
              className="text-white text-xs font-bold px-1.5 min-w-[20px] text-center"
              key={quantity}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {quantity}
            </motion.span>

            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-200 border border-white/10 shadow-sm"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 182, 193, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-2 h-2" />
            </motion.button>
          </div>
        </motion.div>


        {/* Delivery Information */}
        <motion.div
          className=""
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <motion.h3
            className="text-white/90 text-sm font-semibold mb-3 mt-2 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <Truck className="w-4 h-4 text-white/70" />
            Delivery Info
          </motion.h3>
          
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Clock className="w-3 h-3 text-white-400" />
              <span>Free delivery in 2-3 days</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <Shield className="w-3 h-3 text-white-400" />
              <span>30-day return policy</span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.button
          onClick={() => {
            addToCart(selectedProduct);
            setQuantity(1);
          }}
          className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 backdrop-blur-sm rounded-full py-3 px-6 text-white font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          Add to Cart
        </motion.button>

      </motion.div>
    </motion.div>
  );
};

export default ProductActions;