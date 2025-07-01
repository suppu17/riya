import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaMicrophone, FaPause } from "react-icons/fa6";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";
import DailyIframe from "@daily-co/daily-js";
import { useShopping } from "../contexts/ShoppingContext";
import {
  tavusConfig,
  updatePersonaWithShoppingCartTool,
} from "../config/tavusConfig";

interface TavusVideoAgentProps {
  onClose: () => void;
  autoStart?: boolean;
}

interface ConversationMessage {
  text: string;
  timestamp: Date;
  speaker: "user" | "agent";
}

const TavusVideoAgent: React.FC<TavusVideoAgentProps> = ({
  onClose,
  autoStart = false,
}) => {
  const {
    products,
    setSelectedProduct,
    smoothProductChange,
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

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [error, setError] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);
  const [conversationUrl, setConversationUrl] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [callObject, setCallObject] = useState<any>(null);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [participantId, setParticipantId] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Refs for media elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-start conversation when autoStart is true
  useEffect(() => {
    if (autoStart && !isAvatarVisible && !isLoading) {
      startConversation();
    }
  }, [autoStart]);

  // Tavus configuration - you'll need to set these in your environment
  const replicaId = import.meta.env.VITE_TAVUS_REPLICA_ID || "r785cb52c85";
  const personaId = import.meta.env.VITE_TAVUS_PERSONA_ID || "p9c2a1e5f3";

  /**
   * Creates a new Tavus conversation
   */
  const createTavusConversation = async () => {
    try {
      const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Tavus API key is not configured. Please add VITE_TAVUS_API_KEY to your .env file."
        );
      }

      console.log("Creating Tavus conversation...");

      await updatePersonaWithShoppingCartTool(personaId);

      const conversational_context = tavusConfig.getPromptText();

      const response = await fetch("https://tavusapi.com/v2/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          callback_url: `${window.location.origin}/api/tavus-webhook`,
          conversational_context,
          custom_greeting: "Hello, I'm Riya, your AI stylist agent. ",
          properties: {
            max_call_duration: 3600,
            participant_left_timeout: 60,
            enable_recording: false,
            enable_transcription: true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create conversation: ${
            errorData.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      console.log("Tavus conversation created:", data);

      setConversationUrl(data.conversation_url);
      setConversationId(data.conversation_id);

      return data.conversation_url;
    } catch (error) {
      console.error("Error creating Tavus conversation:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create conversation"
      );
      throw error;
    }
  };

  const processMessage = useCallback(
    async (message: any) => {
      if (message.event_type === "conversation.tool_call") {
        console.log("Tool call:", message);
        const { name, arguments: args, tool_call_id } = message.properties;

        try {
          const parsedArgs = JSON.parse(args);
          console.log(`Processing tool: ${name} with args:`, parsedArgs);

          let result = "";

          switch (name) {
            case "search_products": {
              console.log(
                "from search_products:",
                JSON.stringify(parsedArgs, null, 2)
              );

              const query =
                parsedArgs.query ||
                parsedArgs.productID ||
                parsedArgs.type?.productID ||
                parsedArgs.productID;

              const searchContext = parsedArgs.searchContext || {};
              const searchType = parsedArgs.type?.searchType || 'semantic';

              if (!query) {
                console.error("Search query is required");
                return "I'm sorry, I need a search query to find products.";
              }

              // Extract context from natural language query
              const extractContextFromQuery = (query: string) => {
                const lowerQuery = query.toLowerCase();
                const extractedContext: any = {};
                
                // Extract occasion context
                if (lowerQuery.includes('business') || lowerQuery.includes('work') || lowerQuery.includes('office')) {
                  extractedContext.occasion = 'business';
                } else if (lowerQuery.includes('formal') || lowerQuery.includes('elegant') || lowerQuery.includes('sophisticated')) {
                  extractedContext.occasion = 'formal';
                } else if (lowerQuery.includes('casual') || lowerQuery.includes('everyday') || lowerQuery.includes('relaxed')) {
                  extractedContext.occasion = 'casual';
                } else if (lowerQuery.includes('evening') || lowerQuery.includes('night') || lowerQuery.includes('dinner')) {
                  extractedContext.occasion = 'evening';
                } else if (lowerQuery.includes('weekend') || lowerQuery.includes('leisure')) {
                  extractedContext.occasion = 'weekend';
                }
                
                // Extract price context
                if (lowerQuery.includes('affordable') || lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
                  extractedContext.priceRange = 'affordable';
                } else if (lowerQuery.includes('luxury') || lowerQuery.includes('premium') || lowerQuery.includes('expensive')) {
                  extractedContext.priceRange = 'luxury';
                } else if (lowerQuery.includes('mid-range') || lowerQuery.includes('moderate')) {
                  extractedContext.priceRange = 'mid-range';
                }
                
                // Extract price ranges with numbers
                const priceMatch = lowerQuery.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|less than\s*\$?(\d+)/);
                if (priceMatch) {
                  const amount = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
                  extractedContext.priceRange = `under $${amount}`;
                }
                
                // Extract style context
                if (lowerQuery.includes('modern') || lowerQuery.includes('contemporary')) {
                  extractedContext.style = 'modern';
                } else if (lowerQuery.includes('classic') || lowerQuery.includes('timeless') || lowerQuery.includes('traditional')) {
                  extractedContext.style = 'classic';
                } else if (lowerQuery.includes('trendy') || lowerQuery.includes('fashionable') || lowerQuery.includes('stylish')) {
                  extractedContext.style = 'trendy';
                } else if (lowerQuery.includes('vintage') || lowerQuery.includes('retro')) {
                  extractedContext.style = 'vintage';
                } else if (lowerQuery.includes('minimalist') || lowerQuery.includes('simple') || lowerQuery.includes('clean')) {
                  extractedContext.style = 'minimalist';
                }
                
                // Extract color context
                const colors = ['red', 'blue', 'black', 'white', 'brown', 'navy', 'crimson', 'rust', 'pink', 'green', 'yellow', 'purple', 'gray', 'grey'];
                for (const color of colors) {
                  if (lowerQuery.includes(color)) {
                    extractedContext.color = color;
                    break;
                  }
                }
                
                return extractedContext;
              };
              
              // Merge extracted context with provided context
              const extractedContext = extractContextFromQuery(query);
              const mergedContext = { ...extractedContext, ...searchContext };
              
              // Helper function to select the best product using AI reasoning
              const selectBestProduct = (products: any[], context: any, query: string) => {
                let bestProduct = products[0];
                let highestScore = 0;
                
                products.forEach(product => {
                  let score = 0;
                  const productText = `${product.name} ${product.description} ${product.keyWords?.join(' ') || ''}`.toLowerCase();
                  const queryLower = query.toLowerCase();
                  
                  // Category matching (highest priority)
                  const categoryKeywords = {
                    'bag': ['bag', 'bags', 'handbag', 'purse', 'tote', 'clutch', 'backpack'],
                    'clothing': ['jacket', 'dress', 'top', 'shirt', 'blouse', 'sweater', 'coat'],
                    'shoes': ['shoes', 'shoe', 'boots', 'sneakers', 'heels', 'sandals'],
                    'watches': ['watch', 'watches', 'timepiece']
                  };
                  
                  for (const [category, keywords] of Object.entries(categoryKeywords)) {
                    if (keywords.some(keyword => queryLower.includes(keyword))) {
                      if (product.category.toLowerCase().includes(category) || 
                          keywords.some(keyword => product.category.toLowerCase().includes(keyword))) {
                        score += 100; // Very high priority for category match
                      }
                    }
                  }
                  
                  // Color preference (high priority)
                  if (context.color) {
                    const colorKeywords = context.color.toLowerCase();
                    if (productText.includes(colorKeywords)) score += 80;
                    // Handle color variations
                    if (colorKeywords === 'red' && (productText.includes('crimson') || productText.includes('rust'))) score += 70;
                    if (colorKeywords === 'blue' && (productText.includes('navy') || productText.includes('azure'))) score += 70;
                    if (colorKeywords === 'white' && (productText.includes('ivory') || productText.includes('cream'))) score += 70;
                  }
                  
                  // Query relevance (exact matches get higher scores)
                  const queryWords = queryLower.split(' ');
                  queryWords.forEach(word => {
                    if (word.length > 2) { // Skip short words
                      if (product.name.toLowerCase().includes(word)) score += 30;
                      else if (productText.includes(word)) score += 15;
                    }
                  });
                  
                  // Style and occasion preference
                  if (context.style) {
                    const styleKeywords = context.style.toLowerCase();
                    if (productText.includes(styleKeywords)) score += 25;
                  }
                  
                  if (context.occasion) {
                    const occasionKeywords = context.occasion.toLowerCase();
                    if (productText.includes(occasionKeywords)) score += 25;
                  }
                  
                  // Price preference scoring
                  if (context.priceRange) {
                    const price = product.price;
                    if (context.priceRange === 'budget' && price < 100) score += 20;
                    else if (context.priceRange === 'mid-range' && price >= 100 && price <= 500) score += 20;
                    else if (context.priceRange === 'luxury' && price > 500) score += 20;
                    else if (typeof context.priceRange === 'object') {
                      const { min, max } = context.priceRange;
                      if (price >= min && price <= max) score += 20;
                    }
                  }
                  
                  // Brand preference (if luxury brands mentioned)
                  const luxuryBrands = ['louis vuitton', 'lv', 'chanel', 'gucci', 'prada', 'dior'];
                  const productBrand = product.name.toLowerCase();
                  if (luxuryBrands.some(brand => productBrand.includes(brand) || queryLower.includes(brand))) {
                    score += 15;
                  }
                  
                  if (score > highestScore) {
                    highestScore = score;
                    bestProduct = product;
                  }
                });
                
                // Log detailed scoring for debugging
                const scoringResults = products.map(product => {
                  let debugScore = 0;
                  const productText = `${product.name} ${product.description} ${product.keyWords?.join(' ') || ''}`.toLowerCase();
                  const queryLower = query.toLowerCase();
                  
                  // Recalculate score for logging
                  const categoryKeywords = {
                    'bag': ['bag', 'bags', 'handbag', 'purse', 'tote', 'clutch', 'backpack'],
                    'clothing': ['jacket', 'dress', 'top', 'shirt', 'blouse', 'sweater', 'coat'],
                    'shoes': ['shoes', 'shoe', 'boots', 'sneakers', 'heels', 'sandals'],
                    'watches': ['watch', 'watches', 'timepiece']
                  };
                  
                  let categoryScore = 0;
                  for (const [category, keywords] of Object.entries(categoryKeywords)) {
                    if (keywords.some(keyword => queryLower.includes(keyword))) {
                      if (product.category.toLowerCase().includes(category) || 
                          keywords.some(keyword => product.category.toLowerCase().includes(keyword))) {
                        categoryScore = 100;
                        debugScore += 100;
                        break;
                      }
                    }
                  }
                  
                  let colorScore = 0;
                  if (context.color) {
                    const colorKeywords = context.color.toLowerCase();
                    if (productText.includes(colorKeywords)) {
                      colorScore = 80;
                      debugScore += 80;
                    }
                  }
                  
                  return {
                    name: product.name,
                    category: product.category,
                    totalScore: debugScore,
                    categoryScore,
                    colorScore,
                    isSelected: product === bestProduct
                  };
                });
                
                console.log('selectBestProduct detailed scoring:', {
                  query,
                  context,
                  results: scoringResults,
                  selectedProduct: bestProduct.name
                });
                
                return bestProduct;
              };
              
              // LLM-powered intelligent search with context understanding
              const performIntelligentSearch = (query: string, context: any, type: string) => {
                const searchTerms = query.toLowerCase().split(' ');
                let scoredProducts = products.map(product => {
                  let score = 0;
                  const searchableText = [
                    product.name,
                    product.category,
                    product.description || '',
                    ...(product.keyWords || [])
                  ].join(' ').toLowerCase();

                  // Category matching (highest priority)
                  const categoryKeywords = {
                    'bag': ['bag', 'bags', 'handbag', 'purse', 'tote', 'clutch', 'backpack'],
                    'clothing': ['jacket', 'dress', 'top', 'shirt', 'blouse', 'sweater', 'coat'],
                    'shoes': ['shoes', 'shoe', 'boots', 'sneakers', 'heels', 'sandals'],
                    'watches': ['watch', 'watches', 'timepiece']
                  };
                  
                  // Check if query matches product category
                  for (const [category, keywords] of Object.entries(categoryKeywords)) {
                    if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
                      if (product.category.toLowerCase().includes(category) || 
                          keywords.some(keyword => product.category.toLowerCase().includes(keyword))) {
                        score += 50; // High priority for category match
                      }
                    }
                  }

                  // Base keyword matching
                  searchTerms.forEach(term => {
                    if (searchableText.includes(term)) {
                      score += 10;
                    }
                    // Partial matching for similar words
                    if (searchableText.includes(term.substring(0, Math.max(3, term.length - 2)))) {
                      score += 5;
                    }
                  });

                  // Context-aware scoring
                  if (context.occasion) {
                    const occasion = context.occasion.toLowerCase();
                    if (occasion === 'business' || occasion === 'formal') {
                      if (searchableText.includes('blazer') || searchableText.includes('formal') || 
                          searchableText.includes('professional') || searchableText.includes('elegant')) {
                        score += 15;
                      }
                    }
                    if (occasion === 'casual' || occasion === 'weekend') {
                      if (searchableText.includes('casual') || searchableText.includes('denim') || 
                          searchableText.includes('trendy') || searchableText.includes('comfortable')) {
                        score += 15;
                      }
                    }
                    if (occasion === 'evening') {
                      if (searchableText.includes('elegant') || searchableText.includes('sophisticated') || 
                          searchableText.includes('luxurious') || searchableText.includes('dress')) {
                        score += 15;
                      }
                    }
                  }

                  // Price range scoring
                  if (context.priceRange) {
                    const priceRange = context.priceRange.toLowerCase();
                    if (priceRange.includes('affordable') || priceRange.includes('under')) {
                      if (product.price < 1500) score += 10;
                    }
                    if (priceRange.includes('luxury') || priceRange.includes('premium')) {
                      if (product.price > 2000) score += 10;
                    }
                    if (priceRange.includes('mid-range')) {
                      if (product.price >= 1000 && product.price <= 2500) score += 10;
                    }
                  }

                  // Style scoring
                  if (context.style) {
                    const style = context.style.toLowerCase();
                    if (style === 'modern' || style === 'contemporary') {
                      if (searchableText.includes('modern') || searchableText.includes('contemporary') || 
                          searchableText.includes('sleek')) {
                        score += 12;
                      }
                    }
                    if (style === 'classic' || style === 'timeless') {
                      if (searchableText.includes('classic') || searchableText.includes('timeless') || 
                          searchableText.includes('iconic')) {
                        score += 12;
                      }
                    }
                    if (style === 'trendy' || style === 'fashionable') {
                      if (searchableText.includes('trendy') || searchableText.includes('chic') || 
                          searchableText.includes('stylish')) {
                        score += 12;
                      }
                    }
                  }

                  // Color scoring (high priority)
                  if (context.color) {
                    const color = context.color.toLowerCase();
                    if (searchableText.includes(color)) {
                      score += 40; // Increased priority for color match
                    }
                    // Handle color variations
                    if (color === 'red' && (searchableText.includes('crimson') || searchableText.includes('rust'))) {
                      score += 35;
                    }
                    if (color === 'blue' && (searchableText.includes('navy') || searchableText.includes('azure'))) {
                      score += 35;
                    }
                    if (color === 'white' && (searchableText.includes('ivory') || searchableText.includes('cream'))) {
                      score += 35;
                    }
                  }

                  return { product, score };
                }).filter(item => item.score > 0)
                  .sort((a, b) => b.score - a.score);

                return scoredProducts.map(item => item.product);
              };

              const searchResults = performIntelligentSearch(query, mergedContext, searchType);

              console.log(
                 `Found ${searchResults.length} products for query: "${query}" with context:`,
                 mergedContext
               );

              // Set best result as selected if available
              if (searchResults.length > 0) {
                // Use AI reasoning to select the best product from search results
                const selectedProduct = selectBestProduct(searchResults, mergedContext, query);
                
                smoothProductChange(selectedProduct);
                setCurrentCategory(selectedProduct.category);
                
                // Generate contextual response
                 let contextualInfo = '';
                 if (mergedContext.occasion) {
                   contextualInfo += ` perfect for ${mergedContext.occasion} occasions`;
                 }
                 if (mergedContext.style) {
                   contextualInfo += ` with a ${mergedContext.style} style`;
                 }
                 if (mergedContext.color) {
                   contextualInfo += ` in ${mergedContext.color}`;
                 }
                 
                 // Provide multiple recommendations
                 const topRecommendations = searchResults.slice(0, 5).map(product => ({
                   id: product.id,
                   name: product.name,
                   price: product.price,
                   category: product.category,
                   description: product.description
                 }));
                 
                 // Return single product recommendation with additional context
                 result = `Perfect! I found the ideal match for you: **${selectedProduct.name}** (ID: ${selectedProduct.id}) - $${selectedProduct.price}. ${selectedProduct.description}${contextualInfo}. This is my top recommendation based on your preferences${searchResults.length > 1 ? ` from ${searchResults.length} matching products` : ''}. Would you like to add it to your cart or see more details?`;
                 
                 console.log('AI Selected Best Product:', { id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, category: selectedProduct.category, totalFound: searchResults.length });
              } else {
                // Enhanced fallback with intelligent single product recommendation
                const fallbackProducts = [];
                
                // Check for color-based suggestions
                if (extractedContext.color || mergedContext.color) {
                  const colorQuery = extractedContext.color || mergedContext.color;
                  const colorProducts = products.filter(product => {
                    const searchText = `${product.name} ${product.description} ${product.keyWords?.join(' ') || ''}`.toLowerCase();
                    return searchText.includes(colorQuery.toLowerCase());
                  });
                  fallbackProducts.push(...colorProducts);
                }
                
                // Check for category-based suggestions
                const queryWords = query.toLowerCase().split(' ');
                const categoryKeywords = ['jacket', 'bag', 'dress', 'shoes', 'top', 'bottom', 'accessory'];
                
                queryWords.forEach(word => {
                  if (categoryKeywords.includes(word)) {
                    const categoryProducts = products.filter(product => 
                      product.category.toLowerCase().includes(word) ||
                      product.name.toLowerCase().includes(word)
                    );
                    fallbackProducts.push(...categoryProducts);
                  }
                });
                
                // Remove duplicates
                const uniqueFallbackProducts = Array.from(new Set(fallbackProducts.map(p => p.id)))
                  .map(id => fallbackProducts.find(p => p.id === id));
                
                if (uniqueFallbackProducts.length > 0) {
                  // Use AI reasoning to select the best fallback product
                  const bestFallback = uniqueFallbackProducts.length > 1 
                    ? selectBestProduct(uniqueFallbackProducts, mergedContext, query)
                    : uniqueFallbackProducts[0];
                  
                  smoothProductChange(bestFallback);
                  setCurrentCategory(bestFallback.category);
                  result = `I couldn't find an exact match for "${query}", but here's my best recommendation: **${bestFallback.name}** (ID: ${bestFallback.id}) - $${bestFallback.price}. ${bestFallback.description}. This matches some of your criteria${contextualInfo}. Would you like to see this or would you prefer to refine your search with more specific details like style, occasion, or budget?`;
                } else {
                  result = `I'm sorry, we don't have that product which you are looking for. I couldn't find any products matching "${query}"${contextualInfo}. To help me find the perfect item for you, could you please tell me more about: 1) What type of item are you looking for? 2) What's the occasion? 3) Any color preferences? 4) Your budget range? This will help me give you the best recommendation!`;
                }
              }
              
              break;

            }

            case "add_to_cart": {
              console.log(
                "from add_to_cart:",
                JSON.stringify(parsedArgs, null, 2)
              );

              // Handle multiple argument formats
              const productId =
                parsedArgs.productId ||
                parsedArgs.type?.ProductID ||
                parsedArgs.type?.productID;

              if (productId) {
                // Convert productId to string since our product IDs are strings
                const productIdString = String(productId);
                
                // Find product by ID
                const productToAdd = products.find((p) => p.id === productIdString);
                if (productToAdd) {
                  addToCart(productToAdd);
                  console.log(`Added ${productToAdd.name} to cart`);
                  result = `I've added the ${productToAdd.name} to your cart for $${productToAdd.price}.`;
                } else {
                  console.error("Product not found with ID:", productIdString);
                  console.log("Available product IDs:", products.slice(0, 5).map(p => p.id));
                  result =
                    "I'm sorry, I couldn't find that product to add to your cart.";
                }
              } else if (selectedProduct) {
                // Use currently selected product
                addToCart(selectedProduct);
                console.log(`Added ${selectedProduct.name} to cart`);
                result = `I've added the ${selectedProduct.name} to your cart for $${selectedProduct.price}.`;
              } else {
                console.error(
                  "No product specified or selected for cart addition"
                );
                result =
                  "I'm sorry, please select a product first or specify which product you'd like to add to your cart.";
              }
              break;
            }

            case "switch_category": {
              console.log(
                "from switch_category:",
                JSON.stringify(parsedArgs, null, 2)
              );
              const availableCategories = [
                "Clothing",
                "Bags",
                "Watches",
                "Shoes",
              ];

              // Handle multiple argument formats
              const categoryName =
                parsedArgs.category ||
                parsedArgs.categoryName ||
                parsedArgs.type?.category ||
                parsedArgs["type"]?.category;

              console.log("Raw query object:", parsedArgs);
              console.log("Extracted categoryName:", categoryName);

              if (!categoryName) {
                console.error("Category name is required");
                result = "I'm sorry, I need a category name to switch to.";
                break;
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
                console.log(`Switched to category: ${matchedCategory}`);

                // Filter products by category and set first as selected
                const categoryProducts = products.filter(
                  (p) => p.category === matchedCategory
                );
                
                if (categoryProducts.length > 0) {
                  // If there's a specific product preference, try to find it
                  let selectedCategoryProduct = categoryProducts[0];
                  
                  if (parsedArgs.preference) {
                    const preferredProduct = categoryProducts.find(product => 
                      product.name.toLowerCase().includes(parsedArgs.preference.toLowerCase()) ||
                      product.description?.toLowerCase().includes(parsedArgs.preference.toLowerCase())
                    );
                    if (preferredProduct) {
                      selectedCategoryProduct = preferredProduct;
                    }
                  }
                  
                  // Use smoothProductChange for better UI transitions
                  smoothProductChange(selectedCategoryProduct);
                  
                  console.log(`Category switched to ${matchedCategory}, selected product: ${selectedCategoryProduct.name}`);
                }

                result = `I've switched to the ${matchedCategory} category and found ${
                  categoryProducts.length
                } products. ${
                  categoryProducts.length > 0
                    ? `I've selected the ${categoryProducts[0].name} for you to view.`
                    : ""
                }`;
              } else {
                console.error("Category not found:", categoryName);
                console.log("Available categories:", availableCategories);
                result = `I'm sorry, I couldn't find the "${categoryName}" category. Available categories are: ${availableCategories.join(
                  ", "
                )}.`;
              }
              break;
            }

            case "show_kart": {
              console.log("from show_kart: Opening cart modal");

              // Trigger the cart modal to open
              openCartModal();

              if (cart.length === 0) {
                result =
                  "I've opened your cart. It's currently empty. Would you like me to help you find some products?";
              } else {
                const totalItems = cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                const totalPrice = cart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );

                result = `I've opened your cart for you. You have ${totalItems} items totaling $${totalPrice.toFixed(
                  2
                )}.`;
              }
              break;
            }

            case "trigger_checkout": {
              console.log("from trigger_checkout: Processing checkout");

              // Trigger the cart modal to open
              openCartModal();

              // Use setTimeout to handle async operation
              setTimeout(async () => {
                // Wait a moment for the modal to render
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Use the cartModalRef to trigger the checkout button
                if (cartModalRef.current) {
                  await cartModalRef.current.triggerCheckout();
                }
              }, 0);

              result = "Processing checkout. Please wait...";
              break;
            }

            case "try_on_me": {
              console.log("from try_on_me: Triggering try-on functionality");
              console.log(
                "try_on_me called - selectedProduct:",
                selectedProduct?.name,
                "selectedModelId:",
                selectedModelId
              );

              if (!selectedProduct) {
                result = "Please select a product first before trying it on.";
                break;
              }

              if (!selectedModelId) {
                console.log("No selectedModelId found, opening photo modal");
                openPhotoModal();
                result =
                  "Please select a photo first. I've opened the photo selection modal for you.";
                break;
              }

              // Handle async operation with setTimeout
              setTimeout(async () => {
                try {
                  await handleTryOnMe();
                } catch (error) {
                  console.error("Try-on error:", error);
                }
              }, 0);

              result = `I'm starting the try-on process for the ${selectedProduct.name}. This may take a moment to generate your virtual try-on image.`;
              break;
            }

            default:
              console.warn("Unknown tool call:", name);
              result = "I'm sorry, I don't understand that request.";
              break;
          }

          // Send the tool call result back to Tavus
          if (callObject && tool_call_id) {
            console.log(`Sending tool result for ${name}:`, result);
            callObject.sendAppMessage({
              event_type: "conversation.tool_call_result",
              properties: {
                tool_call_id: tool_call_id,
                result: result,
              },
            });
          }
        } catch (error) {
          console.error("Error processing tool call:", error);
          // Send error result back to Tavus
          if (callObject && tool_call_id) {
            callObject.sendAppMessage({
              event_type: "conversation.tool_call_result",
              properties: {
                tool_call_id: tool_call_id,
                result:
                  "I'm sorry, there was an error processing your request.",
              },
            });
          }
        }
      }
    },
    [
      products,
      selectedProduct,
      addToCart,
      setSelectedProduct,
      setCurrentCategory,
      cart,
      clearCart,
      openCartModal,
      cartModalRef,
      handleTryOnMe,
      selectedModelId,
      openPhotoModal,
      callObject,
    ]
  );

  /**
   * Initializes the Daily.js call object
   */
  const initializeDailyFrame = async (conversationUrl: string) => {
    try {
      console.log("Initializing Daily.js call object...");

      const newCallObject = DailyIframe.createCallObject({
        dailyConfig: {
          disableNotifications: true,
          disablePipButton: true,
          disableReactions: true,
          disableScreenshare: true,
          disableParticipantsBar: true,
          disableVideoProcessing: false,
          hideParticipantsBar: true,
        },
      });

      setCallObject(newCallObject);

      // Set up event listeners
      newCallObject.on("joined-meeting", handleJoinedMeeting);
      newCallObject.on("participant-joined", handleParticipantJoined);
      newCallObject.on("participant-left", handleParticipantLeft);
      newCallObject.on("track-started", handleTrackStarted);
      newCallObject.on("track-stopped", handleTrackStopped);
      newCallObject.on("error", handleCallError);
      newCallObject.on("left-meeting", handleLeftMeeting);

      newCallObject.on("app-message", async (event: any) => {
        await processMessage(event.data);
      });
      // Join the call
      await newCallObject.join({ url: conversationUrl });

      console.log("Successfully joined Daily.js call");
    } catch (error) {
      console.error("Error initializing Daily.js:", error);
      setError("Failed to initialize video call");
    }
  };

  // Event handlers
  const handleJoinedMeeting = useCallback((event: any) => {
    console.log("Joined meeting:", event);
    setIsAvatarVisible(true);
  }, []);

  const handleParticipantJoined = useCallback((event: any) => {
    console.log("Participant joined:", event);
    setParticipantId(event.participant.session_id);
  }, []);

  const handleParticipantLeft = useCallback((event: any) => {
    console.log("Participant left:", event);
  }, []);

  const handleTrackStarted = useCallback((event: any) => {
    console.log("Track started:", event);
    const { track, participant } = event;

    if (track.kind === "video") {
      setVideoTrack(track);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([track]);
        videoRef.current.play().catch(console.error);
      }
    } else if (track.kind === "audio") {
      setAudioTrack(track);
      if (audioRef.current) {
        audioRef.current.srcObject = new MediaStream([track]);
        audioRef.current.play().catch(console.error);
      }
    }
  }, []);

  const handleTrackStopped = useCallback((event: any) => {
    console.log("Track stopped:", event);
    const { track } = event;

    if (track.kind === "video") {
      setVideoTrack(null);
    } else if (track.kind === "audio") {
      setAudioTrack(null);
    }
  }, []);

  const handleCallError = useCallback((event: any) => {
    console.error("Call error:", event);
    setError("Video call error occurred");
  }, []);

  const handleLeftMeeting = useCallback((event: any) => {
    console.log("Left meeting:", event);
    setIsAvatarVisible(false);
  }, []);

  /**
   * Starts the video conversation
   */
  const startConversation = async () => {
    try {
      setIsLoading(true);
      setError("");

      const conversationUrl = await createTavusConversation();
      await initializeDailyFrame(conversationUrl);
    } catch (error) {
      console.error("Error starting conversation:", error);
      setError(
        error instanceof Error ? error.message : "Failed to start conversation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ends the conversation
   */
  const endConversation = async () => {
    try {
      if (callObject) {
        await callObject.leave();
        await callObject.destroy();
        setCallObject(null);
      }

      setIsAvatarVisible(false);
      setVideoTrack(null);
      setAudioTrack(null);
      setConversationUrl("");
      setConversationId("");
      setParticipantId("");

      onClose();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  /**
   * Toggles microphone mute
   */
  const toggleMute = async () => {
    if (callObject) {
      const newMutedState = !isMuted;
      await callObject.setLocalAudio(!newMutedState);
      setIsMuted(newMutedState);
    }
  };

  /**
   * Toggles video on/off
   */
  const toggleVideo = async () => {
    if (callObject) {
      const newVideoState = !isVideoEnabled;
      await callObject.setLocalVideo(newVideoState);
      setIsVideoEnabled(newVideoState);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  // When used in embedded mode (autoStart), show only the video content
  if (autoStart) {
    return (
      <div ref={containerRef} className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/80">Connecting to Riya...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-300 text-xl">!</span>
            </div>
            <p className="text-red-300 text-sm text-center mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          className={`w-full h-full object-cover rounded-2xl ${
            isAvatarVisible ? "block" : "hidden"
          }`}
        />

        {/* Audio Element */}
        <audio ref={audioRef} autoPlay playsInline />

        {/* Show placeholder when not connected */}
        {!isAvatarVisible && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original full component for standalone use
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 text-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">R</span>
            </div>
            <div>
              <h3 className="font-semibold">Riya Video Call</h3>
              <p className="text-white/60 text-xs">
                {isAvatarVisible ? "Connected" : "Ready to connect"}
              </p>
            </div>
          </div>

          {isAvatarVisible && (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isMuted
                    ? "bg-red-500/30 text-red-300"
                    : "bg-white/20 text-white"
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  !isVideoEnabled
                    ? "bg-red-500/30 text-red-300"
                    : "bg-white/20 text-white"
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <VideoOff className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={endConversation}
                className="w-8 h-8 bg-red-500/30 text-red-300 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div ref={containerRef} className="relative aspect-video bg-black/20">
        {!isAvatarVisible && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h4 className="font-semibold mb-2">Start Video Call with Riya</h4>
            <p className="text-white/60 text-sm text-center mb-4">
              Have a face-to-face conversation with your AI fashion stylist
            </p>
            <button
              onClick={startConversation}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
              Start Video Call
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/80">Connecting to Riya...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-300 text-xl">!</span>
            </div>
            <p className="text-red-300 text-sm text-center mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          className={`w-full h-full object-cover ${
            isAvatarVisible ? "block" : "hidden"
          }`}
        />

        {/* Audio Element */}
        <audio ref={audioRef} autoPlay playsInline />
      </div>

      {/* Status Bar */}
      {isAvatarVisible && (
        <div className="p-3 bg-black/20 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live conversation with Riya</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Audio: {isMuted ? "Muted" : "On"}</span>
              <span>Video: {isVideoEnabled ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavusVideoAgent;
