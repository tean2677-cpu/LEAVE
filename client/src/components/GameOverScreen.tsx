import { useEffect, useState } from "react";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";

export function GameOverScreen() {
  const gameState = useBedroomGame((state) => state.gameState);
  const fearDeathSource = useBedroomGame((state) => state.fearDeathSource);
  const resetGame = useBedroomGame((state) => state.resetGame);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (gameState !== "playing") {
      setTimeout(() => setFadeIn(true), 100);
    } else {
      setFadeIn(false);
    }
  }, [gameState]);

  if (gameState === "playing") return null;

  const getMessage = () => {
    switch (gameState) {
      case "won":
        return "You Survived!";
      case "lostDehydration":
        return "You Died from Dehydration";
      case "lostFear":
        if (fearDeathSource === "face") {
          return (
            <>
              <span className="text-red-600 text-7xl block mb-4">YOU DIED</span>
              <p className="text-2xl text-gray-300">The face...</p>
            </>
          );
        }
        return "You Died from Fear";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 pointer-events-auto ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ 
        zIndex: 1000,
        background: 'radial-gradient(circle, rgba(30,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="text-center p-8 max-w-2xl">
        <div className="animate-pulse">
          {getMessage()}
        </div>
        <button
          onClick={resetGame}
          className={`mt-12 px-10 py-4 text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105 ${
            gameState === "lostFear" 
              ? "bg-red-800 hover:bg-red-900 text-white" 
              : "bg-white hover:bg-gray-200 text-black"
          }`}
        >
          {gameState === "lostFear" ? "Try to Survive Again" : "Play Again"}
        </button>
      </div>
    </div>
  );
}