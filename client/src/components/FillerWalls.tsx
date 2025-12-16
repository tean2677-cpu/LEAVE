import { useTexture } from "@react-three/drei";

export function FillerWallLeft() {
  const wallColor = "#3a3a3a";

  return (
    <group position={[-14, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
      <mesh>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}

export function FillerWallRight() {
  const wallColor = "#3a3a3a";

  return (
    <group position={[14, 0, 0]} rotation={[0, -Math.PI / 3, 0]}>
      <mesh>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}
