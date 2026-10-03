import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gameState } from "../systems/gameState";

const LOOT_DATA = {
  ammo: {
    label: "AMMO",
    amount: 30,
    color: "#f5c542",
  },

  medkits: {
    label: "MEDKIT",
    amount: 1,
    color: "#e74c3c",
  },

  grenades: {
    label: "GRENADE",
    amount: 1,
    color: "#4caf50",
  },
};

export default function LootPickup({
  type = "ammo",
  position = [0, 0.25, 0],
}) {
  const groupRef = useRef(null);

  const [nearPlayer, setNearPlayer] = useState(false);
  const [collected, setCollected] = useState(false);

  const loot = LOOT_DATA[type] || LOOT_DATA.ammo;

  // -----------------------------
  // KEYBOARD PICKUP
  // -----------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() !== "e") return;

      const player = gameState.getState().playerPosition;

      const dx = player.x - position[0];
      const dy = player.y - position[1];
      const dz = player.z - position[2];

      const distance = Math.sqrt(
        dx * dx +
        dy * dy +
        dz * dz
      );

      if (distance <= 2.4) {
        gameState.addLoot(type, loot.amount);

        setCollected(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, loot.amount, position]);

  // -----------------------------
  // ANIMATION + DISTANCE CHECK
  // -----------------------------

  useFrame((state, delta) => {
    if (!groupRef.current || collected) return;

    // Rotation
    groupRef.current.rotation.y += delta * 1.5;

    // Floating effect
    groupRef.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * 2.5) * 0.08;

    // Player position
    const player = gameState.getState().playerPosition;

    const dx = player.x - position[0];
    const dy = player.y - position[1];
    const dz = player.z - position[2];

    const distance = Math.sqrt(
      dx * dx +
      dy * dy +
      dz * dz
    );

    const isNear = distance <= 2.4;

    setNearPlayer((previous) => {
      if (previous === isNear) {
        return previous;
      }

      return isNear;
    });
  });

  // -----------------------------
  // REMOVE AFTER PICKUP
  // -----------------------------

  if (collected) {
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={position}
    >
      {/* Main loot box */}
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.45, 0.45]} />

        <meshStandardMaterial
          color={loot.color}
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>

      {/* Top indicator */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.18]} />

        <meshStandardMaterial color="white" />
      </mesh>

      {/* Pickup prompt */}
      {nearPlayer && (
        <Html
          position={[0, 0.85, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.82)",
              color: "white",
              padding: "8px 13px",
              borderRadius: "6px",
              fontFamily: "Arial, sans-serif",
              fontSize: "13px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              border: `1px solid ${loot.color}`,
              boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
            }}
          >
            [E] PICK UP {loot.label} +{loot.amount}
          </div>
        </Html>
      )}
    </group>
  );
}