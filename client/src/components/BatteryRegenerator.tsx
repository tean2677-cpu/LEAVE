import { useEffect } from "react";
import { useFlashlight } from "@/lib/stores/useBedroomGame";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";

export function BatteryRegenerator() {
  const battery = useFlashlight((state) => state.battery);
  const setBattery = useFlashlight((state) => state.setBattery);
  const gameState = useBedroomGame((state) => state.gameState);

  useEffect(() => {
    if (gameState !== "playing") return;

    const regenInterval = setInterval(() => {
      const currentBattery = useFlashlight.getState().battery;
      const newBattery = Math.min(100, currentBattery + 1); // Add 1% every 5 seconds
      setBattery(newBattery);
    }, 5000); // 5 seconds

    return () => clearInterval(regenInterval);
  }, [gameState, setBattery]);

  return null;
}
