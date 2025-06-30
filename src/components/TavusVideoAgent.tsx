import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaMicrophone, FaPause } from "react-icons/fa6";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";
import DailyIframe from "@daily-co/daily-js";
import { useShopping } from "../contexts/ShoppingContext";

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

  const updatePersonaWithShoppingCartTool = async (personaId) => {
    const updateData = [
      {
        op: "replace",
        path: "/layers/llm/tools",
        value: [
          {
            type: "function",
            function: {
              name: "search_products",
              description:
                "Use this tool when a customer asks for specific products or suggestions. Display the results naturally within the conversation. The arguments to this tool are free-form text describing the product the user is looking for.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description:
                      "Free-form text describing the product the user is looking for",
                  },
                },
                required: ["query"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "add_to_cart",
              description:
                "Use this tool when the customer wants to purchase an item. Add the product ID to the cart and confirm the addition to the user. The arguments to this tool should be the product ID of the item the user wants to add to the cart.",
              parameters: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                    description:
                      "The product ID of the item the user wants to add to the cart",
                  },
                },
                required: ["productId"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "switch_category",
              description:
                "Use this tool if the customer is discussing or switching to a specific category (e.g., 'show me some clothes or bags' or 'I'm looking for a new watch'). Pass the appropriate category name based on your knowledge base.",
              parameters: {
                type: "object",
                properties: {
                  categoryName: {
                    type: "string",
                    description:
                      "The category name the user wants to switch to",
                  },
                },
                required: ["categoryName"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "show_kart",
              description:
                "Show the cart when the user asks to checkout and wants to place the order for confirmation on what they are about to place. No arguments are needed for this tool.",
              parameters: {
                type: "object",
                properties: {},
                required: [],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "trigger_checkout",
              description:
                "Trigger this tool when the user confirms the order and says they can submit the order and complete the order, asking for confirmation before triggering the tool. No arguments are needed for this tool.",
              parameters: {
                type: "object",
                properties: {},
                required: [],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "try_on_me",
              description:
                "Use this tool when the customer wants to try on a product virtually. Make sure the user has selected a photo before triggering this tool. No arguments are needed for this tool.",
              parameters: {
                type: "object",
                properties: {},
                required: [],
              },
            },
          },
        ],
      },
    ];

    const apiKey = process.env.NEXT_PUBLIC_TAVUS_API_KEY;

    try {
      const response = await fetch(
        `https://tavusapi.com/v2/personas/${personaId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Shopping cart tool updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating persona with shopping cart tool:", error);
      throw error;
    }
  };

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

      // await updatePersonaWithShoppingCartTool(personaId);

      const response = await fetch("https://tavusapi.com/v2/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          callback_url: window.location.origin + "/api/tavus-webhook",
          conversational_context: `# Personality

You are Riya, a friendly, cheerful, and enthusiastic shopping assistant for our online store.
Your mission is to make each customer's shopping experience effortless, fun, and personalized.
You are highly knowledgeable about all products in our store—including clothing, electronics, beauty items, and home goods.
When a customer asks for product suggestions or inquires about a specific product, respond conversationally and helpfully, drawing on your product knowledge.
You show genuine excitement, just like a helpful in-store assistant would.
Dont ask too many question recommand based on first ask 

# Environment

You are assisting customers shopping in our online store via voice.
The customer cannot see the products directly, so you need to describe them clearly.
You have access to product information, categories, and the customer's shopping cart.
The customer might be using a variety of devices, including phones and smart speakers.

# Tone

Your tone is warm, approachable, and enthusiastic.
Use a conversational style, like a helpful friend.
Be positive and encouraging, making shopping fun.
Use natural speech patterns with brief affirmations ("Great choice!", "I understand").
Adapt your language to the customer's style – more casual with friendly customers, more formal when needed.

# Goal

Your primary goal is to guide customers through a seamless and enjoyable shopping experience:

1. Understand the customer's needs  trigger the tool for faster response use switch category for switch the category based on the current item :  ['Clothing', 'Bags', 'Watches', 'Shoes']  -> provide one 
2. show the product the product id based on the suggestion you have to the user 
3. Show the cart when the user asks to checkout and wants to place the order for confirmation on what they are about to place.
4. Trigger the checkout when the user confirms the order and says they can submit the order and complete the order, asking for confirmation before triggering the checkout. 

# Guardrails

Only recommend products available in our store. use knowdgle data shared 
Never provide personal opinions or biased recommendations.
Avoid discussing topics unrelated to shopping.
If you don't know an answer, admit it and offer to find out or suggest alternative solutions.
Maintain a professional and respectful tone at all times.
Do not ask for Personally Identifiable Information (PII).
Do not make assumptions about the user's needs; always ask clarifying questions.

# Tools

You have access to the following tools:

search_products: Use this tool when a customer asks for specific products or suggestions. Display the results naturally within the conversation. The arguments to this tool are free-form text describing the product the user is looking for.

add_to_cart: Use this tool when the customer wants to purchase an item. Add the product ID to the cart and confirm the addition to the user. The arguments to this tool should be the product ID of the item the user wants to add to the cart.

switch_category: switch category for switch the category based on the current discussion automatic :  ['Clothing', 'Bags', 'Watches', 'Shoes']  -> provide one 

show_kart: Show the cart when the user asks to checkout and wants to place the order for confirmation on what they are about to place. No arguments are needed for this tool.

trigger_checkout: Trigger this tool when the user confirms the order and says they can submit the order and complete the order, asking for confirmation before triggering the tool. No arguments are needed for this tool.


“try_on_me”: before trigger this make sure use selected the photo which he want to try on himself  
Your store Products: [dont mention anything outside here]

## Product Catalog (10 Featured Items)

| ID | Category | Keywords |
|----|----------|----------|
| 16 | Clothing | Denim, pink, Pinkandblack, Jacket, LV, Cute, trendy, chic |
| 32 | Bags | Iconic Handbag, Louis Vuitton, Small, Cute, Handy, Original |
| 33 | Bags | Premium Tote Bag, Blue, Monogram, Denim, Louis Vuitton, Officewear, Sophisticated Design |
| 34 | Bags | Brown, Monogram, Canvas, Louis Vuitton, Hide Away, Workwear, Weekendwear |
| 8 | Clothing | Denim, A-line Dress, Louis Vuitton, Dresses, Clothing, Elegant |
| 9 | Shoes | LV Isola, Flat Mule, Stylish, Signature Design |
| 13 | Clothing | Knit Dress, Navy, Made in Italy, Sleeveless, Louis Vuitton, Stylish, Vintage |
| 14 | Clothing | Red Color, Louis Vuitton, silk, Christmas, Elegant, Longdress, fulllength, Sleeveless |
| 18 | Watches | steel, white, navy, sporty |
| 20 | Watches | 18-carat, white gold, spin time, dolphin, limited edition |

## Detailed Product Information:

**Clothing:**
- ID 16: Embroidered Accent Denim Jacket - $4650 (Premium denim jacket with intricate embroidered accents)
- ID 8: Louis Vuitton Monogram Denim Dress - $3250 (Elegant floral jacquard A-line dress)
- ID 13: Signature Accent Knit Dress - $4300 (Luxurious signature accent knit dress with refined details)
- ID 14: Striped Lavalliere Dress - $4750 (Elegant striped lavalliere dress with sophisticated styling)

**Bags:**
- ID 32: Alma BB - $1900 (Iconic structured handbag with timeless appeal)
- ID 33: OnTheGo PM - $4000 (Premium tote bag with sophisticated design and ample space)
- ID 34: Hide Away MM - $3400 (Versatile handbag with modern design and practical functionality)

**Shoes:**
- ID 9: Louis Vuitton LV Isola Flat Mule - $795 (Stylish flat mule with signature LV design elements)

**Watches:**
- ID 18: Tambour Street Diver - $5965 (Professional diving watch with quartz movement and steel construction)
- ID 20: Tambour Taiko Spin Time Air - $85500 (Limited Edition masterpiece with flying tourbillon)
`,
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
        console.log("Tool call message received:", message);
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

              // Handle multiple argument formats
              const query =
                parsedArgs.query ||
                parsedArgs.type?.productID ||
                parsedArgs.productID;

              if (!query) {
                console.error("Search query is required");
                return "I'm sorry, I need a search query to find products.";
              }

              // Enhanced search logic - check keywords, name, category, and description
              const searchResults = products.filter((product) => {
                const searchTerm = query.toLowerCase();
                return (
                  product.name.toLowerCase().includes(searchTerm) ||
                  product.category.toLowerCase().includes(searchTerm) ||
                  (product.description &&
                    product.description.toLowerCase().includes(searchTerm)) ||
                  (product.keyWords &&
                    product.keyWords.some((keyword) =>
                      keyword.toLowerCase().includes(searchTerm)
                    ))
                );
              });

              console.log(
                `Found ${searchResults.length} products for query: "${query}"`
              );

              // Set first result as selected if available
              if (searchResults.length > 0) {
                setSelectedProduct(searchResults[0]);
                setCurrentCategory(searchResults[0].category);
                result = `I found ${searchResults.length} products matching "${query}". I've selected the ${searchResults[0].name} for you to view.`;
              } else {
                result = `I'm sorry, I couldn't find any products matching "${query}". Please try a different search term.`;
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
                // Find product by ID
                const productToAdd = products.find((p) => p.id === productId);
                if (productToAdd) {
                  addToCart(productToAdd);
                  console.log(`Added ${productToAdd.name} to cart`);
                  result = `I've added the ${productToAdd.name} to your cart for $${productToAdd.price}.`;
                } else {
                  console.error("Product not found with ID:", productId);
                  result = "I'm sorry, I couldn't find that product to add to your cart.";
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
                result = "I'm sorry, please select a product first or specify which product you'd like to add to your cart.";
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
                  setSelectedProduct(categoryProducts[0]);
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
                result = "I've opened your cart. It's currently empty. Would you like me to help you find some products?";
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
                result = "Please select a photo first. I've opened the photo selection modal for you.";
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
                result: result
              }
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
                result: "I'm sorry, there was an error processing your request."
              }
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
          experimentalChromeVideoMuteLightOff: true,
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
