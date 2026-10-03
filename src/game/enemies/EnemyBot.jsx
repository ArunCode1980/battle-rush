import { useRef, useState } from "react";
import * as THREE from "three";

import { useFrame } from "@react-three/fiber";

import { gameState } from "../systems/gameState";
import LootPickup from "../world/LootPickup";

export default function EnemyBot({
  position = [14, 0, -5],
}) {
  const enemyRef = useRef(null);

  const attackTimer = useRef(0);
  const hitTimer = useRef(0);

  const [health, setHealth] = useState(100);
  const [dead, setDead] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [droppedLoot, setDroppedLoot] = useState(false);

  const MAX_HEALTH = 100;

  const ATTACK_DISTANCE = 3.2;
  const MOVE_SPEED = 1.4;

  const ATTACK_COOLDOWN = 1.2;
  const DAMAGE = 8;

  // =========================================================
  // DAMAGE FROM KAI
  // =========================================================

  function takeDamage(amount) {
    if (dead) {
      return;
    }

    if (amount <= 0) {
      return;
    }

    const newHealth = Math.max(
      0,
      health - amount
    );

    setHealth(newHealth);

    // Hit flash

    setHitFlash(true);

    if (hitTimer.current) {
      clearTimeout(hitTimer.current);
    }

    hitTimer.current = setTimeout(() => {
      setHitFlash(false);
    }, 90);

    // Death

    if (newHealth <= 0) {
      setDead(true);

      // Small delay before loot appears
      setTimeout(() => {
        setDroppedLoot(true);
      }, 250);
    }
  }

  // =========================================================
  // AI
  // =========================================================

  useFrame((_, delta) => {
    if (!enemyRef.current) {
      return;
    }

    if (dead) {
      return;
    }

    if (gameState.isEliminated()) {
      return;
    }

    const enemy = enemyRef.current;

    const player =
      gameState.getState().playerPosition;

    const dx =
      player.x -
      enemy.position.x;

    const dz =
      player.z -
      enemy.position.z;

    const distance =
      Math.sqrt(
        dx * dx +
        dz * dz
      );

    // =======================================================
    // MOVE
    // =======================================================

    if (
      distance >
      ATTACK_DISTANCE
    ) {
      const direction =
        new THREE.Vector3(
          dx,
          0,
          dz
        );

      if (
        direction.lengthSq() > 0
      ) {
        direction.normalize();

        enemy.position.x +=
          direction.x *
          MOVE_SPEED *
          delta;

        enemy.position.z +=
          direction.z *
          MOVE_SPEED *
          delta;

        enemy.rotation.y =
          Math.atan2(
            direction.x,
            direction.z
          );
      }
    }

    // =======================================================
    // ATTACK
    // =======================================================

    attackTimer.current -=
      delta;

    if (
      distance <=
        ATTACK_DISTANCE &&
      attackTimer.current <= 0
    ) {
      gameState.damagePlayer(
        DAMAGE
      );

      attackTimer.current =
        ATTACK_COOLDOWN;
    }
  });

  // =========================================================
  // DEAD
  // =========================================================

  if (dead) {
    if (droppedLoot) {
      return (
        <LootPickup
          type="ammo"
          position={[
            position[0],
            0.25,
            position[2],
          ]}
        />
      );
    }

    return null;
  }

  // =========================================================
  // ENEMY
  // =========================================================

  return (
    <group
      ref={enemyRef}
      position={position}
      userData={{
        isTarget: true,
        takeDamage,
      }}
    >
      {/* ===================================================
          HEALTH BAR
      =================================================== */}

      <group
        position={[
          0,
          3.05,
          0,
        ]}
      >
        {/* Background */}

        <mesh>
          <planeGeometry
            args={[
              1.2,
              0.12,
            ]}
          />

          <meshBasicMaterial
            color="#222222"
          />
        </mesh>

        {/* Health */}

        <mesh
          position={[
            -(1.2 *
              (1 -
                health /
                  MAX_HEALTH)) /
              2,
            0,
            0.01,
          ]}
          scale={[
            health /
              MAX_HEALTH,
            1,
            1,
          ]}
        >
          <planeGeometry
            args={[
              1.2,
              0.09,
            ]}
          />

          <meshBasicMaterial
            color="#e53935"
          />
        </mesh>
      </group>

      {/* ===================================================
          BODY
      =================================================== */}

      <mesh
        position={[
          0,
          1,
          0,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.45,
            1.1,
            8,
            16,
          ]}
        />

        <meshStandardMaterial
          color={
            hitFlash
              ? "#ffffff"
              : "#8e2525"
          }
          roughness={0.75}
        />
      </mesh>

      {/* ===================================================
          HEAD
      =================================================== */}

      <mesh
        position={[
          0,
          2,
          0,
        ]}
        castShadow
      >
        <sphereGeometry
          args={[
            0.42,
            16,
            16,
          ]}
        />

        <meshStandardMaterial
          color="#d29a72"
          roughness={0.8}
        />
      </mesh>

      {/* ===================================================
          HAIR
      =================================================== */}

      <mesh
        position={[
          0,
          2.28,
          0,
        ]}
        castShadow
      >
        <sphereGeometry
          args={[
            0.43,
            16,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#151515"
        />
      </mesh>

      {/* ===================================================
          LEFT ARM
      =================================================== */}

      <mesh
        position={[
          -0.6,
          1.15,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.12,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.13,
            0.7,
            6,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#20252b"
        />
      </mesh>

      {/* ===================================================
          RIGHT ARM
      =================================================== */}

      <mesh
        position={[
          0.6,
          1.15,
          0,
        ]}
        rotation={[
          0,
          0,
          0.12,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.13,
            0.7,
            6,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#20252b"
        />
      </mesh>

      {/* ===================================================
          LEFT LEG
      =================================================== */}

      <mesh
        position={[
          -0.22,
          0.2,
          0,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.16,
            0.7,
            6,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#171b20"
        />
      </mesh>

      {/* ===================================================
          RIGHT LEG
      =================================================== */}

      <mesh
        position={[
          0.22,
          0.2,
          0,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.16,
            0.7,
            6,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#171b20"
        />
      </mesh>

      {/* ===================================================
          ENEMY MARKER
      =================================================== */}

      <mesh
        position={[
          0,
          2.8,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.15,
            0.15,
            0.15,
          ]}
        />

        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}