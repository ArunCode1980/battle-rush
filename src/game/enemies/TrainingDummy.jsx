import {
  useRef,
  useState,
} from "react";

export default function TrainingDummy({
  position = [
    0,
    0,
    -12,
  ],
}) {
  const group =
    useRef();

  const [health, setHealth] =
    useState(100);

  const [hit, setHit] =
    useState(false);

  const resetTimer =
    useRef(null);

  const hitTimer =
    useRef(null);

  // =========================================================
  // DAMAGE SYSTEM
  // =========================================================

  const takeDamage = (
    damage
  ) => {
    setHealth(
      (currentHealth) => {
        const newHealth =
          Math.max(
            0,
            currentHealth -
              damage
          );

        // Target destroyed
        if (
          newHealth <= 0
        ) {
          if (
            resetTimer.current
          ) {
            clearTimeout(
              resetTimer.current
            );
          }

          resetTimer.current =
            setTimeout(() => {
              setHealth(100);
            }, 700);
        }

        return newHealth;
      }
    );

    // Hit flash
    setHit(true);

    if (
      hitTimer.current
    ) {
      clearTimeout(
        hitTimer.current
      );
    }

    hitTimer.current =
      setTimeout(() => {
        setHit(false);
      }, 100);
  };

  return (
    <group
      ref={group}
      position={position}
      userData={{
        isTarget: true,
        takeDamage,
      }}
    >

      {/* =====================================================
          TARGET BODY
      ===================================================== */}

      <mesh
        position={[
          0,
          1.15,
          0,
        ]}
        castShadow
      >
        <capsuleGeometry
          args={[
            0.38,
            1.0,
            8,
            16,
          ]}
        />

        <meshStandardMaterial
          color={
            hit
              ? "#ffffff"
              : "#9b3030"
          }
        />
      </mesh>

      {/* =====================================================
          HEAD
      ===================================================== */}

      <mesh
        position={[
          0,
          2.0,
          0,
        ]}
        castShadow
      >
        <sphereGeometry
          args={[
            0.3,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#d19a72"
        />
      </mesh>

      {/* =====================================================
          CENTER TARGET
      ===================================================== */}

      <mesh
        position={[
          0,
          1.25,
          0.39,
        ]}
      >
        <boxGeometry
          args={[
            0.45,
            0.55,
            0.05,
          ]}
        />

        <meshStandardMaterial
          color="#eeeeee"
        />
      </mesh>

      {/* =====================================================
          HEALTH BAR BACKGROUND
      ===================================================== */}

      <mesh
        position={[
          0,
          2.45,
          0,
        ]}
      >
        <boxGeometry
          args={[
            1.0,
            0.1,
            0.05,
          ]}
        />

        <meshBasicMaterial
          color="#222222"
        />
      </mesh>

      {/* =====================================================
          HEALTH BAR
      ===================================================== */}

      <mesh
        position={[
          -0.5 +
            0.5 *
              (health / 100),
          2.45,
          0.03,
        ]}
        scale={[
          health / 100,
          1,
          1,
        ]}
      >
        <boxGeometry
          args={[
            1.0,
            0.08,
            0.03,
          ]}
        />

        <meshBasicMaterial
          color="#35d06f"
        />
      </mesh>

    </group>
  );
}