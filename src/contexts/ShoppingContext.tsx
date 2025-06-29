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

interface GeneratedImage {
  id: string;
  url: string;
  productName: string;
  productId: string;
  productImage: string;
  createdAt: string;
  modelUsed: string;
  modelId: string;
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
  tryOnProgress: number;
  isTransitioning: boolean;
  fadeDirection: string;
  isImageTransitioning: boolean;
  modelImages: ModelImage[];
  generatedImages: GeneratedImage[];
  handleImageChange: (index: number) => void;
  handleCategoryChange: (categoryId: string) => void;
  smoothProductChange: (product: Product) => void;
  handleAddToCart: () => void;
  handleTryOnMe: () => Promise<void>;
  setTryOnResult: (result: string | null) => void;
  setIsTryingOn: (isTryingOn: boolean) => void;
  setTryOnError: (error: string | null) => void;
  setTryOnProgress: (progress: number) => void;
  addCustomPhoto?: (photo: ModelImage) => void;
  saveGeneratedImage: (imageUrl: string) => void;
  loadGeneratedImages: () => GeneratedImage[];
  deleteGeneratedImage: (imageId: string) => void;
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
  // Public folder images
  {
    id: "public_1",
    name: "Public Photo 1",
    url: "/1.JPG",
  },
  {
    id: "public_2",
    name: "Public Photo 2",
    url: "/2.JPG",
  },
  {
    id: "public_3",
    name: "Public Photo 3",
    url: "/3.heic",
  },
  {
    id: "public_4",
    name: "Public Photo 4",
    url: "/4.JPG",
  },
  {
    id: "public_5",
    name: "Public Photo 5",
    url: "/5.JPG",
  },
  {
    id: "public_6",
    name: "Public Photo 6",
    url: "/6.JPG",
  },
  {
    id: "public_7",
    name: "Public Photo 7",
    url: "/7.JPG",
  },
  {
    id: "public_8",
    name: "Public Photo 8",
    url: "/8.JPG",
  },
  {
    id: "public_9",
    name: "Public Photo 9",
    url: "/9.JPG",
  },
  {
    id: "public_10",
    name: "Public Photo 10",
    url: "/10.JPG",
  },
  {
    id: "public_11",
    name: "Public Photo 11",
    url: "/11.JPG",
  },
  {
    id: "public_12",
    name: "Public Photo 12",
    url: "/12.JPG",
  },
  {
    id: "public_13",
    name: "Public Photo 13",
    url: "/13.JPG",
  },
  {
    id: "public_14",
    name: "Public Photo 14",
    url: "/14.JPG",
  },
  {
    id: "public_15",
    name: "Public Photo 15",
    url: "/15.JPG",
  },
  {
    id: "public_16",
    name: "Public Photo 16",
    url: "/16.JPG",
  },
  {
    id: "public_17",
    name: "Public Photo 17",
    url: "/17.JPG",
  },
  {
    id: "public_18",
    name: "Public Photo 18",
    url: "/18.JPG",
  },
  {
    id: "public_19",
    name: "Public Photo 19",
    url: "/19.JPG",
  },
  {
    id: "public_20",
    name: "Public Photo 20",
    url: "/20.JPG",
  },
  {
    id: "public_21",
    name: "Public Photo 21",
    url: "/21.JPG",
  },
  {
    id: "public_22",
    name: "Public Photo 22",
    url: "/22.JPG",
  },
  {
    id: "public_23",
    name: "Public Photo 23",
    url: "/23.JPG",
  },
  {
    id: "public_24",
    name: "Public Photo 24",
    url: "/24.JPG",
  },
  {
    id: "public_25",
    name: "Public Photo 25",
    url: "/25.JPG",
  },
  {
    id: "public_26",
    name: "Public Photo 26",
    url: "/26.JPG",
  },
  {
    id: "public_27",
    name: "Public Photo 27",
    url: "/27.JPG",
  },
  {
    id: "public_28",
    name: "Public Photo 28",
    url: "/28.JPG",
  },
  {
    id: "public_29",
    name: "Public Photo 29",
    url: "/29.JPG",
  },
  {
    id: "public_30",
    name: "Public Photo 30",
    url: "/30.JPG",
  },
  {
    id: "public_31",
    name: "Public Photo 31",
    url: "/31.JPG",
  },
  {
    id: "public_32",
    name: "Public Photo 32",
    url: "/32.JPG",
  },
  {
    id: "public_33",
    name: "Public Photo 33",
    url: "/33.JPG",
  },
  {
    id: "public_34",
    name: "Public Photo 34",
    url: "/34.JPG",
  },
  {
    id: "public_35",
    name: "Public Photo 35",
    url: "/35.JPG",
  },
  {
    id: "public_36",
    name: "Public Photo 36",
    url: "/36.JPG",
  },
  {
    id: "public_37",
    name: "Public Photo 37",
    url: "/37.JPG",
  },
  {
    id: "public_38",
    name: "Public Photo 38",
    url: "/38.JPG",
  },
  {
    id: "public_39",
    name: "Public Photo 39",
    url: "/39.JPG",
  },
  {
    id: "public_40",
    name: "Public Photo 40",
    url: "/40.JPG",
  },
  {
    id: "public_41",
    name: "Public Photo 41",
    url: "/41.JPG",
  },
  {
    id: "public_42",
    name: "Public Photo 42",
    url: "/42.JPG",
  },
  {
    id: "public_43",
    name: "Public Photo 43",
    url: "/43.JPG",
  },
  {
    id: "public_44",
    name: "Public Photo 44",
    url: "/44.JPG",
  },
  {
    id: "public_45",
    name: "Public Photo 45",
    url: "/45.JPG",
  },
  {
    id: "public_46",
    name: "Public Photo 46",
    url: "/46.JPG",
  },
  {
    id: "public_47",
    name: "Public Photo 47",
    url: "/47.JPG",
  },
  {
    id: "public_48",
    name: "Public Photo 48",
    url: "/48.JPG",
  },
  {
    id: "public_49",
    name: "Public Photo 49",
    url: "/49.JPG",
  },
  {
    id: "public_50",
    name: "Public Photo 50",
    url: "/50.JPG",
  },
  {
    id: "public_image",
    name: "Public Image",
    url: "/image.png",
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
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Try On feature states
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<string | null>(null);
  const [tryOnProgress, setTryOnProgress] = useState<number>(0);
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
        // Faster retry for quicker recovery
        pollingTimeoutRef.current = window.setTimeout(
          () => checkPredictionStatus(id),
          2000
        );
        return;
      }

