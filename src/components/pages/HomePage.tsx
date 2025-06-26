import React, { useState, useRef, useEffect } from "react";
import { useShopping } from "../../contexts/ShoppingContext";
import {
  Search,
  Mic,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  ArrowLeft,
  ArrowRight,
  User,
  Truck,
  Store,
} from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RiyaVoiceAgent from "../RiyaVoiceAgent";

const HomePage: React.FC = () => {
  const {
    products,
    currentCategory,
    setCurrentCategory,
    addToCart,
    getCartItemCount,
  } = useShopping();
  const [selectedProduct, setSelectedProduct] = useState(
    products.find((p) => p.category === currentCategory) || products[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Transition state to control smooth transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeDirection, setFadeDirection] = useState("out"); // "in" or "out"
  const nextProductRef = useRef(selectedProduct);

  const categories = [
    { id: "Clothing", label: "Clothing & Fashion", icon: "fa-tshirt" },
    { id: "Beauty", label: "Beauty & Skincare", icon: "fa-spa" },
    { id: "Electronics", label: "Electronics", icon: "fa-laptop" },
    { id: "Plants", label: "Plants & Garden", icon: "fa-leaf" },
  ];

  const categoryProducts = products.filter(
    (p) => p.category === currentCategory
  );
  const cartCount = getCartItemCount();

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    const newCategoryProducts = products.filter(
      (p) => p.category === categoryId
    );

    if (newCategoryProducts.length > 0) {
      // Start transition
      setIsTransitioning(true);
      setFadeDirection("out");

      // Store the next product to show after transition
      nextProductRef.current = newCategoryProducts[0];
      setSelectedImageIndex(0);

      // Allow time for fade out before changing product
      setTimeout(() => {
        setSelectedProduct(nextProductRef.current);
        setFadeDirection("in");

        // Complete transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  // Add smooth transition when product changes without category change
  const smoothProductChange = (product: typeof selectedProduct) => {
    if (product.id === selectedProduct.id) return;

    setIsTransitioning(true);
    setFadeDirection("out");
    nextProductRef.current = product;

    setTimeout(() => {
      setSelectedProduct(product);
      setFadeDirection("in");

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-lg pl-4 font-bold">
            Shopbeauty.ai
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors">
            <Mic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20">
            <ShoppingCart className="w-4 h-4 text-white/80" />
            <span className="text-white text-sm">{cartCount} items</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Product List */}
        <div className="col-span-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">
                All {currentCategory.toLowerCase()}
              </span>
            </div>

            <div className="space-y-4">
              {categoryProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  onClick={() => smoothProductChange(product)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedProduct.id === product.id
                      ? "bg-white/20 border border-white/30"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">
                      {product.name}
                    </h3>
                    <p className="text-white/60 text-xs">
                      {product.description?.split(".")[0] || product.category}
                    </p>
                  </div>
                  <span className="text-white font-semibold">
                    ${product.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Category Navigation & Product Details */}
        <div className="col-span-6">
          {/* Category Navigation */}
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

          {/* Main Product Display with smooth transition */}
          <div
            className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 h-[600px] flex flex-col overflow-y-auto transition-opacity duration-300 ease-in-out ${
              isTransitioning
                ? "opacity-" + (fadeDirection === "out" ? "50" : "100")
                : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {selectedProduct.name}
                </h1>
                <p className="text-white/80">{selectedProduct.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedProduct.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                  <span className="text-white/80 text-sm ml-2">
                    {selectedProduct.rating}
                  </span>
                </div>
              </div>
              <button className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Product Image */}
            <div className="relative mb-6 flex-shrink-0">
              <img
                src={
                  selectedProduct.images?.[selectedImageIndex] ||
                  selectedProduct.image
                }
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-2xl"
              />
              <div className="absolute top-4 right-4">
                <span className="text-4xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                  ${selectedProduct.price}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-6 mb-6 flex-shrink-0">
              <div>
                <h3 className="text-white font-semibold mb-2">Designer</h3>
                <p className="text-white/80">{selectedProduct.designer}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Article number
                </h3>
                <p className="text-white/80">{selectedProduct.articleNumber}</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between mt-auto flex-shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Add to cart
              </button>
            </div>

            {/* Product Images Thumbnails */}
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex gap-3 mt-4 flex-shrink-0 overflow-x-auto">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-white/50"
                        : "border-white/20 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Customer Service & Info */}
        <div className="col-span-3 space-y-6">
          {/* Riya Voice Agent */}
          <RiyaVoiceAgent
            products={products}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
            currentCategory={currentCategory}
            selectedProduct={selectedProduct}
            setCurrentCategory={setCurrentCategory}
          />

          {/* Warranty Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">
                You have 10 year limited warranty
              </span>
              <Plus className="w-4 h-4 text-white/60" />
            </div>
          </div>

          {/* How to get it */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm">How to get it</span>
              <Plus className="w-4 h-4 text-white/60" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-xl rounded-xl">
                <div className="flex items-center gap-3">
                  <i className="fas fa-truck text-white/60"></i>
                  <div>
                    <p className="text-white text-sm">Delivery</p>
                    <p className="text-white/60 text-xs">
                      Check delivery availability
                    </p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-white/60"></i>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-xl rounded-xl">
                <div className="flex items-center gap-3">
                  <i className="fas fa-store text-white/60"></i>
                  <div>
                    <p className="text-white text-sm">In store</p>
                    <p className="text-white/60 text-xs">
                      Check in-store stock
                    </p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-white/60"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
