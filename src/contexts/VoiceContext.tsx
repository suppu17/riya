import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface VoiceContextType {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  response: string;
  startListening: () => void;
  stopListening: () => void;
  processVoiceCommand: (command: string) => void;
  clearTranscript: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          processVoiceCommand(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setResponse('Sorry, I couldn\'t hear you clearly. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setResponse('Voice recognition is not supported in your browser.');
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const lowerCommand = command.toLowerCase();
      let aiResponse = '';

      if (lowerCommand.includes('search') || lowerCommand.includes('find')) {
        aiResponse = 'I found several products matching your search. Take a look at the results below.';
      } else if (lowerCommand.includes('cart') || lowerCommand.includes('shopping')) {
        aiResponse = 'Here\'s your shopping cart. You can review your items and proceed to checkout.';
      } else if (lowerCommand.includes('recommend') || lowerCommand.includes('suggest')) {
        aiResponse = 'Based on your preferences, I recommend checking out our featured products section.';
      } else if (lowerCommand.includes('price') || lowerCommand.includes('cost')) {
        aiResponse = 'I can help you find products within your budget. What\'s your price range?';
      } else {
        aiResponse = 'I\'m here to help with your shopping experience. Try asking me to search for products, check your cart, or get recommendations.';
      }

      setResponse(aiResponse);
      setIsProcessing(false);

      // Text-to-speech response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setResponse('');
  }, []);

  return (
    <VoiceContext.Provider value={{
      isListening,
      isProcessing,
      transcript,
      response,
      startListening,
      stopListening,
      processVoiceCommand,
      clearTranscript
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};