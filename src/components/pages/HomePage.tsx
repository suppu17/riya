import React from "react";
import { motion } from "motion/react";
import TopNavigationBar from "../home/TopNavigationBar";
import ProductListSidebar from "../home/ProductListSidebar";
import CategoryGallery from "../home/CategoryGallery";
import CategoryNavigation from "../home/CategoryNavigation";
import ProductDisplay from "../home/ProductDisplay";
import ProductActions from "../home/ProductActions";
import RiyaVoiceAgent from "../RiyaVoiceAgent";

const HomePage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TopNavigationBar />
      </motion.div>

      <motion.div
        className="grid grid-cols-12 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className="col-span-3 space-y-4"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <ProductListSidebar />
          <CategoryGallery />
        </motion.div>

        <motion.div
          className="col-span-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryNavigation />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <ProductDisplay />
          </motion.div>
        </motion.div>

        <motion.div
          className="col-span-3 space-y-6"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <RiyaVoiceAgent />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ProductActions />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
