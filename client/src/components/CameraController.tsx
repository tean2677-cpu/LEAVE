import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useBedroomGame, useFlashlight } from "@/lib/stores/useBedroomGame";
import { Controls } from "@/App";
import * as THREE from "three";

export function CameraController() {
  const { camera } = useThree();
  const targetRotationY = useBedroomGame((state) => state.targetRotationY);
  const targetRotationX = useBedroomGame((state) => state.targetRotationX);
  const verticalView = useBedroomGame((state) => state.verticalView);
  const currentRotationYRef = useRef(0);
  const currentRotationXRef = useRef(0);
  const isDragging = useBedroomGame((state) => state.isDragging);
  const setView = useBedroomGame((state) => state.setView);
  const setVerticalView = useBedroomGame((state) => state.setVerticalView);
  const setIsDragging = useBedroomGame((state) => state.setIsDragging);
  const useTeddyBear = useBedroomGame((state) => state.useTeddyBear);
  const usWater = useBedroomGame((state) => state.usWater);
  const toggleLight = useFlashlight((state) => state.toggleLight);
  const giveFlashlight = useFlashlight((state) => state.giveFlashlight);
  const hasFlashlight = useFlashlight((state) => state.hasFlashlight);
  const battery = useFlashlight((state) => state.battery);
  const dragStartRef = useRef<{ x: number; rotation: number } | null>(null);
  const [subscribe, getState] = useKeyboardControls<Controls>();

  // Global keybinds: A/D/S/W/F/E
  useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
  const k = e.key.toLowerCase();

  if (k === "a") {
    setView("left");
  } else if (k === "d") {
    setView("right");
  } else if (k === "s") {
    setView("center");
  } else if (k === "w") {
    setVerticalView(verticalView === "standing" ? "down" : "standing");
} else if (k === "f") {
  // Pick up flashlight only when sitting/down (looking at bed)
  if (!hasFlashlight && verticalView === "down" /* && currentView === "center" */) {
    giveFlashlight();
  }

  } else if (k === "f") {
  // Pick up flashlight only when sitting/down (looking at bed)
  if (!hasFlashlight && verticalView === "down" /* && currentView === "center" */) {
    giveFlashlight();
  }

  } else if (k === "e") {
    // E: use items + toggle flashlight (if you prefer E to only toggle flashlight, just call toggleLight)
  if (battery > 0 && verticalView === "standing") {
    toggleLight();
  }
    useTeddyBear();
    usWater();
  }
};

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setView, setVerticalView, verticalView, useTeddyBear, usWater, giveFlashlight, hasFlashlight, battery, toggleLight]);

  useEffect(() => {
    const unsubscribeLeft = subscribe(
      (state) => state.lookLeft,
      (pressed) => {
        if (pressed) {
          setView('left');
          console.log('Camera view: LEFT');
        }
      }
    );
}, [getState, setView, setVerticalView, setIsDragging, verticalView, useTeddyBear, usWater]);

useFrame(() => {
  const lerpFactor = isDragging ? 1 : 0.1;
  currentRotationYRef.current = THREE.MathUtils.lerp(
    currentRotationYRef.current,
    targetRotationY,
    lerpFactor
  );

  currentRotationXRef.current = THREE.MathUtils.lerp(
    currentRotationXRef.current,
    targetRotationX,
    lerpFactor
  );

  camera.rotation.y = currentRotationYRef.current;
  camera.rotation.x = currentRotationXRef.current;
});

return null;
}
