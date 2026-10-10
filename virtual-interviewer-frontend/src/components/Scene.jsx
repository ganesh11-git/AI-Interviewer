import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import Avatar from "./Avatar";

function CameraFix() {
  const { camera } = useThree();

  useEffect(() => {
    // 🔥 LOWER camera more
    camera.position.set(0, 0, 6);

    // 🔥 LOOK slightly higher (face center)
    camera.lookAt(0, 1.0, 0);
  }, [camera]);

  return null;
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0.95, 2.0], fov: 30 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 2]} intensity={1.5} />

      <CameraFix />
      <Avatar />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}