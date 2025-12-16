import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function CenterWall() {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={[0, 0, -8]}>
      <mesh>
        <planeGeometry args={[20,6]}/>
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      
      <mesh position={[0, 0.5, 0.1]}>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      <mesh position={[0, 0.5, 0.15]}>
        <planeGeometry args={[3.8, 2.3]} />
        <meshStandardMaterial color="#0a0a2a" emissive="#1a1a3a" emissiveIntensity={0.3} />
      </mesh>
      
      <mesh position={[0, -1.5, 0.1]}>
        <boxGeometry args={[3.5, 0.8, 0.5]} />
        <meshStandardMaterial map={woodTexture} color="#3a2a1a" />
      </mesh>
    </group>
  );
}

export function LeftWall() {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={[-9, 0, -3]} rotation={[0, Math.PI / 6, 0]}>
      <mesh>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      
      <mesh position={[2, 0.5, 0.1]}>
        <boxGeometry args={[2, 2.5, 0.15]} />
        <meshStandardMaterial color="#87ceeb" opacity={0.6} transparent />
      </mesh>
      
      <mesh position={[2, 0.5, 0.12]}>
        <boxGeometry args={[0.05, 2.5, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[2, 0.5, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 2, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      <mesh position={[-1.5, -1.3, 0.1]}>
        <boxGeometry args={[1.8, 1.2, 0.8]} />
        <meshStandardMaterial map={woodTexture} color="#4a3a2a" />
      </mesh>
      
      <mesh position={[-1.5, -0.5, 0.1]}>
        <boxGeometry args={[1.5, 0.05, 0.7]} />
        <meshStandardMaterial map={woodTexture} color="#5a4a3a" />
      </mesh>
      
      <mesh position={[-3, -1.3, 0.1]}>
        <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
        <meshStandardMaterial map={woodTexture} color="#4a3a2a" />
      </mesh>
      <mesh position={[-3, -0.4, 0.1]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#6a4a2a" />
      </mesh>
    </group>
  );
}

export function RightWall() {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={[9, 0, -3]} rotation={[0, -Math.PI / 6, 0]}>
      <mesh>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      
      <mesh position={[0, -1, 0.1]}>
        <boxGeometry args={[1.5, 3.5, 0.2]} />
        <meshStandardMaterial map={woodTexture} color="#3a2a1a" />
      </mesh>
      
      <mesh position={[-0.3, -0.8, 0.15]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[-0.3, -0.8, 0.2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Floor() {
  const woodTexture = useTexture("/textures/wood.jpg");
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={woodTexture} color="#2a1a0a" />
    </mesh>
  );
}

export function Bed() {
  const woodTexture = useTexture("/textures/wood.jpg");
  
  return (
    <group position={[0, -1.5, 1]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.3, 4]} />
        <meshStandardMaterial map={woodTexture} color="#3a2a1a" />
      </mesh>
      
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.8, 0.4, 3.8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      <mesh position={[0, 0.6, 1.5]}>
        <boxGeometry args={[2.5, 0.3, 1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      <mesh position={[-1.3, -0.3, 1.8]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial map={woodTexture} color="#2a1a0a" />
      </mesh>
      <mesh position={[1.3, -0.3, 1.8]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial map={woodTexture} color="#2a1a0a" />
      </mesh>
      <mesh position={[-1.3, -0.3, -1.8]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial map={woodTexture} color="#2a1a0a" />
      </mesh>
      <mesh position={[1.3, -0.3, -1.8]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial map={woodTexture} color="#2a1a0a" />
      </mesh>
      
      <group position={[-1.2, 0.8, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.1, 0.6, 0.05]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.1, 0.6, 0.05]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.15, 0.55, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.15, 0.55, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      
      <group position={[1.2, 0.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
