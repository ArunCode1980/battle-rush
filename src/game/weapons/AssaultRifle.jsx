import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import {
  useFrame,
} from "@react-three/fiber";

import {
  ASSAULT_RIFLE,
} from "./weaponData";

export default function AssaultRifle({
  aiming = false,
  shooting = false,
  reloading = false,
  muzzleFlashId = 0,
}) {
  const groupRef =
    useRef();

  const muzzleLightRef =
    useRef();

  // =========================================================
  // MUZZLE FLASH
  // =========================================================

  const [
    flashVisible,
    setFlashVisible,
  ] = useState(false);

  const flashTimer =
    useRef(null);

  // =========================================================
  // RECOIL STATE
  // =========================================================

  const recoilX =
    useRef(0);

  const recoilZ =
    useRef(0);

  const previousMuzzleFlash =
    useRef(0);

  // =========================================================
  // MUZZLE FLASH + RECOIL TRIGGER
  // =========================================================

  useEffect(() => {
    if (
      muzzleFlashId <=
      previousMuzzleFlash.current
    ) {
      return;
    }

    previousMuzzleFlash.current =
      muzzleFlashId;

    // -------------------------------------------------------
    // FLASH
    // -------------------------------------------------------

    setFlashVisible(true);

    if (
      flashTimer.current
    ) {
      clearTimeout(
        flashTimer.current
      );
    }

    flashTimer.current =
      setTimeout(() => {
        setFlashVisible(false);
      }, 55);

    // -------------------------------------------------------
    // RECOIL
    // -------------------------------------------------------

    const verticalRecoil =
      aiming
        ? ASSAULT_RIFLE.recoil
            .aimVertical
        : ASSAULT_RIFLE.recoil
            .vertical;

    recoilX.current =
      Math.min(
        recoilX.current +
          verticalRecoil,
        0.22
      );

    // Small horizontal kick
    recoilZ.current =
      THREE.MathUtils.clamp(
        recoilZ.current +
          (Math.random() - 0.5) *
            ASSAULT_RIFLE.recoil
              .horizontal,
        -0.08,
        0.08
      );
  }, [
    muzzleFlashId,
    aiming,
  ]);

  // =========================================================
  // WEAPON ANIMATION
  // =========================================================

  useFrame(
    (_, delta) => {
      if (
        !groupRef.current
      ) {
        return;
      }

      // -------------------------------------------------------
      // Recoil recovery
      // -------------------------------------------------------

      const recovery =
        ASSAULT_RIFLE.recoil
          .recovery;

      recoilX.current =
        THREE.MathUtils.damp(
          recoilX.current,
          0,
          recovery,
          delta
        );

      recoilZ.current =
        THREE.MathUtils.damp(
          recoilZ.current,
          0,
          recovery,
          delta
        );

      // -------------------------------------------------------
      // Apply recoil
      //
      // Negative X makes the muzzle rise.
      // -------------------------------------------------------

      groupRef.current.rotation.x =
        -recoilX.current;

      // Reload rotation
      groupRef.current.rotation.z =
        reloading
          ? -0.35
          : recoilZ.current;
    }
  );

  // =========================================================
  // MUZZLE LIGHT
  // =========================================================

  useEffect(() => {
    if (
      !muzzleLightRef.current
    ) {
      return;
    }

    muzzleLightRef.current.intensity =
      flashVisible
        ? 3.5
        : 0;
  }, [
    flashVisible,
  ]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        flashTimer.current
      ) {
        clearTimeout(
          flashTimer.current
        );
      }
    };
  }, []);

  // =========================================================
  // WEAPON POSITION
  // =========================================================

  useEffect(() => {
    if (
      !groupRef.current
    ) {
      return;
    }

    const targetX =
      aiming
        ? 0.28
        : 0.48;

    const targetY =
      aiming
        ? 1.28
        : 1.18;

    const targetZ =
      aiming
        ? 0.48
        : 0.38;

    groupRef.current.position.lerp(
      new THREE.Vector3(
        targetX,
        targetY,
        targetZ
      ),
      0.18
    );
  }, [
    aiming,
  ]);

  // =========================================================
  // WEAPON MODEL
  // =========================================================

  return (
    <group
      ref={groupRef}
      position={[
        0.48,
        1.18,
        0.38,
      ]}
      rotation={[
        0,
        0,
        0,
      ]}
    >

      {/* =====================================================
          MAIN RECEIVER
      ===================================================== */}

      <mesh castShadow>
        <boxGeometry
          args={[
            0.18,
            0.18,
            0.7,
          ]}
        />

        <meshStandardMaterial
          color="#20242a"
          roughness={0.55}
        />
      </mesh>

      {/* =====================================================
          UPPER RECEIVER
      ===================================================== */}

      <mesh
        position={[
          0,
          0.11,
          0.05,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.15,
            0.08,
            0.5,
          ]}
        />

        <meshStandardMaterial
          color="#30343a"
          roughness={0.45}
        />
      </mesh>

      {/* =====================================================
          BARREL
      ===================================================== */}

      <mesh
        position={[
          0,
          0.02,
          0.48,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.045,
            0.045,
            0.55,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#111316"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* =====================================================
          MUZZLE
      ===================================================== */}

      <mesh
        position={[
          0,
          0.02,
          0.77,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.065,
            0.065,
            0.1,
            12,
          ]}
        />

        <meshStandardMaterial
          color="#090a0b"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* =====================================================
          MAGAZINE
      ===================================================== */}

      <mesh
        position={[
          0,
          -0.23,
          -0.02,
        ]}
        rotation={[
          0.12,
          0,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.13,
            0.4,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#15181c"
          roughness={0.55}
        />
      </mesh>

      {/* =====================================================
          GRIP
      ===================================================== */}

      <mesh
        position={[
          0,
          -0.18,
          -0.22,
        ]}
        rotation={[
          0.3,
          0,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.12,
            0.32,
            0.13,
          ]}
        />

        <meshStandardMaterial
          color="#101214"
          roughness={0.7}
        />
      </mesh>

      {/* =====================================================
          STOCK
      ===================================================== */}

      <mesh
        position={[
          0,
          0.02,
          -0.5,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.17,
            0.18,
            0.42,
          ]}
        />

        <meshStandardMaterial
          color="#24282d"
          roughness={0.6}
        />
      </mesh>

      {/* =====================================================
          STOCK END
      ===================================================== */}

      <mesh
        position={[
          0,
          0.02,
          -0.72,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.2,
            0.22,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#111316"
          roughness={0.7}
        />
      </mesh>

      {/* =====================================================
          FRONT SIGHT
      ===================================================== */}

      <mesh
        position={[
          0,
          0.14,
          0.43,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.035,
            0.12,
            0.04,
          ]}
        />

        <meshStandardMaterial
          color="#080909"
        />
      </mesh>

      {/* =====================================================
          REAR SIGHT
      ===================================================== */}

      <mesh
        position={[
          0,
          0.15,
          -0.08,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.08,
            0.1,
            0.06,
          ]}
        />

        <meshStandardMaterial
          color="#080909"
        />
      </mesh>

      {/* =====================================================
          MUZZLE LIGHT
      ===================================================== */}

      <pointLight
        ref={muzzleLightRef}
        position={[
          0,
          0.02,
          0.84,
        ]}
        intensity={0}
        distance={3}
        decay={2}
      />

      {/* =====================================================
          MUZZLE FLASH
      ===================================================== */}

      {flashVisible && (
        <group
          position={[
            0,
            0.02,
            0.9,
          ]}
        >
          <mesh
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
          >
            <coneGeometry
              args={[
                0.13,
                0.35,
                6,
              ]}
            />

            <meshBasicMaterial
              color="#ffcc55"
              transparent
              opacity={0.95}
            />
          </mesh>

          <mesh
            scale={[
              0.5,
              0.5,
              0.5,
            ]}
          >
            <sphereGeometry
              args={[
                0.13,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color="#fff4b0"
            />
          </mesh>
        </group>
      )}

    </group>
  );
}