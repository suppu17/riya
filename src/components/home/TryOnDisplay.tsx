import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';
import { Loader2, Clock } from 'lucide-react';

const TryOnDisplay: React.FC = () => {
  const {
    isTryingOn,
    tryOnStatus,
    predictionId,
    tryOnError,
    tryOnResult,
    setIsTryingOn,
    setTryOnError,
    setTryOnResult,
  } = useShopping();

  return (
    <>
      {isTryingOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
            <p className="text-white font-medium">
              {tryOnStatus === "in_queue" && "Waiting in queue..."}
              {tryOnStatus === "processing" &&
                "Processing your virtual try-on..."}
              {tryOnStatus === "starting" &&
                "Starting virtual try-on..."}
              {!tryOnStatus && "Creating your virtual try-on..."}
            </p>
            {predictionId && (
              <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> This may take up to 40
                seconds
              </p>
            )}
            <p className="text-white/60 text-xs mt-2">
              {predictionId &&
                `Prediction ID: ${predictionId.substring(0, 8)}...`}
              {tryOnStatus && ` | Status: ${tryOnStatus}`}
            </p>
            <button
              onClick={() => {
                setIsTryingOn(false);
                setTryOnError(null);
              }}
              className="mt-4 text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {tryOnError && !isTryingOn && (
        <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-red-500/70 text-white text-sm px-4 py-2 rounded-lg">
          {tryOnError}
        </div>
      )}

      {tryOnResult && !isTryingOn && (
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl">
          <button
            onClick={() => setTryOnResult(null)}
            className="text-white text-xs font-medium flex items-center gap-1"
          >
            <i className="fas fa-times"></i>
            Reset Try On
          </button>
        </div>
      )}
    </>
  );
};

export default TryOnDisplay;
