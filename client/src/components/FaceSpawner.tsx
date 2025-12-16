import { useState, useEffect, useRef, useCallback } from "react";
import { Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";
import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useFlashlight } from "@/lib/stores/useBedroomGame";
import { useAudio } from "@/lib/stores/useAudio";

export function FaceSpawner() { 
  const [monsters, setMonsters] = useState<Vector3[]>([]);
  const { camera } = useThree();
  const gameState = useBedroomGame((state) => state.gameState);
  const shakeRafIdRef = useRef<number | null>(null);
  const shakeOriginalPositionRef = useRef<THREE.Vector3 | null>(null);
  const shakeActiveRef = useRef(false);
  const spawnAreaRef = useRef<SpawnArea>({
    minX: -2, //Left position
    maxX: 1,     // Right position
    minZ: -2,    // Distance from player
    maxZ: -2,    // Keep same as minZ for fixed distance
    y: -1        // Height
  });
  
  const getRandomPosition = useCallback((): Vector3 => {
    const spawnArea = spawnAreaRef.current;
    return new Vector3(
      spawnArea.minX + (spawnArea.maxX - spawnArea.minX) * 0.5, // Center X
      spawnArea.y,
      spawnArea.minZ // Fixed distance
    );
  }, []);

  const stopScreenShake = useCallback(() => {
    shakeActiveRef.current = false;
    if (shakeRafIdRef.current !== null) {
      cancelAnimationFrame(shakeRafIdRef.current);
      shakeRafIdRef.current = null;
    }
    if (shakeOriginalPositionRef.current) {
      camera.position.copy(shakeOriginalPositionRef.current);
      shakeOriginalPositionRef.current = null;
    }
  }, [camera]);

  const startScreenShake = useCallback((duration: number, intensity: number, onComplete: () => void) => {
    stopScreenShake();
    shakeActiveRef.current = true;
    const startTime = Date.now();
    const originalPosition = camera.position.clone();
    shakeOriginalPositionRef.current = originalPosition;

    const shake = () => {
      if (!shakeActiveRef.current) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 1) {
        // Apply random movement to camera
        camera.position.x = originalPosition.x + (Math.random() - 0.5) * intensity * (1 - progress);
        camera.position.y = originalPosition.y + (Math.random() - 0.5) * intensity * (1 - progress);
        shakeRafIdRef.current = requestAnimationFrame(shake);
      } else {
        // Reset camera position when done
        camera.position.copy(originalPosition);
        shakeActiveRef.current = false;
        shakeRafIdRef.current = null;
        shakeOriginalPositionRef.current = null;
        onComplete();
      }
    };

    shake();
  }, [camera, stopScreenShake]);

  const playFaceScream = useAudio((state) => state.playFaceScream);

  const handleMonsterActivate = useCallback(() => {
    // Play the face scream sound
    playFaceScream();
    
    // Start screen shake for 7 seconds with high intensity
    startScreenShake(7000, 0.2, () => {
    });
  }, [startScreenShake, playFaceScream]);

  useEffect(() => {
    if (gameState !== "playing") {
      stopScreenShake();
      setMonsters([]);
    }
  }, [gameState, stopScreenShake]);

  // Roll spawn chance every 3-8 seconds (10%), only if no monster is active
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const scheduleNextSpawn = () => {
      // Random delay between 3-8 seconds (3000-8000ms)
      const randomDelay = Math.floor(Math.random() * 5000) + 3000; // 3000-7999ms
      
      const timeoutId = window.setTimeout(() => {
        setMonsters((prev) => {
          if (prev.length > 0) return prev; // only 1 monster at a time
          if (Math.random() >= 0.1) return prev; // 10% chance
          return [getRandomPosition()];
        });
        
        // Schedule the next spawn attempt
        scheduleNextSpawn();
      }, randomDelay);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextSpawn();
    
    return () => window.clearTimeout(timeoutId);
  }, [gameState, getRandomPosition]);

  return (
    <group>
      {monsters.map((position, index) => (
        <Monster 
          key={`monster-${index}`} 
          position={position} 
          onActivate={handleMonsterActivate}
          onDefeated={() => {
            stopScreenShake();
            setMonsters((prev) => prev.filter((_, i) => i !== index));
          }}
        />
      ))}
    </group>
  );
}

// Define the spawn area type for better type safety
type SpawnArea = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  y: number;
};

// Preload the model
useGLTF.preload("/geometries/Face Enemy.glb");

function Monster({
  position,
  onActivate,
  onDefeated,
}: {
  position: Vector3;
  onActivate: () => void;
  onDefeated: () => void;
}) {
  const { scene } = useGLTF("/geometries/Face Enemy.glb", true);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const setFearMultiplier = useBedroomGame((state) => state.setFearMultiplier);
  const setFearDeathSource = useBedroomGame((state) => state.setFearDeathSource);
  const isLightOn = useFlashlight((state) => state.isLightOn);
  const hasFlashlight = useFlashlight((state) => state.hasFlashlight);
  const playFaceScream = useAudio((state) => state.playFaceScream);
  const defeatedRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const screenCenterRef = useRef(new THREE.Vector2(0, 0));

  // Set up the model when it loads
  useEffect(() => {
    if (!scene) return;

    // Rotate the model
    scene.rotation.set(0, Math.PI / -2, 0);
    scene.position.copy(position);
    scene.scale.set(0.5, 0.5, 0.5);

    setFearDeathSource("face");
    setFearMultiplier(200);
    const resetMultiplierTimer = setTimeout(() => setFearMultiplier(1), 7500);

    // Trigger jumpscare after a short delay
    const timer = setTimeout(() => onActivate(), 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(resetMultiplierTimer);
      setFearMultiplier(1);
      setFearDeathSource("normal");
      scene.rotation.set(0, 0, 0);
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
    };
  }, [scene, position, onActivate, setFearDeathSource, setFearMultiplier]);

  useFrame(() => {
    if (defeatedRef.current) return;
    if (!hasFlashlight) return;
    if (!isLightOn) return;
    if (!scene) return;

    // Raycast from the center of the screen (same direction as camera)
    scene.updateMatrixWorld(true);
    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(screenCenterRef.current, camera as THREE.PerspectiveCamera);
    raycaster.far = 20;
    const hits = raycaster.intersectObject(scene, true);

    if (hits.length > 0) {
      defeatedRef.current = true;
      setFearMultiplier(1);
      setFearDeathSource("normal");
      onDefeated();
    }
  });

  return <primitive object={scene} ref={groupRef} />;
}