import React, { useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import AssaultRifle from "../weapons/AssaultRifle";
import { CLOTHING_ITEMS } from "./clothingData";
import {
  getInventorySnapshot,
  subscribeInventory,
} from "../systems/playerInventory";

export default function KaiCharacter(
  moving = false,
  sprinting = false,
  shooting = false,
  reloading = false,
  aiming = false,
  muzzleFlashId = 0
) {

const inventory = useSyncExternalStore(
  subscribeInventory,
  getInventorySnapshot,
  getInventorySnapshot
);

const equippedClothing =
  CLOTHING_ITEMS[inventory.equipped.clothing] ||
  CLOTHING_ITEMS.kai_standard;

  
  const group = useRef();

  const leftArm = useRef();
  const rightArm = useRef();

  const leftLeg = useRef();
  const rightLeg = useRef();

  const head = useRef();
  const torso = useRef();

  const walkTime = useRef(0);

  // =========================================================
  // COLORS
  // =========================================================

  const SKIN = "#b97858";
  const SKIN_LIGHT = "#d0916d";

  const HAIR = "#171513";
  const HAIR_LIGHT = "#24201d";

  const JACKET = equippedClothing.colors.jacket;
  const JACKET_LIGHT = equippedClothing.colors.jacket;

  const SHIRT = equippedClothing.colors.shirt;

  const PANTS = equippedClothing.colors.pants;
  const PANTS_LIGHT = equippedClothing.colors.pants;

  const BOOTS = equippedClothing.colors.boots;
  const BOOT_SOLE = equippedClothing.colors.boots;

  const STRAP = "#111513";
  const METAL = "#4d5652";

  // =========================================================
  // CHARACTER ANIMATION
  // =========================================================

  useFrame((_, delta) => {
    // -------------------------------------------------------
    // WALK / RUN
    // -------------------------------------------------------

    if (moving) {
      walkTime.current +=
        delta *
        (sprinting ? 12 : 8);

      const swing =
        Math.sin(walkTime.current) *
        (sprinting ? 0.72 : 0.48);

      // Arms
      if (leftArm.current) {
        const target =
          aiming
            ? -0.38
            : swing * 0.8;

        leftArm.current.rotation.x =
          THREE.MathUtils.lerp(
            leftArm.current.rotation.x,
            target,
            0.22
          );
      }

      if (rightArm.current) {
        const target =
          aiming
            ? -0.38
            : -swing * 0.8;

        rightArm.current.rotation.x =
          THREE.MathUtils.lerp(
            rightArm.current.rotation.x,
            target,
            0.22
          );
      }

      // Legs
      if (leftLeg.current) {
        leftLeg.current.rotation.x =
          THREE.MathUtils.lerp(
            leftLeg.current.rotation.x,
            -swing,
            0.25
          );
      }

      if (rightLeg.current) {
        rightLeg.current.rotation.x =
          THREE.MathUtils.lerp(
            rightLeg.current.rotation.x,
            swing,
            0.25
          );
      }

      // Slight body movement
      if (torso.current) {
        torso.current.rotation.z =
          THREE.MathUtils.lerp(
            torso.current.rotation.z,
            Math.sin(walkTime.current * 2) *
              (sprinting ? 0.018 : 0.01),
            0.12
          );
      }
    } else {
      walkTime.current = 0;

      // Arms idle
      if (leftArm.current) {
        leftArm.current.rotation.x =
          THREE.MathUtils.lerp(
            leftArm.current.rotation.x,
            aiming ? -0.38 : 0,
            0.14
          );
      }

      if (rightArm.current) {
        rightArm.current.rotation.x =
          THREE.MathUtils.lerp(
            rightArm.current.rotation.x,
            aiming ? -0.38 : 0,
            0.14
          );
      }

      // Legs idle
      if (leftLeg.current) {
        leftLeg.current.rotation.x =
          THREE.MathUtils.lerp(
            leftLeg.current.rotation.x,
            0,
            0.16
          );
      }

      if (rightLeg.current) {
        rightLeg.current.rotation.x =
          THREE.MathUtils.lerp(
            rightLeg.current.rotation.x,
            0,
            0.16
          );
      }

      // Idle breathing
      if (torso.current) {
        torso.current.position.y =
          1.27 +
          Math.sin(
            performance.now() * 0.0015
          ) *
            0.008;
      }
    }

    // -------------------------------------------------------
    // HEAD FOLLOW
    // -------------------------------------------------------

    if (head.current) {
      head.current.rotation.y =
        THREE.MathUtils.lerp(
          head.current.rotation.y,
          aiming ? -0.035 : 0,
          0.08
        );
    }
  });

  // =========================================================
  // CHARACTER
  // =========================================================

  return (
    <group ref={group}>

      {/* =====================================================
          TORSO / JACKET
      ===================================================== */}

      <group
        ref={torso}
        position={[0, 1.27, 0]}
      >
        {/* Main torso */}
        <mesh castShadow>
          <boxGeometry args={[0.70, 0.98, 0.42]} />

          <meshStandardMaterial
            color={JACKET}
            roughness={0.78}
          />
        </mesh>

        {/* Chest panel */}
        <mesh
          position={[0, 0.08, 0.218]}
          castShadow
        >
          <boxGeometry args={[0.52, 0.52, 0.035]} />

          <meshStandardMaterial
            color={JACKET_LIGHT}
            roughness={0.8}
          />
        </mesh>

        {/* Shirt visible at neck */}
        <mesh
          position={[0, 0.43, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.19, 0.19, 0.14, 16]}
          />

          <meshStandardMaterial
            color={SHIRT}
          />
        </mesh>

        {/* Left chest pocket */}
        <mesh
          position={[-0.20, 0.17, 0.24]}
        >
          <boxGeometry
            args={[0.16, 0.20, 0.025]}
          />

          <meshStandardMaterial
            color="#1c2722"
          />
        </mesh>

        {/* Right chest pocket */}
        <mesh
          position={[0.20, 0.17, 0.24]}
        >
          <boxGeometry
            args={[0.16, 0.20, 0.025]}
          />

          <meshStandardMaterial
            color="#1c2722"
          />
        </mesh>

        {/* Belt */}
        <mesh
          position={[0, -0.39, 0]}
        >
          <boxGeometry
            args={[0.72, 0.10, 0.45]}
          />

          <meshStandardMaterial
            color={STRAP}
          />
        </mesh>

        {/* Belt buckle */}
        <mesh
          position={[0, -0.39, 0.235]}
        >
          <boxGeometry
            args={[0.13, 0.10, 0.035]}
          />

          <meshStandardMaterial
            color="#a2a69f"
            metalness={0.55}
            roughness={0.35}
          />
        </mesh>

        {/* Small waist pouches */}
        <mesh
          position={[-0.31, -0.31, 0.18]}
          castShadow
        >
          <boxGeometry
            args={[0.15, 0.19, 0.16]}
          />

          <meshStandardMaterial
            color="#1b241f"
          />
        </mesh>

        <mesh
          position={[0.31, -0.31, 0.18]}
          castShadow
        >
          <boxGeometry
            args={[0.15, 0.19, 0.16]}
          />

          <meshStandardMaterial
            color="#1b241f"
          />
        </mesh>
      </group>

      {/* =====================================================
          NECK
      ===================================================== */}

      <mesh
        position={[0, 1.80, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.14, 0.16, 0.20, 16]}
        />

        <meshStandardMaterial
          color={SKIN}
          roughness={0.85}
        />
      </mesh>

      {/* =====================================================
          HEAD
      ===================================================== */}

      <group
        ref={head}
        position={[0, 2.08, 0]}
      >
        {/* Face */}
        <mesh castShadow>
          <sphereGeometry
            args={[0.345, 32, 24]}
          />

          <meshStandardMaterial
            color={SKIN_LIGHT}
            roughness={0.82}
          />
        </mesh>

        {/* Jaw / lower face */}
        <mesh
          position={[0, -0.075, 0.04]}
          scale={[0.92, 0.72, 0.92]}
        >
          <sphereGeometry
            args={[0.30, 24, 20]}
          />

          <meshStandardMaterial
            color={SKIN_LIGHT}
            roughness={0.85}
          />
        </mesh>

        {/* ===================================================
            HAIR
        =================================================== */}

        <mesh
          position={[0, 0.20, -0.01]}
          scale={[1.02, 0.62, 1.02]}
          castShadow
        >
          <sphereGeometry
            args={[0.35, 28, 18]}
          />

          <meshStandardMaterial
            color={HAIR}
            roughness={0.7}
          />
        </mesh>

        {/* Front hair */}
        <mesh
          position={[0, 0.22, 0.285]}
          scale={[1.0, 0.55, 0.35]}
          castShadow
        >
          <sphereGeometry
            args={[0.27, 20, 12]}
          />

          <meshStandardMaterial
            color={HAIR}
            roughness={0.68}
          />
        </mesh>

        {/* Side hair */}
        <mesh
          position={[-0.29, 0.08, 0.02]}
          scale={[0.30, 0.52, 0.72]}
        >
          <sphereGeometry
            args={[0.16, 18, 14]}
          />

          <meshStandardMaterial
            color={HAIR}
          />
        </mesh>

        <mesh
          position={[0.29, 0.08, 0.02]}
          scale={[0.30, 0.52, 0.72]}
        >
          <sphereGeometry
            args={[0.16, 18, 14]}
          />

          <meshStandardMaterial
            color={HAIR}
          />
        </mesh>

        {/* ===================================================
            EARS
        =================================================== */}

        <mesh
          position={[-0.34, 0.02, 0]}
        >
          <sphereGeometry
            args={[0.075, 16, 16]}
          />

          <meshStandardMaterial
            color={SKIN}
          />
        </mesh>

        <mesh
          position={[0.34, 0.02, 0]}
        >
          <sphereGeometry
            args={[0.075, 16, 16]}
          />

          <meshStandardMaterial
            color={SKIN}
          />
        </mesh>

        {/* ===================================================
            EYES
        =================================================== */}

        <mesh
          position={[-0.125, 0.035, 0.322]}
        >
          <sphereGeometry
            args={[0.045, 16, 16]}
          />

          <meshStandardMaterial
            color="#101514"
          />
        </mesh>

        <mesh
          position={[0.125, 0.035, 0.322]}
        >
          <sphereGeometry
            args={[0.045, 16, 16]}
          />

          <meshStandardMaterial
            color="#101514"
          />
        </mesh>

        {/* Eye highlights */}
        <mesh
          position={[-0.125, 0.045, 0.361]}
        >
          <sphereGeometry
            args={[0.012, 10, 10]}
          />

          <meshStandardMaterial
            color="#ffffff"
          />
        </mesh>

        <mesh
          position={[0.125, 0.045, 0.361]}
        >
          <sphereGeometry
            args={[0.012, 10, 10]}
          />

          <meshStandardMaterial
            color="#ffffff"
          />
        </mesh>

        {/* ===================================================
            NOSE
        =================================================== */}

        <mesh
          position={[0, -0.045, 0.355]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry
            args={[0.055, 0.13, 8]}
          />

          <meshStandardMaterial
            color="#b97657"
          />
        </mesh>

        {/* ===================================================
            MOUTH
        =================================================== */}

        <mesh
          position={[0, -0.16, 0.32]}
        >
          <boxGeometry
            args={[0.12, 0.018, 0.015]}
          />

          <meshStandardMaterial
            color="#713f37"
          />
        </mesh>

        {/* ===================================================
            EYEBROWS
        =================================================== */}

        <mesh
          position={[-0.125, 0.115, 0.345]}
          rotation={[0, 0, -0.08]}
        >
          <boxGeometry
            args={[0.11, 0.025, 0.025]}
          />

          <meshStandardMaterial
            color={HAIR}
          />
        </mesh>

        <mesh
          position={[0.125, 0.115, 0.345]}
          rotation={[0, 0, 0.08]}
        >
          <boxGeometry
            args={[0.11, 0.025, 0.025]}
          />

          <meshStandardMaterial
            color={HAIR}
          />
        </mesh>
      </group>

      {/* =====================================================
          LEFT ARM
      ===================================================== */}

      <group
        ref={leftArm}
        position={[-0.47, 1.54, 0]}
      >
        {/* Upper arm */}
        <mesh
          position={[0, -0.20, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.105, 0.125, 0.42, 16]}
          />

          <meshStandardMaterial
            color={JACKET}
            roughness={0.8}
          />
        </mesh>

        {/* Elbow */}
        <mesh
          position={[0, -0.42, 0]}
        >
          <sphereGeometry
            args={[0.115, 16, 16]}
          />

          <meshStandardMaterial
            color={JACKET}
          />
        </mesh>

        {/* Forearm */}
        <mesh
          position={[0, -0.62, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.095, 0.11, 0.40, 16]}
          />

          <meshStandardMaterial
            color={JACKET_LIGHT}
            roughness={0.8}
          />
        </mesh>

        {/* Hand */}
        <mesh
          position={[0, -0.86, 0]}
          castShadow
        >
          <sphereGeometry
            args={[0.115, 18, 18]}
          />

          <meshStandardMaterial
            color={SKIN_LIGHT}
            roughness={0.85}
          />
        </mesh>
      </group>

      {/* =====================================================
          RIGHT ARM
      ===================================================== */}

      <group
        ref={rightArm}
        position={[0.47, 1.54, 0]}
      >
        {/* Upper arm */}
        <mesh
          position={[0, -0.20, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.105, 0.125, 0.42, 16]}
          />

          <meshStandardMaterial
            color={JACKET}
            roughness={0.8}
          />
        </mesh>

        {/* Elbow */}
        <mesh
          position={[0, -0.42, 0]}
        >
          <sphereGeometry
            args={[0.115, 16, 16]}
          />

          <meshStandardMaterial
            color={JACKET}
          />
        </mesh>

        {/* Forearm */}
        <mesh
          position={[0, -0.62, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.095, 0.11, 0.40, 16]}
          />

          <meshStandardMaterial
            color={JACKET_LIGHT}
            roughness={0.8}
          />
        </mesh>

        {/* Hand */}
        <mesh
          position={[0, -0.86, 0]}
          castShadow
        >
          <sphereGeometry
            args={[0.115, 18, 18]}
          />

          <meshStandardMaterial
            color={SKIN_LIGHT}
            roughness={0.85}
          />
        </mesh>
      </group>

      {/* =====================================================
          LEFT LEG
      ===================================================== */}

      <group
        ref={leftLeg}
        position={[-0.20, 0.72, 0]}
      >
        {/* Upper leg */}
        <mesh
          position={[0, -0.24, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.145, 0.16, 0.48, 16]}
          />

          <meshStandardMaterial
            color={PANTS}
            roughness={0.85}
          />
        </mesh>

        {/* Knee */}
        <mesh
          position={[0, -0.49, 0]}
        >
          <sphereGeometry
            args={[0.15, 16, 16]}
          />

          <meshStandardMaterial
            color={PANTS}
          />
        </mesh>

        {/* Lower leg */}
        <mesh
          position={[0, -0.73, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.12, 0.14, 0.48, 16]}
          />

          <meshStandardMaterial
            color={PANTS_LIGHT}
            roughness={0.9}
          />
        </mesh>

        {/* Boot */}
        <mesh
          position={[0, -1.02, 0.10]}
          castShadow
        >
          <boxGeometry
            args={[0.27, 0.22, 0.48]}
          />

          <meshStandardMaterial
            color={BOOTS}
            roughness={0.75}
          />
        </mesh>

        {/* Boot sole */}
        <mesh
          position={[0, -1.135, 0.12]}
        >
          <boxGeometry
            args={[0.29, 0.06, 0.50]}
          />

          <meshStandardMaterial
            color={BOOT_SOLE}
          />
        </mesh>
      </group>

      {/* =====================================================
          RIGHT LEG
      ===================================================== */}

      <group
        ref={rightLeg}
        position={[0.20, 0.72, 0]}
      >
        {/* Upper leg */}
        <mesh
          position={[0, -0.24, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.145, 0.16, 0.48, 16]}
          />

          <meshStandardMaterial
            color={PANTS}
            roughness={0.85}
          />
        </mesh>

        {/* Knee */}
        <mesh
          position={[0, -0.49, 0]}
        >
          <sphereGeometry
            args={[0.15, 16, 16]}
          />

          <meshStandardMaterial
            color={PANTS}
          />
        </mesh>

        {/* Lower leg */}
        <mesh
          position={[0, -0.73, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.12, 0.14, 0.48, 16]}
          />

          <meshStandardMaterial
            color={PANTS_LIGHT}
            roughness={0.9}
          />
        </mesh>

        {/* Boot */}
        <mesh
          position={[0, -1.02, 0.10]}
          castShadow
        >
          <boxGeometry
            args={[0.27, 0.22, 0.48]}
          />

          <meshStandardMaterial
            color={BOOTS}
            roughness={0.75}
          />
        </mesh>

        {/* Boot sole */}
        <mesh
          position={[0, -1.135, 0.12]}
        >
          <boxGeometry
            args={[0.29, 0.06, 0.50]}
          />

          <meshStandardMaterial
            color={BOOT_SOLE}
          />
        </mesh>
      </group>

      {/* =====================================================
          BACKPACK
      ===================================================== */}

      <group position={[0, 1.30, -0.30]}>
        {/* Main backpack */}
        <mesh castShadow>
          <boxGeometry
            args={[0.52, 0.72, 0.22]}
          />

          <meshStandardMaterial
            color="#293832"
            roughness={0.9}
          />
        </mesh>

        {/* Upper backpack */}
        <mesh
          position={[0, 0.27, -0.035]}
        >
          <boxGeometry
            args={[0.40, 0.20, 0.08]}
          />

          <meshStandardMaterial
            color="#35483e"
          />
        </mesh>

        {/* Backpack pocket */}
        <mesh
          position={[0, -0.10, -0.125]}
        >
          <boxGeometry
            args={[0.34, 0.24, 0.05]}
          />

          <meshStandardMaterial
            color="#1c2922"
          />
        </mesh>
      </group>

      {/* =====================================================
          SHOULDER STRAPS
      ===================================================== */}

      <mesh
        position={[-0.27, 1.43, -0.20]}
      >
        <boxGeometry
          args={[0.075, 0.67, 0.08]}
        />

        <meshStandardMaterial
          color={STRAP}
        />
      </mesh>

      <mesh
        position={[0.27, 1.43, -0.20]}
      >
        <boxGeometry
          args={[0.075, 0.67, 0.08]}
        />

        <meshStandardMaterial
          color={STRAP}
        />
      </mesh>

      {/* =====================================================
          SMALL NECK / BACK COLLAR
      ===================================================== */}

      <mesh
        position={[0, 1.79, -0.16]}
      >
        <boxGeometry
          args={[0.38, 0.14, 0.10]}
        />

        <meshStandardMaterial
          color={JACKET_LIGHT}
        />
      </mesh>

      {/* =====================================================
          WEAPON
      ===================================================== */}

      <AssaultRifle
        shooting={shooting}
        reloading={reloading}
        aiming={aiming}
        muzzleFlashId={muzzleFlashId}
      />

    </group>
  );
}


