import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Avatar() {
  const group = useRef();
  const { scene } = useGLTF("/models/avatar.glb");

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  // 🔥 Subtle animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      // slight up-down (breathing)
      group.current.position.y = -1 + Math.sin(t * 1.5) * 0.02;

      // slight head nod
      group.current.rotation.x = Math.sin(t * 1.2) * 0.05;

      // slight side sway
      group.current.rotation.y = -Math.PI / 2 + Math.sin(t * 0.5) * 0.05;


      
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={2.2} />
    </group>
  );
}