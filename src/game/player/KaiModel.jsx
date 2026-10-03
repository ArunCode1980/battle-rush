import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function KaiModel() {
  const group = useRef();

  const { scene } = useGLTF(
    "/assets/characters/kai.glb"
  );

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload(
  "/assets/characters/kai.glb"
);