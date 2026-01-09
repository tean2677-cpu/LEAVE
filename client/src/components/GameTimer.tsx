import { useEffect } from "react";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";

export function GameTimer() {
  const updateHydration = useBedroomGame((state) => state.updateHydration);
  const updateFear = useBedroomGame((state) => state.updateFear);
  const updateTime = useBedroomGame((state) => state.updateTime);
  const gameState = useBedroomGame((state) => state.gameState);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      updateHydration(-0.5);
      updateFear(0.33);
      updateTime(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [updateHydration, updateFear, updateTime, gameState]);

  return null;
}
