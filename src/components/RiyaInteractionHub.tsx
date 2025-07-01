import React, { useState } from "react";
import { Video, Phone } from "lucide-react";
import { useConversation } from "@elevenlabs/react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import TavusVideoAgent from "./TavusVideoAgent";
import { useShopping } from "../contexts/ShoppingContext";

type InteractionMode = "choice" | "voice" | "video";

const RiyaInteractionHub: React.FC = () => {
  const [mode, setMode] = useState<InteractionMode>("choice");
  const {
    products,
    setSelectedProduct,
    addToCart,
    selectedProduct,
    setCurrentCategory,
    cart,
    clearCart,
    openCartModal,
    cartModalRef,
    handleTryOnMe,
    selectedModelId,
    openPhotoModal,
  } = useShopping();

  // Debug: Log selectedModelId on every render
  console.log("RiyaInteractionHub: Current selectedModelId:", selectedModelId);
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const conversation = useConversation({
    agentId: "agent_01jz0wdr7zffhaqgjv39gzs104",
    client: apiKey ? new ElevenLabsClient({ apiKey }) : undefined,
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    clientTools: {
      search_products: async (query: {
        type: { productID: string };
      }) => {
        // Log the raw query to avoid console display issues with object mutation
        console.log("from search_products:", JSON.stringify(query, null, 2));

        const productID = query?.type?.productID;
        console.log(
          `Extracted productID: ${productID} (type: ${typeof productID})`
        );

        // Check if productID is null or undefined, which is safer than !productID
        if (productID == null) {
          return "I'm sorry, I couldn't find any products matching \"\".";
        }

        // Ensure we are comparing strings, as product.id is a string
        const productIDString = String(productID);

        const foundProduct = products.find(
          (product) => product.id.toString() === productIDString
        );

        if (foundProduct) {
          setSelectedProduct(foundProduct);
          setCurrentCategory(foundProduct.category);
          return `I found the ${foundProduct.name}. I've put it on the screen for you.`;
        } else {
          return `I'm sorry, I couldn't find any products matching "${productIDString}".`;
        }
      },
      add_to_cart: async (query: {
        productId?: string;
        type?: { ProductID: string };
      }) => {
        console.log("from add_to_cart:", JSON.stringify(query, null, 2));

        // Handle both productId and type.ProductID formats
        const productId = query.productId || query.type?.ProductID;
        console.log("Extracted productId:", productId);

        if (productId) {
          // Find product by ID
          // Convert productId to string since our product IDs are strings
        const productIdString = String(productId);
        const productToAdd = products.find((p) => p.id === productIdString);
          if (productToAdd) {
            addToCart(productToAdd);
            return `I've added the ${productToAdd.name} to your cart for $${productToAdd.price}.`;
          } else {
            return "I'm sorry, I couldn't find that product to add to your cart.";
          }
        } else if (selectedProduct) {
          // Use currently selected product
          addToCart(selectedProduct);
          return `I've added the ${selectedProduct.name} to your cart for $${selectedProduct.price}.`;
        } else {
          return "I'm sorry, please select a product first or specify which product you'd like to add to your cart.";
        }
      },

      switch_category: async (query: {
        type?: { category: string };
        "type "?: { category: string };
        categoryName?: string;
      }) => {
        console.log("from switch_category:", JSON.stringify(query, null, 2));
        const availableCategories = ["Clothing", "Bags", "Watches", "Shoes"];

        // Handle both 'type' and 'type ' (with trailing space) keys
        const categoryName =
          query.type?.category || query["type"]?.category || query.categoryName;

        console.log(availableCategories, categoryName, "availableCategories");
        console.log("Raw query object:", query);
        console.log("Extracted categoryName:", categoryName);

        if (!categoryName) {
          return "I'm sorry, I need a category name to switch to.";
        }

        // Find matching category (fuzzy search)
        const matchedCategory =
          availableCategories.find((cat) =>
            cat.toLowerCase().includes(categoryName.toLowerCase())
          ) ||
          availableCategories.find((cat) =>
            categoryName.toLowerCase().includes(cat.toLowerCase())
          );

        if (matchedCategory) {
          setCurrentCategory(matchedCategory);

          // Filter products by category and set first as selected
          const categoryProducts = products.filter(
            (p) => p.category === matchedCategory
          );
          if (categoryProducts.length > 0) {
            setSelectedProduct(categoryProducts[0]);
          }

          return `I've switched to the ${matchedCategory} category and found ${
            categoryProducts.length
          } products. ${
            categoryProducts.length > 0
              ? `I've selected the ${categoryProducts[0].name} for you to view.`
              : ""
          }`;
        } else {
          return `I'm sorry, I couldn't find the "${categoryName}" category. Available categories are: ${availableCategories.join(
            ", "
          )}.`;
        }
      },
      show_kart: async () => {
        console.log("from show_kart: Opening cart modal");

        // Trigger the cart modal to open
        openCartModal();

        if (cart.length === 0) {
          return "I've opened your cart. It's currently empty. Would you like me to help you find some products?";
        }

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return `I've opened your cart for you. You have ${totalItems} items totaling $${totalPrice.toFixed(
          2
        )}.`;
      },

      trigger_checkout: async () => {
        console.log("from trigger_checkout: Processing checkout");

        // Trigger the cart modal to open
        openCartModal();

        // Wait a moment for the modal to render
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use the cartModalRef to trigger the checkout button
        if (cartModalRef.current) {
          const result = await cartModalRef.current.triggerCheckout();
          return result;
        } else {
          return "Cart modal is not available. Please try again.";
        }
      },

      try_on_me: async () => {
        console.log("from try_on_me: Triggering try-on functionality");
        console.log(
          "try_on_me called - selectedProduct:",
          selectedProduct?.name,
          "selectedModelId:",
          selectedModelId
        );

        if (!selectedProduct) {
          return "Please select a product first before trying it on.";
        }

        // Check if the selected product is from clothing category
        if (selectedProduct.category !== 'Clothing') {
          return "I'm sorry, the virtual try-on feature is only available for clothing items. Please select a clothing product to use this feature.";
        }

        if (!selectedModelId) {
          console.log("No selectedModelId found, opening photo modal");
          openPhotoModal();
          return "Please select a photo first. I've opened the photo selection modal for you.";
        }

        try {
          await handleTryOnMe();
          return `I'm starting the try-on process for the ${selectedProduct.name}. This may take a moment to generate your virtual try-on image.`;
        } catch (error) {
          console.error("Try-on error:", error);
          return "I'm sorry, there was an error starting the try-on process. Please make sure you have uploaded a photo and try again.";
        }
      },
    },
  });

  const handleModeSelect = (selectedMode: "voice" | "video") => {
    setMode(selectedMode);
  };

  const handleClose = () => {
    setMode("choice");
  };

  if (mode === "voice") {
    // return <RiyaVoiceAgent />;
  }

  // Video call mode - render within the same container
  if (mode === "video") {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-3 border border-white/20 flex flex-col items-center text-center relative">
        {/* Voice Call Button - Disabled during video call */}
        <button
          disabled={true}
          className="absolute bottom-16 right-6 w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border z-50 bg-gray-500/50 border-gray-400/30 text-gray-400 cursor-not-allowed"
        >
          <Phone className="w-3 h-3" />
        </button>

        {/* Video Call Button - Red when active */}
        <button
          onClick={handleClose}
          className="absolute bottom-6 right-6 w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border z-50 bg-red-500/80 border-red-400/50 text-white hover:bg-red-600/80"
        >
          <Video className="w-3 h-3" />
        </button>

        {/* Tavus Video Call Container */}
        <div className="w-full h-full aspect-square rounded-2xl overflow-hidden border-2 border-white/30">
          <TavusVideoAgent autoStart={true} onClose={handleClose} />
        </div>

        {/* Status Text */}
        <div className="absolute bottom-8 left-0 right-0 text-center mt-2">
          {/* <p className="text-orange-500 font-medium text-sm mb-0 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
            Video Call Active
          </p> */}
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="bg-red-900/50 backdrop-blur-xl rounded-3xl p-6 border border-red-500/50 text-white text-center">
        <h3 className="font-semibold mb-2">Voice AI Disabled</h3>
        <p className="text-sm text-white/80">
          Please add your ElevenLabs API key to a `.env` file as
          `VITE_ELEVENLABS_API_KEY` to enable the voice assistant.
        </p>
      </div>
    );
  }

  // Default choice mode - preserve original orange video layout with minimal icon buttons
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-3 border border-white/20 flex flex-col items-center text-center relative">
      {/* Voice Call Button - Above Video Button */}
      <button
        onClick={() => {
          if (
            ["connected", "speaking", "listening"].includes(conversation.status)
          ) {
            conversation.endSession();
          } else {
            conversation.startSession();
          }
        }}
        disabled={mode === "video"}
        className={`absolute bottom-16 right-6 w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border z-50 ${
          ["connected", "speaking", "listening"].includes(conversation.status)
            ? "bg-red-500/80 border-red-400/50 text-white hover:bg-red-600/80"
            : mode === "video"
            ? "bg-gray-500/50 border-gray-400/30 text-gray-400 cursor-not-allowed"
            : "bg-black/20 border-white/20 text-white hover:border-white/30"
        }`}
      >
        <Phone className="w-3 h-3" />
      </button>

      {/* Video Call Button - Bottom Right */}
      <button
        onClick={() => handleModeSelect("video")}
        disabled={["connected", "speaking", "listening"].includes(
          conversation.status
        )}
        className={`absolute bottom-6 right-6 w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border z-50 ${
          mode === "video"
            ? "bg-red-500/80 border-red-400/50 text-white hover:bg-red-600/80"
            : ["connected", "speaking", "listening"].includes(
                conversation.status
              )
            ? "bg-gray-500/50 border-gray-400/30 text-gray-400 cursor-not-allowed"
            : "bg-black/20 border-white/20 text-white hover:border-white/30"
        }`}
      >
        <Video className="w-3 h-3" />
      </button>

      {/* Original Orange Video */}
      <div className="w-full h-full aspect-square rounded-2xl overflow-hidden border-2 border-white/30">
        <video
          src="https://cdn.dribbble.com/userupload/15697531/file/original-0242acdc69146d4472fc5e69b48616dc.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Original Status Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center mt-2">
        <p className="text-orange-500 font-medium text-sm mb-0 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
          {conversation.status === "speaking"
            ? "speaking"
            : conversation.status === "listening"
            ? "listening"
            : conversation.status === "connected"
            ? "connected"
            : "Riya"}
        </p>
      </div>
    </div>
  );
};

export default RiyaInteractionHub;
