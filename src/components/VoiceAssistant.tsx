import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const VoiceAssistant: React.FC = () => {
  const { 
    isListening, 
    isProcessing, 
    transcript, 
    response, 
    startListening, 
    stopListening, 
    clearTranscript 
  } = useVoice();

  return (
    <>
      {/* Voice Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 z-50 ${
          isListening 
            ? 'bg-red-500/80 shadow-xl shadow-red-500/25 animate-pulse' 
            : 'bg-purple-500/80 hover:bg-purple-600/80 shadow-xl shadow-purple-500/25 hover:scale-110'
        }`}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Voice Panel */}
      {(transcript || response || isProcessing) && (
        <div className="fixed bottom-28 right-8 w-80 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 z-40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-white">AI Assistant</span>
            </div>
            <button
              onClick={clearTranscript}
              className="text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              Clear
            </button>
          </div>

          {transcript && (
            <div className="mb-4 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <p className="text-xs text-white/60 mb-1">You said:</p>
              <p className="text-sm text-white">{transcript}</p>
            </div>
          )}

          {isProcessing && (
            <div className="mb-4 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-white/80 ml-2">Processing...</span>
              </div>
            </div>
          )}

          {response && (
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20">
              <p className="text-xs text-purple-300 mb-1">AI Response:</p>
              <p className="text-sm text-white">{response}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;