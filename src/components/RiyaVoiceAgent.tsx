import { useConversation } from "@elevenlabs/react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import React from "react";
import { Pause, Play } from "lucide-react";

import { useShopping } from "../contexts/ShoppingContext";

const RiyaVoiceAgent: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    addToCart,
    selectedProduct,
    setCurrentCategory,
  } = useShopping();
  // No state needed for this component
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const conversation = useConversation({
    agentId: "agent_01jyncdvaxfqn8kdqk5rfn1jdt",
    client: apiKey ? new ElevenLabsClient({ apiKey }) : undefined,
    voiceId: "21m00Tcm4TlvDq8ikWAM", // A default voice for 'Rachel'.
    clientTools: {
      switch_category: async (query: { type: { category: string } }) => {
        console.log("from switch_category:", JSON.stringify(query, null, 2));
        // Handle potential whitespace issues in the key from the agent
        const typeObj = query.type || (query as any)["type "];
        const category = typeObj?.category;
        if (category) {
          // Handle case-insensitivity
          setCurrentCategory(category);
          return `Okay, I've switched the category to ${category}.`;
        } else {
          return "I'm sorry, I couldn't recognize the category.";
        }
      },
      search_products: async (query: {
        type: { productID: string | number };
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
      add_to_cart: async (query: { type: { productID: string } }) => {
        console.log("from add_to_cart:", JSON.stringify(query, null, 2));
        if (selectedProduct) {
          addToCart(selectedProduct);
          return `I've added the ${selectedProduct.name} to your cart.`;
        } else {
          return "I'm sorry, there is no product selected to add to the cart.";
        }
      },
    },
  });

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

  return (
    <div className="backdrop-blur-sm bg-transparent rounded-3xl p-3 border border-white/20 flex flex-col items-center text-center relative">
      {/* Completely transparent background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-transparent"></div>
      
      {/* Riya assistant container */}
      <div className="w-full h-full aspect-square rounded-2xl overflow-hidden z-10 relative">
        {/* Animated pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-pulse"></div>
        
        {/* Circular energy orb */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-4/5 h-4/5 rounded-full bg-gradient-to-br from-orange-400/20 via-amber-300/10 to-orange-500/20 animate-pulse flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-orange-400/30 via-amber-300/20 to-orange-500/30 animate-pulse flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-orange-400/40 via-amber-300/30 to-orange-500/40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status text */}
      <div className="absolute bottom-8 left-0 right-0 text-center mt-2">
        <p className="text-orange-500 font-medium text-sm mb-0 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
          {conversation.status === "connected" 
            ? "listening"
            : "Riya.ai"}
          <br />
        </p>
      </div>

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
        className={`absolute right-4 top-4 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all 
          bg-black/20 backdrop-blur-xl border border-white/20 hover:border-white/30 z-50`}
      >
        {conversation.status !== "connected" ? (
          <Play className="w-3 h-3" />
        ) : (
          <Pause className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};

export default RiyaVoiceAgent;
