import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  description?: string;
  designer?: string;
  articleNumber?: string;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
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
  tryOnResult: string | null;
  isTryingOn: boolean;
  tryOnError: string | null;
  predictionId: string | null;
  tryOnStatus: string | null;
  isTransitioning: boolean;
  fadeDirection: string;
  isImageTransitioning: boolean;
  handleImageChange: (index: number) => void;
  handleCategoryChange: (categoryId: string) => void;
  smoothProductChange: (product: Product) => void;
  handleAddToCart: () => void;
  handleTryOnMe: () => Promise<void>;
  setTryOnResult: (result: string | null) => void;
  setIsTryingOn: (isTryingOn: boolean) => void;
  setTryOnError: (error: string | null) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "BVLGARI Allegra Baciami Eau De Parfum",
    price: 295,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4284544_100000_m",
    category: "Beauty",
    rating: 4.8,
    inStock: true,
    description: "Luxurious eau de parfum with captivating floral notes",
    designer: "BVLGARI",
    articleNumber: "BV001",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4284544_100000_m",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4284544_100000_c",
    ],
  },
  {
    id: "2",
    name: "Rolex Oyster Perpetual Explorer",
    price: 10900,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4860902_100134_a",
    category: "Accessories",
    rating: 4.9,
    inStock: true,
    description: "39mm luxury watch with precision movement",
    designer: "Rolex",
    articleNumber: "RX001",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4860902_100134_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4860902_100134_z",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4860902_100134_b",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4860902_100134_c",
    ],
  },
  {
    id: "3",
    name: "Franck Muller Limited Edition Rose Gold Auberlen Skeleton Auto Watch",
    price: 34000,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4176304_100000_m",
    category: "Accessories",
    rating: 4.9,
    inStock: true,
    description:
      "Limited edition rose gold skeleton automatic watch with leather strap",
    designer: "Franck Muller",
    articleNumber: "FM001",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4176304_100000_m",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4176304_100000_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4176304_100000_b",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4176304_100000_c",
    ],
  },
  {
    id: "4",
    name: "DIOR Dior Addict Lip Glow Butter",
    price: 42,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5031416_100000_n",
    category: "Beauty",
    rating: 4.6,
    inStock: true,
    description: "Nourishing lip balm with natural glow enhancement",
    designer: "DIOR",
    articleNumber: "DR001",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5031416_100000_n",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_1200/01/nm_5031416_100263_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_1200/01/nm_5031416_100000_d",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_1200/01/nm_5031416_100000_b",
    ],
  },
  {
    id: "5",
    name: "DIOR Sauvage Eau de Parfum",
    price: 157,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_2535609_100000_a",
    category: "Beauty",
    rating: 4.7,
    inStock: true,
    description: "Bold and sophisticated fragrance with woody notes",
    designer: "DIOR",
    articleNumber: "DR002",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_2535609_100000_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_2535609_100000_b",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_2535609_100000_h",
    ],
  },
  {
    id: "6",
    name: "DIOR Rouge Blush Colour & Glow",
    price: 50,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4868703_100594_m",
    category: "Beauty",
    rating: 4.5,
    inStock: true,
    description: "Radiant blush for natural colour and luminous glow",
    designer: "DIOR",
    articleNumber: "DR003",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4868703_100594_m",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4868703_100594_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4868703_100594_b",
    ],
  },
  {
    id: "7",
    name: "Burberry Sloanne Woven Linen Block-Heel Sandals",
    price: 790,
    image:
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5040273_100296_m",
    category: "Shoes",
    rating: 4.4,
    inStock: true,
    description: "Elegant woven linen sandals with comfortable block heel",
    designer: "Burberry",
    articleNumber: "BB001",
    images: [
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5040273_100296_m",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5040273_100296_a",
      "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_5040273_100296_d",
    ],
  },
  {
    id: "8",
    name: "Louis Vuitton Floral Jacquard A-Line Dress",
    price: 3050,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-floral-jacquard-a-line-dress--FSDR25SHF602_PM2_Front%20view.png?wid=2400&hei=2400",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description:
      "Elegant floral jacquard A-line dress with sophisticated silhouette",
    designer: "Louis Vuitton",
    articleNumber: "1AGPKU",
    images: [
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-floral-jacquard-a-line-dress--FSDR25SHF602_PM2_Front%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-floral-jacquard-a-line-dress--FSDR25SHF602_PM1_Side%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-floral-jacquard-a-line-dress--FSDR25SHF602_PM1_Cropped%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-floral-jacquard-a-line-dress--FSDR25SHF602_PM1_Cropped%20worn%20view.png?wid=2400&hei=2400",
    ],
  },
  {
    id: "9",
    name: "Louis Vuitton LV Isola Flat Mule",
    price: 795,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-isola-flat-mule--ASPH1ATC53_PM2_Front%20view.png?wid=2400&hei=2400",
    category: "Shoes",
    rating: 4.6,
    inStock: true,
    description: "Stylish flat mule with signature LV design elements",
    designer: "Louis Vuitton",
    articleNumber: "1AGYP8",
    images: [
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-isola-flat-mule--ASPH1ATC53_PM2_Front%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-isola-flat-mule--ASPH1ATC53_PM1_Side%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-lv-isola-flat-mule--ASPH1ATC53_PM1_Interior%20view.png?wid=2400&hei=2400",
    ],
  },
  {
    id: "10",
    name: "Louis Vuitton Capucines BB",
    price: 7000,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-capucines-bb--M24656_PM2_Front%20view.png?wid=2400&hei=2400",
    category: "Bags",
    rating: 4.9,
    inStock: true,
    description: "Iconic handbag with timeless elegance and craftsmanship",
    designer: "Louis Vuitton",
    articleNumber: "M24656",
    images: [
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-capucines-bb--M24656_PM2_Front%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-capucines-bb--M24656_PM1_Side%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-capucines-bb--M24656_PM1_Interior%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-capucines-bb--M24656_PM1_Interior2%20view.png?wid=2400&hei=2400",
    ],
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
          setTryOnResult(data.output?.[0] || data.output);
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
        tryOnResult,
        isTryingOn,
        tryOnError,
        predictionId,
        tryOnStatus,
        isTransitioning,
        fadeDirection,
        isImageTransitioning,
        handleImageChange,
        handleCategoryChange,
        smoothProductChange,
        handleAddToCart,
        handleTryOnMe,
        setTryOnResult,
        setIsTryingOn,
        setTryOnError,
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