      const data = await response.json();
      console.log("Status API Response:", data);
      
      // Enhanced status messages for better user experience
      const statusMessages = {
        "starting": "Starting 8K Ultra HD processing...",
        "in_queue": "Queued for high-priority processing...",
        "processing": "Generating 8K Ultra HD try-on image...",
        "completed": "8K Ultra HD processing complete!",
        "failed": "Processing failed"
      };
      
      setTryOnStatus(statusMessages[data.status as keyof typeof statusMessages] || data.status || "Processing...");

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
          setTryOnProgress(100);
          setTryOnResult(resultUrl);
          
          // Save the generated image to localStorage
          if (resultUrl) {
            saveGeneratedImage(resultUrl);
          }
          
          setIsTryingOn(false);
          clearPolling();
          break;
        case "failed":
          setTryOnError(
            typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error) || "The prediction failed."
          );
          setTryOnProgress(0);
          setIsTryingOn(false);
          clearPolling();
          break;
        case "starting":
          setTryOnProgress(20);
          // Faster polling for quicker response
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            1500
          );
          break;
        case "in_queue":
          setTryOnProgress(10);
          // Faster polling for quicker response
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            1500
          );
          break;
        case "processing":
          setTryOnProgress(60);
          // Faster polling during processing
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            2000
          );
          break;
        default:
          console.warn(`Unknown status: ${data.status}. Retrying...`);
          setTryOnProgress(40); // Show some progress for unknown status
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            2000
          );
          break;
      }
    } catch (error) {
      console.error("Error checking prediction status, retrying...", error);
      // Faster retry on network error for quicker recovery
      pollingTimeoutRef.current = window.setTimeout(
        () => checkPredictionStatus(id),
        2000
      );
    }
  };

  // Load generated images from localStorage on mount
  useEffect(() => {
    const storedImages = loadGeneratedImages();
    setGeneratedImages(storedImages);
  }, []);

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
    setTryOnStatus("Initializing 8K Ultra HD processing...");
    setTryOnProgress(0);
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
          // Enhanced quality parameters for 8K Ultra HD output
          quality: "ultra_hd",
          resolution: "8k",
          enhancement: "enabled",
          processing_priority: "high",
          output_format: "png",
          compression: "lossless"
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
          "Content-Type": "application/json", // Correct content type for JSON data
          "X-Processing-Priority": "high", // Request high priority processing
          "X-Quality-Mode": "ultra_hd" // Request ultra HD quality
        },
      });

      const data = await response.json();
      console.log("Initial API Response:", data);

      if (response.ok && data.id) {
        setPredictionId(data.id);
        setTryOnStatus("Request submitted for 8K Ultra HD processing...");
        setTryOnProgress(5); // Show initial progress
        // Kick off the faster polling
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

  const saveGeneratedImage = (imageUrl: string) => {
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      productName: selectedProduct?.name || "Unknown Product",
      productId: selectedProduct?.id || "unknown",
      productImage: selectedProduct?.image || "",
      createdAt: new Date().toISOString(),
      modelUsed: selectedModelId ? `Model ${selectedModelId}` : "Default Model",
      modelId: selectedModelId || "default"
    };
    
    setGeneratedImages(prev => [newImage, ...prev]);
    
    // Save to localStorage
    const existingImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    localStorage.setItem('generatedImages', JSON.stringify([newImage, ...existingImages]));
  };

  const loadGeneratedImages = (): GeneratedImage[] => {
    const stored = localStorage.getItem('generatedImages');
    return stored ? JSON.parse(stored) : [];
  };

  const deleteGeneratedImage = (imageId: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
    
    // Update localStorage
    const existingImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    const updatedImages = existingImages.filter((img: GeneratedImage) => img.id !== imageId);
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
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
        tryOnProgress,
        isTransitioning,
        fadeDirection,
        isImageTransitioning,
        modelImages: allModelImages,
        generatedImages,
        handleImageChange,
        handleCategoryChange,
        smoothProductChange,
        handleAddToCart,
        handleTryOnMe,
        setTryOnResult,
        setIsTryingOn,
        setTryOnError,
        setTryOnProgress,
        addCustomPhoto,
        saveGeneratedImage,
        loadGeneratedImages,
        deleteGeneratedImage,
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
