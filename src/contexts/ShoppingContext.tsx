import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";

import { sampleProducts, Product } from "./products";

export interface CartItem extends Product {
  quantity: number;
}

export interface ModelImage {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

interface ShoppingContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemCount: () => number;
  selectedProduct: Product | undefined;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedModelId: string | null;
  setSelectedModelId: (modelId: string | null) => void;
  tryOnResult: string | null;
  isTryingOn: boolean;
  tryOnError: string | null;
  predictionId: string | null;
  tryOnStatus: string | null;
  isTransitioning: boolean;
  fadeDirection: string;
  isImageTransitioning: boolean;
  modelImages: ModelImage[];
  handleImageChange: (index: number) => void;
  handleCategoryChange: (categoryId: string) => void;
  smoothProductChange: (product: Product) => void;
  handleAddToCart: () => void;
  handleTryOnMe: () => Promise<void>;
  setTryOnResult: (result: string | null) => void;
  setIsTryingOn: (isTryingOn: boolean) => void;
  setTryOnError: (error: string | null) => void;
  addCustomPhoto?: (photo: ModelImage) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

const modelImages: ModelImage[] = [
  {
    id: "1",
    name: "Photo 1",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_1.png",
  },
  {
    id: "2",
    name: "Photo 2",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_2.png",
  },
  {
    id: "3",
    name: "Photo 3",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_3.png",
  },
  {
    id: "4",
    name: "Photo 4",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_4.png",
  },
  {
    id: "5",
    name: "Photo 5",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_5.png",
  },
  {
    id: "6",
    name: "Photo 6",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_6.png",
  },
  {
    id: "7",
    name: "Photo 7",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/YEN_7671.JPG",
  },
  {
    id: "8",
    name: "Photo 8",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/IMG_7514.JPG",
  },
];

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState("Clothing");

  const [selectedProduct, setSelectedProduct] = useState(
    sampleProducts.find((p) => p.category === currentCategory) ||
      sampleProducts[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [customPhotos, setCustomPhotos] = useState<ModelImage[]>([]);

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
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const nextImageIndexRef = useRef(selectedImageIndex);
  const nextProductRef = useRef(selectedProduct);

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    const newCategoryProducts = sampleProducts.filter(
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

  const handleImageChange = (index: number) => {
    if (index === selectedImageIndex) return;

    setIsImageTransitioning(true);
    nextImageIndexRef.current = index;

    setTimeout(() => {
      setSelectedImageIndex(index);
      setTimeout(() => {
        setIsImageTransitioning(false);
      }, 300); // Fade in duration
    }, 300); // Fade out duration
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
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
          // Extract URL from the output array
          let resultUrl = data.output?.[0] || data.output;

          // Handle case where output contains backticks and URL
          if (typeof resultUrl === "string" && resultUrl.includes("`")) {
            // Extract URL from string like: ' `https://cdn.fashn.ai/...` '
            const urlMatch = resultUrl.match(/`([^`]+)`/);
            if (urlMatch && urlMatch[1]) {
              resultUrl = urlMatch[1].trim();
            }
          }

          console.log("Processed try-on result URL:", resultUrl);
          setTryOnResult(resultUrl);
          setIsTryingOn(false);
          clearPolling();
          break;
        case "failed":
          setTryOnError(
            typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error) || "The prediction failed."
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
    if (!selectedProduct) return;
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

      // Get the selected model image URL
      const getSelectedModelImage = () => {
        if (!selectedModelId) {
          // Default model image if no model is selected
          return "https://media.istockphoto.com/id/907261794/photo/handsome-man.jpg?s=612x612&w=0&k=20&c=31YyQlon3lBpv7izm6h05HdwZXNiQKRX6_lkFQcTPRY=";
        }

        // Find the model image from the centralized modelImages array
        const selectedModel = modelImages.find(
          (model) => model.id === selectedModelId
        );
        return selectedModel?.url || modelImages[0]?.url; // Fallback to first model
      };

      const requestBody = {
        model_name: "tryon-v1.6",
        inputs: {
          model_image: await convertImageToBase64(getSelectedModelImage()),
          garment_image: await convertImageToBase64(selectedProduct.image),
        },
      };

      // Helper function to convert image URL to base64
      async function convertImageToBase64(imageUrl: string): Promise<string> {
        // For S3 URLs, return the URL directly since the API can handle URLs
        if (imageUrl.includes("s3.")) {
          return imageUrl;
        }

        try {
          const response = await fetch(imageUrl, {
            mode: "cors",
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }

          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error converting image to base64:", error);
          // Return the URL directly as fallback if fetch fails
          return imageUrl;
        }
      }

      const response = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "image/png", // Changed from image/png to application/json since we're sending JSON data
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
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setTryOnError(errorMessage);
      setIsTryingOn(false);
    }
  };

  const [products] = useState<Product[]>(sampleProducts);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const addCustomPhoto = (photo: ModelImage) => {
    setCustomPhotos((prev) => [...prev, photo]);
  };

  // Combine default model images with custom photos
  const allModelImages = [...modelImages, ...customPhotos];

  return (
    <ShoppingContext.Provider
      value={{
        products: sampleProducts,
        cart,
        wishlist,
        currentCategory,
        setCurrentCategory,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        getTotalPrice,
        getCartItemCount,
        selectedProduct,
        setSelectedProduct,
        quantity,
        setQuantity,
        selectedImageIndex,
        setSelectedImageIndex,
        selectedModelId,
        setSelectedModelId,
        tryOnResult,
        isTryingOn,
        tryOnError,
        predictionId,
        tryOnStatus,
        isTransitioning,
        fadeDirection,
        isImageTransitioning,
        modelImages: allModelImages,
        handleImageChange,
        handleCategoryChange,
        smoothProductChange,
        handleAddToCart,
        handleTryOnMe,
        setTryOnResult,
        setIsTryingOn,
        setTryOnError,
        addCustomPhoto,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
};
