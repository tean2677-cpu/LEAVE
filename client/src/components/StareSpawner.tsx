import { useState, useEffect, useRef, useCallback } from "react";
import { Vector3 } from "three";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";
import { useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useFlashlight } from "@/lib/stores/useBedroomGame";
import { useAudio } from "@/lib/stores/useAudio";

export function StareSpawner() { 
  const [monsters, setMonsters] = useState<Array<{ position: Vector3; side: SpawnSide }>>([]);
  const gameState = useBedroomGame((state) => state.gameState);
  const [isFizzleActive, setIsFizzleActive] = useState(false);
  const playStareSFX = useAudio((state) => state.playStareSFX);
  const spawnPositionsRef = useRef<Record<SpawnSide, Vector3>>({
    left: new Vector3(-3.75, -1, -5),
    right: new Vector3(3.75, -1, -5),
  });
  
  const getRandomSpawn = useCallback((): { position: Vector3; side: SpawnSide } => {
    const side: SpawnSide = Math.random() < 0.5 ? "left" : "right";
    const base = spawnPositionsRef.current[side];
    return { position: base.clone(), side };
  }, []);

  const handleMonsterActivate = useCallback(() => {
    // Play the stare SFX sound
    playStareSFX();
    
    setIsFizzleActive(true);
  }, [playStareSFX]);

  useEffect(() => {
    if (gameState !== "playing") {
      setMonsters([]);
      setIsFizzleActive(false);
    }
  }, [gameState]);

  // Roll spawn chance every 5-10 seconds (20%), only if no monster is active
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const scheduleNextSpawn = () => {
      // Random delay between 5-10 seconds (5000-10000ms)
      const randomDelay = Math.floor(Math.random() * 5000) + 5000; // 5000-9999ms
      
      const timeoutId = window.setTimeout(() => {
        setMonsters((prev) => {
          if (prev.length > 0) return prev; // only 1 monster at a time
          if (Math.random() >= 0.2) return prev; // 20% chance
          return [getRandomSpawn()];
        });
        
        // Schedule the next spawn attempt
        scheduleNextSpawn();
      }, randomDelay);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextSpawn();
    
    return () => window.clearTimeout(timeoutId);
  }, [gameState, getRandomSpawn]);

  return (
    <>
      {isFizzleActive && (
        <Html fullscreen style={{ pointerEvents: "none" }}>
          <style>
            {`@keyframes stareFizzleFlicker {
  0% { opacity: 0.08; filter: blur(0px) contrast(110%); }
  10% { opacity: 0.18; filter: blur(0.7px) contrast(125%); }
  20% { opacity: 0.10; filter: blur(0.3px) contrast(115%); }
  35% { opacity: 0.22; filter: blur(1.0px) contrast(135%); }
  50% { opacity: 0.14; filter: blur(0.4px) contrast(120%); }
  70% { opacity: 0.24; filter: blur(1.1px) contrast(140%); }
  85% { opacity: 0.12; filter: blur(0.3px) contrast(118%); }
  100% { opacity: 0.18; filter: blur(0.8px) contrast(130%); }
}`}
          </style>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.0) 3px, rgba(0,0,0,0.0) 7px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.0) 6px)",
              mixBlendMode: "screen",
              animation: "stareFizzleFlicker 180ms infinite",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        </Html>
      )}

      <group>
        {monsters.map(({ position, side }, index) => (
          <Monster
            key={`monster-${index}`}
            position={position}
            side={side}
            onActivate={handleMonsterActivate}
            onDefeated={() => {
              setIsFizzleActive(false);
              setMonsters((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </group>
    </>
  );
}

type SpawnSide = "left" | "right";

// Preload the model
useGLTF.preload("./geometries/Stare Enemy.glb");

function Monster({
  position,
  side,
  onActivate,
  onDefeated,
}: {
  position: Vector3;
  side: SpawnSide;
  onActivate: () => void;
  onDefeated: () => void;
}) {
  const { scene } = useGLTF("./geometries/Stare Enemy.glb", true);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const updateHydration = useBedroomGame((state) => state.updateHydration);
  const gameState = useBedroomGame((state) => state.gameState);
  const currentView = useBedroomGame((state) => state.currentView);
  const isLightOn = useFlashlight((state) => state.isLightOn);
  const hasFlashlight = useFlashlight((state) => state.hasFlashlight);
  const playStareSFX = useAudio((state) => state.playStareSFX);
  const defeatedRef = useRef(false);
  const activatedRef = useRef(false);
  const lightOnTimeRef = useRef(0);
  const raycasterRef = useRef(new THREE.Raycaster());
  const screenCenterRef = useRef(new THREE.Vector2(0, 0));

  // Set up the model when it loads
  useEffect(() => {
    if (!scene) return;
    activatedRef.current = false;
    lightOnTimeRef.current = 0;

    // Rotate the model
    scene.rotation.set(0, Math.PI / -2, 0);
    scene.position.copy(position);
    scene.scale.set(0.5, 0.5, 0.5);

    // Trigger jumpscare after a short delay
    const timer = setTimeout(() => {
      activatedRef.current = true;
      onActivate();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      scene.rotation.set(0, 0, 0);
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
    };
  }, [scene, position, onActivate]);

  useFrame((_, delta) => {
    if (defeatedRef.current) return;
    if (gameState !== "playing") return;
    if (!activatedRef.current) return;
    updateHydration(-55 * delta);
  });

  useFrame((_, delta) => {
    if (defeatedRef.current) return;
    if (gameState !== "playing") return;
    if (!activatedRef.current) return;
    if (!hasFlashlight) return;
    if (!isLightOn) {
      lightOnTimeRef.current = 0;
      return;
    }

    if (currentView !== side) {
      lightOnTimeRef.current = 0;
      return;
    }

    lightOnTimeRef.current += delta;
    if (lightOnTimeRef.current >= 0.15) {
      defeatedRef.current = true;
      onDefeated();
    }
  });

  useFrame(() => {
    if (defeatedRef.current) return;
    if (!activatedRef.current) return;
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
      onDefeated();
    }
  });

  return <primitive object={scene} ref={groupRef} />;
}