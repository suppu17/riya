import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { useConversation } from "@elevenlabs/react";
import React, { useState } from "react";
import { Pause, Play, Mic, Send } from "lucide-react";

import { useShopping } from "../contexts/ShoppingContext";

const RiyaVoiceAgent: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    addToCart,
    selectedProduct,
    setCurrentCategory,
  } = useShopping();
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  console.log('API Key available:', !!apiKey);

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
        type: { productID?: string | number; searchTerm?: string };
      }) => {
        console.log("from search_products:", JSON.stringify(query, null, 2));

        const productID = query?.type?.productID;
        const searchTerm = query?.type?.searchTerm;

        // If we have a search term, use text-based search
        if (searchTerm) {
          const foundProduct = searchProducts(searchTerm);
          if (foundProduct) {
            return `I found the ${foundProduct.name}. I've put it on the screen for you.`;
          } else {
            return `I'm sorry, I couldn't find any products matching "${searchTerm}".`;
          }
        }

        // If we have a product ID, search by ID
        if (productID != null) {
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
        }

        return "I'm sorry, I couldn't find any products matching your request.";
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

  console.log('Conversation object:', conversation);
  console.log('Conversation status:', conversation?.status);

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

  const searchProducts = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    
    // Extract keywords from natural language input
    const extractKeywords = (input: string) => {
      const colors = ['red', 'blue', 'black', 'white', 'brown', 'pink', 'green', 'yellow', 'purple', 'orange', 'gray', 'grey', 'beige', 'navy', 'gold', 'silver'];
      const occasions = ['casual', 'formal', 'party', 'wedding', 'work', 'office', 'christmas', 'holiday', 'summer', 'winter', 'spring', 'fall', 'evening', 'day', 'night'];
      const styles = ['elegant', 'classic', 'modern', 'vintage', 'trendy', 'chic', 'sporty', 'bohemian', 'minimalist', 'luxury'];
      const productTypes = ['dress', 'bag', 'handbag', 'purse', 'watch', 'shoe', 'shoes', 'sandal', 'boot', 'sneaker', 'jacket', 'coat', 'shirt', 'blouse', 'skirt', 'pants', 'jeans'];
      
      return {
        colors: colors.filter(color => input.includes(color)),
        occasions: occasions.filter(occasion => input.includes(occasion)),
        styles: styles.filter(style => input.includes(style)),
        productTypes: productTypes.filter(type => input.includes(type))
      };
    };
    
    const extracted = extractKeywords(term);
    
    // Search through products with enhanced matching
    const foundProducts = products.filter(product => {
      const productText = [
        product.name,
        product.description || '',
        product.category,
        product.designer || '',
        ...(product.keyWords || [])
      ].join(' ').toLowerCase();
      
      // Direct exact term match (highest priority)
      if (productText.includes(term)) return true;
      
      // If user specified both color and product type, both must match
      if (extracted.colors.length > 0 && extracted.productTypes.length > 0) {
        const hasColor = extracted.colors.some(color => 
          productText.includes(color) || productText.includes(color + ' color')
        );
        const hasProductType = extracted.productTypes.some(type => {
          // Check category match or product name/keywords
          return product.category.toLowerCase().includes(type) || 
                 productText.includes(type) ||
                 (type === 'dress' && product.category.toLowerCase() === 'clothes') ||
                 (type === 'bag' && product.category.toLowerCase() === 'bags') ||
                 (type === 'watch' && product.category.toLowerCase() === 'watches') ||
                 (type === 'shoe' && product.category.toLowerCase() === 'shoes');
        });
        return hasColor && hasProductType;
      }
      
      // If only product type specified, prioritize category match
      if (extracted.productTypes.length > 0) {
        return extracted.productTypes.some(type => {
          return product.category.toLowerCase().includes(type) || 
                 productText.includes(type) ||
                 (type === 'dress' && product.category.toLowerCase() === 'clothes') ||
                 (type === 'bag' && product.category.toLowerCase() === 'bags') ||
                 (type === 'watch' && product.category.toLowerCase() === 'watches') ||
                 (type === 'shoe' && product.category.toLowerCase() === 'shoes');
        });
      }
      
      // If only color specified, match color
      if (extracted.colors.length > 0) {
        return extracted.colors.some(color => 
          productText.includes(color) || productText.includes(color + ' color')
        );
      }
      
      // Other keywords matching
      if (extracted.occasions.length > 0 || extracted.styles.length > 0) {
        const allExtracted = [...extracted.occasions, ...extracted.styles];
        return allExtracted.some(keyword => productText.includes(keyword));
      }
      
      // Fallback: partial word matching for more flexible search
      const words = term.split(' ').filter(word => word.length > 2);
      return words.some(word => productText.includes(word));
    });
    
    if (foundProducts.length > 0) {
      // Set the first matching product as selected
      setSelectedProduct(foundProducts[0]);
      setCurrentCategory(foundProducts[0].category);
      return foundProducts[0];
    }
    
    return null;
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const query = textInput.trim();
      
      // Handle greetings and conversational input
      const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
      const isGreeting = greetings.some(greeting => query.toLowerCase().includes(greeting));
      
      if (isGreeting) {
        console.log('Hello! I can help you find products. Try searching for items like "red dress", "casual bag", or "formal shoes".');
      } else {
        const foundProduct = searchProducts(query);
        if (foundProduct) {
          console.log(`Found product: ${foundProduct.name}`);
        } else {
          console.log(`No products found for: ${query}. Try searching for specific items, colors, or occasions.`);
        }
      }
      
      setTextInput("");
      setShowTextInput(false);
    }
  };

  const handlePlayPause = () => {
    try {
      console.log('Play/Pause clicked, current status:', conversation?.status);
      if (!conversation || !conversation.startSession || !conversation.endSession) {
        console.error('Conversation object or methods not available');
        return;
      }
      if (["connected", "speaking", "listening"].includes(conversation.status)) {
        conversation.endSession();
      } else {
        conversation.startSession();
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
    }
  };

  const handleMicrophoneClick = () => {
    try {
      console.log('Microphone clicked, current status:', conversation?.status);
      if (!conversation || !conversation.startSession || !conversation.endSession) {
        console.error('Conversation object or methods not available');
        return;
      }
      if (conversation.status === "listening") {
        conversation.endSession();
      } else {
        conversation.startSession();
      }
    } catch (error) {
      console.error('Error in handleMicrophoneClick:', error);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-transparent rounded-3xl p-4 border border-white/20 flex flex-col items-center text-center relative">
      {/* Completely transparent background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-transparent"></div>
      
      {/* SnapStyler assistant container */}
      <div className="w-48 h-48 aspect-square overflow-hidden z-10 relative mb-4" style={{clipPath: 'polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)', borderRadius: '20px'}}>
        {/* Removed animated pulsing ring border */}
        
        {/* AI Video */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            className={`w-full h-full object-cover transition-all duration-300 ${
              conversation.status === "listening" 
                ? "brightness-110 saturate-150 hue-rotate-15" 
                : "brightness-100 saturate-100"
            }`}
            style={{clipPath: 'polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)', borderRadius: '20px'}}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="https://cdn.dribbble.com/userupload/13642489/file/original-03aaa558084c49f75c02a78d98f8cf43.mp4" type="video/mp4" />
            {/* Fallback gradient orb if video fails to load */}
            <div className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
              conversation.status === "listening" 
                ? "bg-gradient-to-br from-red-400/30 via-red-300/20 to-red-500/30 animate-pulse" 
                : "bg-gradient-to-br from-orange-400/20 via-amber-300/10 to-orange-500/20 animate-pulse"
            }`} style={{clipPath: 'polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)', borderRadius: '20px'}}>
              <div className="text-white/60 text-sm">AI Assistant</div>
            </div>
          </video>
        </div>
      </div>
      
      {/* Microphone and Play/Pause Buttons */}
      <div className="flex items-center justify-center gap-3 mb-2">
        {/* Microphone Button */}
        <button
          onClick={handleMicrophoneClick}
          className={`p-2 rounded-full transition-all duration-300 ${
            conversation.status === "listening" 
              ? "bg-red-500/80 text-white animate-pulse shadow-xl shadow-red-500/25" 
              : "bg-orange-400/20 hover:bg-orange-400/30 text-orange-400"
          }`}
        >
          <Mic className="w-6 h-6" />
        </button>
        
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className={`p-2 rounded-full transition-all duration-300 ${
            conversation.status === "connected" 
              ? "bg-orange-400/30 text-orange-300" 
              : "bg-orange-400/20 hover:bg-orange-400/30 text-orange-400"
          }`}
        >
          {conversation.status === "connected" ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {/* Status text */}
      <div className="text-center mb-4">
        <p className="text-orange-500 font-medium text-sm bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
          {conversation.status === "listening" 
            ? "Listening..."
            : conversation.status === "speaking"
            ? "Speaking..."
            : conversation.status === "connected"
            ? "Connected"
            : "Riya AI"}
        </p>
      </div>

      {/* Text Input Alternative */}
      {showTextInput ? (
        <div className="w-full mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder="Type what you're looking for..."
              className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-white/60 text-sm focus:outline-none focus:border-orange-400/50"
              autoFocus
            />
            <button
              onClick={handleTextSubmit}
              className="px-3 py-2 bg-orange-400/20 hover:bg-orange-400/30 border border-orange-400/30 rounded-lg transition-all"
            >
              <Send className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowTextInput(true)}
          className="w-full mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-lg text-white text-sm transition-all"
        >
          Or type your request here
        </button>
      )}


    </div>
  );
};

export default RiyaVoiceAgent;
