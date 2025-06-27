import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";

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
  // Beauty Products (8 total)
  {
    id: "1",
    name: "LUXE GLOW",
    price: 89,
    image:
      "https://luxe-cosmetics.us/cdn/shop/files/01_-_FOR_MEN_LUXE_HAIR_GROWTH_SERUM_1_1_e52afcfc-199e-4aab-bd47-d4247ac47e70.jpg?v=1733118944",
    category: "Beauty",
    rating: 4.8,
    inStock: true,
    description:
      "Premium skincare serum with vitamin C and hyaluronic acid. Provides deep hydration and brightening effects for radiant, youthful skin.",
    designer: "Beauty Lab Co.",
    articleNumber: "BL001",
  },
  {
    id: "2",
    name: "RADIANT",
    price: 65,
    image: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg",
    category: "Beauty",
    rating: 4.6,
    inStock: true,
    description: "Illuminating foundation with SPF 30 protection",
    designer: "Glow Beauty",
    articleNumber: "GB002",
  },
  {
    id: "3",
    name: "VELVET",
    price: 45,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-imagination--LP0219_PM2_Front%20view.png?wid=2400&hei=2400",
    category: "Beauty",
    rating: 4.7,
    inStock: true,
    description: "Matte lipstick collection in 12 stunning shades",
    designer: "Velvet Cosmetics",
    articleNumber: "VC003",
  },
  {
    id: "13",
    name: "CRYSTAL",
    price: 125,
    image: "https://images.pexels.com/photos/3685534/pexels-photo-3685534.jpeg",
    category: "Beauty",
    rating: 4.9,
    inStock: true,
    description: "Anti-aging night cream with retinol and peptides",
    designer: "Crystal Beauty",
    articleNumber: "CB013",
  },
  {
    id: "14",
    name: "PURE",
    price: 78,
    image: "https://images.pexels.com/photos/3685535/pexels-photo-3685535.jpeg",
    category: "Beauty",
    rating: 4.5,
    inStock: true,
    description: "Gentle cleansing foam for sensitive skin",
    designer: "Pure Skincare",
    articleNumber: "PS014",
  },
  {
    id: "15",
    name: "BLOOM",
    price: 92,
    image: "https://images.pexels.com/photos/3685536/pexels-photo-3685536.jpeg",
    category: "Beauty",
    rating: 4.8,
    inStock: true,
    description: "Hydrating face mask with botanical extracts",
    designer: "Bloom Naturals",
    articleNumber: "BN015",
  },
  {
    id: "16",
    name: "ESSENCE",
    price: 156,
    image: "https://images.pexels.com/photos/3685537/pexels-photo-3685537.jpeg",
    category: "Beauty",
    rating: 4.7,
    inStock: true,
    description: "Luxury perfume with floral and woody notes",
    designer: "Essence Paris",
    articleNumber: "EP016",
  },
  {
    id: "17",
    name: "GLOW",
    price: 68,
    image: "https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg",
    category: "Beauty",
    rating: 4.6,
    inStock: true,
    description: "Brightening eye cream with caffeine",
    designer: "Glow Labs",
    articleNumber: "GL017",
  },

  // Clothing (8 total)
  {
    id: "4",
    name: "AURORA",
    price: 129,
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    category: "Clothing",
    rating: 4.9,
    inStock: true,
    description: "Elegant evening dress with flowing silhouette",
    designer: "Fashion House",
    articleNumber: "FH004",
  },
  {
    id: "5",
    name: "URBAN",
    price: 89,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM2_Front%20view.png?wid=2400&hei=2400",
    category: "Clothing",
    rating: 4.5,
    inStock: true,
    description: "Casual streetwear jacket with modern cut",
    designer: "Urban Style",
    articleNumber: "US005",
    images: [
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM2_Front%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM1_Worn%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM1_Worn%20view.png?wid=2400&hei=2400",
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM1_Worn%20view.png?wid=2400&hei=2400",
    ],
  },
  {
    id: "6",
    name: "CLASSIC",
    price: 199,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM1_Worn%20view.png?wid=2400&hei=2400",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description: "Timeless blazer for professional occasions",
    designer: "Classic Wear",
    articleNumber: "CW006",
  },
  {
    id: "18",
    name: "LUXE",
    price: 245,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sequin-signature-knit-top--FTKS31XDK102_PM2_Front%20view.png",
    category: "Clothing",
    rating: 4.9,
    inStock: true,
    description: "Premium silk blouse with delicate embroidery",
    designer: "Luxe Fashion",
    articleNumber: "LF018",
  },
  {
    id: "20",
    name: "FORMAL",
    price: 189,
    image:
      "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-nil-messenger--M14988_PM1_Worn%20view.png?wid=2400&hei=2400",
    category: "Clothing",
    rating: 4.7,
    inStock: true,
    description: "Tailored dress pants for business wear",
    designer: "Formal Attire",
    articleNumber: "FA020",
  },
  {
    id: "21",
    name: "SPORT",
    price: 95,
    image: "https://images.pexels.com/photos/1040947/pexels-photo-1040947.jpeg",
    category: "Clothing",
    rating: 4.6,
    inStock: true,
    description: "Athletic wear set with moisture-wicking fabric",
    designer: "Sport Elite",
    articleNumber: "SE021",
  },
  {
    id: "22",
    name: "VINTAGE",
    price: 165,
    image: "https://images.pexels.com/photos/1043476/pexels-photo-1043476.jpeg",
    category: "Clothing",
    rating: 4.8,
    inStock: true,
    description: "Retro-inspired denim jacket with unique details",
    designer: "Vintage Vibes",
    articleNumber: "VV022",
  },

  // Electronics (8 total)
  {
    id: "7",
    name: "NEXUS PRO",
    price: 899,
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    category: "Electronics",
    rating: 4.8,
    inStock: true,
    description: "Premium wireless headphones with noise cancellation",
    designer: "Tech Innovations",
    articleNumber: "TI007",
  },
  {
    id: "8",
    name: "SMART HUB",
    price: 299,
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
    description: "Voice-controlled smart home assistant",
    designer: "Smart Living",
    articleNumber: "SL008",
  },
  {
    id: "9",
    name: "VISION 4K",
    price: 1299,
    image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
    category: "Electronics",
    rating: 4.7,
    inStock: true,
    description: "Ultra HD smart television with HDR",
    designer: "Vision Tech",
    articleNumber: "VT009",
  },
  {
    id: "23",
    name: "POWER BANK",
    price: 79,
    image: "https://images.pexels.com/photos/788947/pexels-photo-788947.jpeg",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    description: "High-capacity portable charger with fast charging",
    designer: "Power Tech",
    articleNumber: "PT023",
  },
  {
    id: "24",
    name: "WIRELESS MOUSE",
    price: 129,
    image: "https://images.pexels.com/photos/442577/pexels-photo-442577.jpeg",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
    description: "Ergonomic wireless mouse with precision tracking",
    designer: "Precision Devices",
    articleNumber: "PD024",
  },
  {
    id: "25",
    name: "GAMING KEYBOARD",
    price: 189,
    image: "https://images.pexels.com/photos/442578/pexels-photo-442578.jpeg",
    category: "Electronics",
    rating: 4.8,
    inStock: true,
    description: "Mechanical gaming keyboard with RGB lighting",
    designer: "Gaming Pro",
    articleNumber: "GP025",
  },
  {
    id: "26",
    name: "TABLET PRO",
    price: 699,
    image: "https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg",
    category: "Electronics",
    rating: 4.7,
    inStock: true,
    description: "Professional tablet with stylus support",
    designer: "Digital Arts",
    articleNumber: "DA026",
  },
  {
    id: "27",
    name: "SMART WATCH",
    price: 399,
    image: "https://images.pexels.com/photos/442580/pexels-photo-442580.jpeg",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
    description: "Fitness tracking smartwatch with health monitoring",
    designer: "Health Tech",
    articleNumber: "HT027",
  },

  // Plants & Gardening (8 total)
  {
    id: "10",
    name: "MONSTERA",
    price: 45,
    image: "https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg",
    category: "Plants",
    rating: 4.9,
    inStock: true,
    description: "Large monstera deliciosa in ceramic pot",
    designer: "Green Paradise",
    articleNumber: "GP010",
  },
  {
    id: "11",
    name: "FIDDLE LEAF",
    price: 89,
    image: "https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg",
    category: "Plants",
    rating: 4.5,
    inStock: true,
    description: "Tall fiddle leaf fig tree for indoor spaces",
    designer: "Plant Studio",
    articleNumber: "PS011",
  },
  {
    id: "12",
    name: "SUCCULENT SET",
    price: 29,
    image: "https://images.pexels.com/photos/6208088/pexels-photo-6208088.jpeg",
    category: "Plants",
    rating: 4.8,
    inStock: true,
    description: "Collection of 6 assorted succulents",
    designer: "Desert Bloom",
    articleNumber: "DB012",
  },
  {
    id: "28",
    name: "SNAKE PLANT",
    price: 35,
    image: "https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg",
    category: "Plants",
    rating: 4.7,
    inStock: true,
    description: "Low-maintenance snake plant in modern planter",
    designer: "Urban Jungle",
    articleNumber: "UJ028",
  },
  {
    id: "29",
    name: "PEACE LILY",
    price: 52,
    image: "https://images.pexels.com/photos/6208090/pexels-photo-6208090.jpeg",
    category: "Plants",
    rating: 4.6,
    inStock: true,
    description: "Elegant peace lily with white blooms",
    designer: "Bloom & Grow",
    articleNumber: "BG029",
  },
  {
    id: "30",
    name: "RUBBER TREE",
    price: 68,
    image: "https://images.pexels.com/photos/6208091/pexels-photo-6208091.jpeg",
    category: "Plants",
    rating: 4.8,
    inStock: true,
    description: "Glossy rubber tree plant in decorative pot",
    designer: "Leaf & Branch",
    articleNumber: "LB030",
  },
  {
    id: "31",
    name: "HERB GARDEN",
    price: 42,
    image: "https://images.pexels.com/photos/6208092/pexels-photo-6208092.jpeg",
    category: "Plants",
    rating: 4.5,
    inStock: true,
    description: "Indoor herb garden kit with basil, mint, and rosemary",
    designer: "Fresh Herbs Co.",
    articleNumber: "FH031",
  },
  {
    id: "32",
    name: "ORCHID",
    price: 95,
    image: "https://images.pexels.com/photos/6208093/pexels-photo-6208093.jpeg",
    category: "Plants",
    rating: 4.9,
    inStock: true,
    description: "Premium orchid with exotic purple blooms",
    articleNumber: "EF032",
  },
];

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState("Clothing");

  const [selectedProduct, setSelectedProduct] = useState(
    sampleProducts.find((p) => p.category === currentCategory) || sampleProducts[0]
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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
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
