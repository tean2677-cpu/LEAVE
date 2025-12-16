import { useRef } from "react";
import { useFlashlight } from "@/lib/stores/useBedroomGame";
import * as THREE from "three";

export function Flashlight() {
  const meshRef = useRef<THREE.Mesh>(null);
  const hasFlashlight = useFlashlight((state) => state.hasFlashlight);

  // Don't render if player has picked it up
  if (hasFlashlight) return null;

  return (
    <group position={[0, 0.6, 0]}>
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.05, 0.05, 16]} />
        <meshStandardMaterial color="#666666" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0.175, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial color="#ffff99" emissive="#ffff66" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}