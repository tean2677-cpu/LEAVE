import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFlashlight } from "@/lib/stores/useBedroomGame";
import * as THREE from "three";

interface FlashlightBeamProps {
  cameraRef: React.RefObject<THREE.PerspectiveCamera>;
}
export function FlashlightBeamWithCamera() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera;
  }, [camera]);

  return <FlashlightBeam cameraRef={cameraRef} />;
}

export function FlashlightBeam({ cameraRef }: FlashlightBeamProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const isLightOn = useFlashlight((state) => state.isLightOn);
  const hasFlashlight = useFlashlight((state) => state.hasFlashlight);
  const battery = useFlashlight((state) => state.battery);
  
  useFrame(() => {
    if (spotLightRef.current && cameraRef.current && isLightOn && hasFlashlight) {
      // Position light at camera position
      spotLightRef.current.position.copy(cameraRef.current.position);
      
      // Point light in camera direction
      const direction = new THREE.Vector3();
      cameraRef.current.getWorldDirection(direction);
      const target = cameraRef.current.position.clone().add(direction);
      spotLightRef.current.target.position.copy(target);
      spotLightRef.current.target.updateMatrixWorld();
      
      // Adjust intensity based on battery level
      const batteryMultiplier = Math.max(0.3, battery / 100);
      spotLightRef.current.intensity = 350 * batteryMultiplier;
    }
  });
  
  if (!isLightOn || !hasFlashlight) return null;
  
  return (
    <>
      <spotLight
        ref={spotLightRef}
        color="#fff8dc"
        intensity={100}
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={25}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <primitive object={new THREE.Object3D()} ref={(obj: THREE.Object3D) => {
        if (spotLightRef.current && obj) {
          spotLightRef.current.target = obj;
        }
      }} />
    </>
  );
}
