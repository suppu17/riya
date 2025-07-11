import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { CartModalRef } from "../components/CartModal";

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
  cartModalRef: React.RefObject<CartModalRef>;
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
  isCartModalOpen: boolean;
  setIsCartModalOpen: (isOpen: boolean) => void;
  openCartModal: () => void;
  closeCartModal: () => void;
  isPhotoModalOpen: boolean;
  setIsPhotoModalOpen: (isOpen: boolean) => void;
  openPhotoModal: () => void;
  closePhotoModal: () => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

const modelImages: ModelImage[] = [
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
  {
    id: "3",
    name: "Photo 3",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/88c1bd2e-4679-428f-8045-17e8325526db.jpg",
  },
  {
    id: "4",
    name: "Photo 4",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/IMG_20191214_102707.jpg",
  },
  {
    id: "5",
    name: "Photo 5",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/5.jpg",
  },
  {
    id: "6",
    name: "Photo 6",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/6.JPG",
  },
  {
    id: "2",
    name: "Photo 2",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/2.JPG",
  },
  {
    id: "1",
    name: "Photo 1",
    url: "https://assetsimagesai.s3.us-east-1.amazonaws.com/supriya_final_images+/1.JPG",
  },
];

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load cart from localStorage on initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState("Clothing");

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    () => {
      return (
        sampleProducts.find((p) => p.category === currentCategory) ||
        sampleProducts[0]
      );
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('selectedModelId') || null;
    } catch {
      return null;
    }
  });
  const [customPhotos, setCustomPhotos] = useState<ModelImage[]>([]);

  // Persist selectedModelId to localStorage
  useEffect(() => {
    try {
      if (selectedModelId) {
        localStorage.setItem('selectedModelId', selectedModelId);
      } else {
        localStorage.removeItem('selectedModelId');
      }
    } catch (error) {
      console.error('Failed to persist selectedModelId:', error);
    }
  }, [selectedModelId]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Cart Modal state
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const cartModalRef = useRef<CartModalRef>(null);

  // Photo Selection Modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

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
          // Continue polling
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            3000
          );
          break;
        case "in_queue":
          setTryOnProgress(10);
          // Continue polling
          pollingTimeoutRef.current = window.setTimeout(
            () => checkPredictionStatus(id),
            3000
          );
          break;
        case "processing":
          setTryOnProgress(60);
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

  // Load generated images from localStorage on mount
  useEffect(() => {
    const storedImages = loadGeneratedImages();
    setGeneratedImages(storedImages);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("shopping-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Clean up polling on component unmount
  useEffect(() => {
    return () => clearPolling();
  }, []);

  const handleTryOnMe = async () => {
    console.log(
      "handleTryOnMe - selectedProduct from state:",
      selectedProduct?.name
    );

    if (!selectedProduct) {
      console.log("No selectedProduct found, cannot proceed with try-on");
      return;
    }
    // Reset state for a new request
    setIsTryingOn(true);
    setTryOnError(null);
    setTryOnResult(null);
    setTryOnStatus("Initializing...");
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
        console.log(
          "handleTryOnMe - selectedModelId from state:",
          selectedModelId
        );

        if (!selectedModelId) {
          console.log("No selectedModelId found, using default image");
          // Default model image if no model is selected
          return "https://media.istockphoto.com/id/907261794/photo/handsome-man.jpg?s=612x612&w=0&k=20&c=31YyQlon3lBpv7izm6h05HdwZXNiQKRX6_lkFQcTPRY=";
        }

        // Find the model image from the centralized modelImages array
        const selectedModel = modelImages.find(
          (model) => model.id === selectedModelId
        );

        console.log("handleTryOnMe - found selectedModel:", selectedModel);
        console.log(
          "handleTryOnMe - using model image URL:",
          selectedModel?.url || modelImages[0]?.url
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

      console.log(
        "handleTryOnMe - API request using product:",
        selectedProduct.name
      );
      console.log(
        "handleTryOnMe - API request using garment image:",
        selectedProduct.image
      );

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

  const saveGeneratedImage = (imageUrl: string) => {
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      productName: selectedProduct?.name || "Unknown Product",
      productId: selectedProduct?.id || "unknown",
      productImage: selectedProduct?.image || "",
      createdAt: new Date().toISOString(),
      modelUsed: selectedModelId ? `Model ${selectedModelId}` : "Default Model",
      modelId: selectedModelId || "default",
    };

    setGeneratedImages((prev) => [newImage, ...prev]);

    // Save to localStorage
    const existingImages = JSON.parse(
      localStorage.getItem("generatedImages") || "[]"
    );
    localStorage.setItem(
      "generatedImages",
      JSON.stringify([newImage, ...existingImages])
    );
  };

  const loadGeneratedImages = (): GeneratedImage[] => {
    const stored = localStorage.getItem("generatedImages");
    return stored ? JSON.parse(stored) : [];
  };

  const deleteGeneratedImage = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));

    // Update localStorage
    const existingImages = JSON.parse(
      localStorage.getItem("generatedImages") || "[]"
    );
    const updatedImages = existingImages.filter(
      (img: GeneratedImage) => img.id !== imageId
    );
    localStorage.setItem("generatedImages", JSON.stringify(updatedImages));
  };

  // Cart Modal functions
  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  // Photo Modal functions
  const openPhotoModal = () => {
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
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
        cartModalRef,
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
        isCartModalOpen,
        setIsCartModalOpen,
        openCartModal,
        closeCartModal,
        isPhotoModalOpen,
        setIsPhotoModalOpen,
        openPhotoModal,
        closePhotoModal,
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
