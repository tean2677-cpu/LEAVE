// client/src/components/Mainmenu.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";
import { CenterWall, LeftWall, RightWall, Floor, Bed } from "./Walls";
import { FillerWallLeft, FillerWallRight } from "./FillerWalls";
import * as THREE from "three";
import { useAudio } from "@/lib/stores/useAudio";

export function MainMenu({ onStart }: { onStart: () => void }) {
  const setUserInteracted = useAudio((state) => state.setUserInteracted);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black">
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 1, 3], // Positioned back from the center
            fov: 90, // Wider field of view
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 3, 0]} intensity={1} />

          <Suspense fallback={null}>
            <BedroomScene />
            <PanoramaCamera />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-30 text-center">
        <h1 className="text-6xl font-bold mb-8 text-white drop-shadow-lg">L E A V E</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log('MainMenu button clicked!', e);
            console.log('onStart function:', onStart);
            
            // Set user interaction for audio
            setUserInteracted();
            
            try {
              onStart();
              console.log('onStart called successfully');
            } catch (error) {
              console.error('Error calling onStart:', error);
            }
          }}
          className="px-10 py-4 text-xl bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

function BedroomScene() {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.8} />
      
      <CenterWall />
      <LeftWall />
      <RightWall />
      <Floor />
      <Bed />
      <FillerWallLeft />
      <FillerWallRight />
    </group>
  );
}

function PanoramaCamera() {
  const time = useRef(0);

  useFrame(({ camera }) => {
    time.current += 0.005; // Adjust speed here
    
    // Calculate head turn angle (smooth 180° turn)
    const headTurn = Math.sin(time.current) * Math.PI * 0.9; // ~160 degree turn (80° each side)

    // Calculate look direction
    const lookX = Math.sin(headTurn) * 5; // Look left/right
    const lookZ = -3 + Math.cos(headTurn) * 0.2; // Slight forward/back movement
    const lookY = 1 + Math.sin(time.current * 0.5) * 0.1; // Subtle up/down movement
    
    // Set camera position (sitting height)
    camera.position.set(0, 1, 2);
    
    // Make the camera look at the calculated point
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}