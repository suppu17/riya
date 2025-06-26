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
  Shirt,
  Loader2,
  Clock,
} from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RiyaVoiceAgent from "../RiyaVoiceAgent";
import ProductListCard from "../ProductListCard";

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

  // Try On feature states
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<string | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);

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

  const clearPolling = () => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  };

  const checkPredictionStatus = async (id: string) => {
    try {
      const apiKey = import.meta.env.VITE_FASHN_API_KEY;
      const response = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        console.error("API error, retrying...", response.status);
        // Retry after 5 seconds on server error
        pollingTimeoutRef.current = window.setTimeout(
          () => checkPredictionStatus(id),
          5000
        );
        return;
      }

      const data = await response.json();
      console.log("Status API Response:", data);
      setTryOnStatus(data.status || "unknown");

      switch (data.status) {
        case "completed":
          setTryOnResult(data.output?.[0] || data.output);
          setIsTryingOn(false);
          clearPolling();
          break;
        case "failed":
          setTryOnError(
            typeof data.error === 'string' ? data.error : JSON.stringify(data.error) || "The prediction failed."
          );
          setIsTryingOn(false);
          clearPolling();
          break;
        case "starting":
        case "in_queue":
        case "processing":
          // Continue polling
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            3000
          );
          break;
        default:
          console.warn(`Unknown status: ${data.status}. Retrying...`);
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            5000
          );
          break;
      }
    } catch (error) {
      console.error("Error checking prediction status, retrying...", error);
      // Retry after 5 seconds on network error
      pollingTimeoutRef.current = window.setTimeout(
        () => checkPredictionStatus(id),
        5000
      );
    }
  };

  // Clean up polling on component unmount
  useEffect(() => {
    return () => clearPolling();
  }, []);

  const handleTryOnMe = async () => {
    // Reset state for a new request
    setIsTryingOn(true);
    setTryOnError(null);
    setTryOnResult(null);
    setTryOnStatus("Initializing...");
    setPredictionId(null);
    clearPolling(); // Ensure no previous polling is running

    try {
      const apiKey = import.meta.env.VITE_FASHN_API_KEY;
      if (!apiKey) {
        setTryOnError("API key is not set.");
        setIsTryingOn(false);
        return;
      }

      const requestBody = {
        model_name: "tryon-v1.6",
        inputs: {
          model_image:
            "https://media.istockphoto.com/id/907261794/photo/handsome-man.jpg?s=612x612&w=0&k=20&c=31YyQlon3lBpv7izm6h05HdwZXNiQKRX6_lkFQcTPRY=",
          garment_image: selectedProduct.image,
        },
      };

      const response = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Initial API Response:", data);

      if (response.ok && data.id) {
        setPredictionId(data.id);
        setTryOnStatus("starting");
        // Kick off the polling
        checkPredictionStatus(data.id);
      } else {
        setTryOnError(data.error || "Failed to start prediction.");
        setIsTryingOn(false);
      }
    } catch (error) {
      console.error("Try on error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setTryOnError(errorMessage);
      setIsTryingOn(false);
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
              <span className="text-white/80 text-sm font-medium">
                All {currentCategory.toLowerCase()}
              </span>
            </div>

            <div className="space-y-4">
              {categoryProducts.slice(0, 7).map((product) => (
                <ProductListCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProduct.id === product.id}
                  onClick={() => smoothProductChange(product)}
                />
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
            className={`bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 h-[650px] overflow transition-opacity duration-300 ease-in-out ${
              isTransitioning
                ? "opacity-" + (fadeDirection === "out" ? "50" : "100")
                : "opacity-100"
            }`}
          >
            {/* Full-width and height product image with title overlay */}
            <div className="relative h-full w-full">
              <img
                src={
                  tryOnResult ||
                  selectedProduct.images?.[selectedImageIndex] ||
                  selectedProduct.image
                }
                alt={tryOnResult ? "Try On Result" : selectedProduct.name}
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Try On Status or Error Message */}
              {isTryingOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl">
                  <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                    <p className="text-white font-medium">
                      {tryOnStatus === "in_queue" && "Waiting in queue..."}
                      {tryOnStatus === "processing" &&
                        "Processing your virtual try-on..."}
                      {tryOnStatus === "starting" &&
                        "Starting virtual try-on..."}
                      {!tryOnStatus && "Creating your virtual try-on..."}
                    </p>
                    {predictionId && (
                      <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> This may take up to 40
                        seconds
                      </p>
                    )}
                    <p className="text-white/60 text-xs mt-2">
                      {predictionId &&
                        `Prediction ID: ${predictionId.substring(0, 8)}...`}
                      {tryOnStatus && ` | Status: ${tryOnStatus}`}
                    </p>
                    <button
                      onClick={() => {
                        setIsTryingOn(false);
                        setTryOnError(null);
                      }}
                      className="mt-4 text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {tryOnError && !isTryingOn && (
                <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-red-500/70 text-white text-sm px-4 py-2 rounded-lg">
                  {tryOnError}
                </div>
              )}

              {tryOnResult && !isTryingOn && (
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl">
                  <button
                    onClick={() => setTryOnResult(null)}
                    className="text-white text-xs font-medium flex items-center gap-1"
                  >
                    <i className="fas fa-times"></i>
                    Reset Try On
                  </button>
                </div>
              )}

              {/* Product Title Overlay on Left Side with Shadow */}
              <div className="absolute top-4 left-8 max-w-[60%]">
                <h1 className="text-4xl font-bold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.8)]">
                  {selectedProduct.name}
                </h1>
              </div>

              {/* Try On Me button - right side */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleTryOnMe}
                  disabled={isTryingOn}
                  className={`flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-xl text-white text-sm font-medium ${
                    isTryingOn ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isTryingOn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shirt className="w-4 h-4" />
                  )}
                  Try On Me
                </button>
              </div>

              {/* Try-On Status and Error Display */}
              {(isTryingOn || tryOnError || tryOnResult) && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white/10 backdrop-blur-xl p-3 rounded-lg border border-white/20">
                  {isTryingOn && !tryOnResult && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                        <p className="text-white/80 text-sm">
                          Status: {tryOnStatus}
                        </p>
                      </div>
                      {["starting", "in_queue", "processing"].includes(
                        tryOnStatus || ""
                      ) && (
                        <button
                          onClick={() =>
                            predictionId && checkPredictionStatus(predictionId)
                          }
                          className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
                        >
                          Refresh
                        </button>
                      )}
                    </div>
                  )}
                  {tryOnError && (
                    <p className="text-red-400 text-sm">Error: {tryOnError}</p>
                  )}
                  {tryOnResult && (
                    <p className="text-green-400 text-sm">
                      Success! Your try-on image is ready.
                    </p>
                  )}
                </div>
              )}

              {/* Product Images Thumbnails - Bottom of image, partially outside card */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="absolute bottom-1 left-4 right-0 flex gap-3 justify-center z-99">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`
                        relative overflow-hidden border-[3px] rounded-lg bg-white/10 backdrop-blur-sm
                        transition-all duration-300 ease-in-out
                        animate-scroll
                        ${
                          selectedImageIndex === index
                            ? "border-white w-16 h-16 shadow-xl z-20"
                            : "border-white/30 hover:border-white/50 w-14 h-14 opacity-80"
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quantity Controls - Bottom Left */}
              <div className="absolute bottom-2 right-4">
                <div className="flex items-center gap-1 bg-white/10 shadow-sm rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <Minus className="w-2 h-2" />
                  </button>
                  <span className="text-white font-semibold w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <Plus className="w-2 h-2" />
                  </button>
                </div>
              </div>
            </div>
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

          {/* Product Details Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Product Details</h3>
              <span className="text-white font-bold text-lg">
                ${selectedProduct.price}
              </span>
            </div>

            {/* Product Description */}
            <div className="mb-2">
              <p className="text-white/80 text-xs leading-tight line-clamp-2">
                {selectedProduct.description}
              </p>
            </div>

            {/* Reviews */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(selectedProduct.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-white/30"
                  }`}
                />
              ))}
              <span className="text-white/80 text-xs ml-1">
                {selectedProduct.rating}
              </span>
            </div>

            {/* Product Info - Two-column layout */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
              <div>
                <h4 className="text-white/90 text-xs font-medium">Designer</h4>
                <p className="text-white/70 text-xs">
                  {selectedProduct.designer}
                </p>
              </div>
              <div>
                <h4 className="text-white/90 text-xs font-medium">
                  Article number
                </h4>
                <p className="text-white/70 text-xs">
                  {selectedProduct.articleNumber}
                </p>
              </div>
              <div>
                <h4 className="text-white/90 text-xs font-medium">Warranty</h4>
                <p className="text-white/70 text-xs">
                  10 year limited warranty
                </p>
              </div>
            </div>
          </div>

          {/* How to get it */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/90 text-sm font-medium">
                How to get it
              </span>
              <Plus className="w-4 h-4 text-white/60" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <i className="fas fa-truck text-white/70"></i>
                  </div>
                  <span className="text-white text-xs font-medium">
                    Delivery - Check availability
                  </span>
                </div>
                <i className="fas fa-chevron-right text-white/60"></i>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <i className="fas fa-store text-white/70"></i>
                  </div>
                  <span className="text-white text-xs font-medium">
                    In store - Check stock
                  </span>
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
