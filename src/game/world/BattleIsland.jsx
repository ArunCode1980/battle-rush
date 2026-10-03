import { useMemo } from "react";

import TrainingDummy from "../enemies/TrainingDummy";
import EnemyBot from "../enemies/EnemyBot";

import LootPickup from "./LootPickup";

export const WORLD_COLLIDERS = [
  // =========================================================
  // HOUSES
  // =========================================================

  {
    type: "box",
    x: -7,
    z: -8,
    halfX: 2,
    halfZ: 2,
  },

  {
    type: "box",
    x: 7,
    z: -8,
    halfX: 2,
    halfZ: 2,
  },

  {
    type: "box",
    x: -7,
    z: 8,
    halfX: 2,
    halfZ: 2,
  },

  // =========================================================
  // TREES
  // =========================================================

  {
    type: "circle",
    x: -15,
    z: -15,
    radius: 0.9,
  },

  {
    type: "circle",
    x: -10,
    z: -20,
    radius: 0.9,
  },

  {
    type: "circle",
    x: 12,
    z: -18,
    radius: 0.9,
  },

  {
    type: "circle",
    x: 18,
    z: -10,
    radius: 0.9,
  },

  {
    type: "circle",
    x: -20,
    z: 5,
    radius: 0.9,
  },

  {
    type: "circle",
    x: 20,
    z: 8,
    radius: 0.9,
  },

  {
    type: "circle",
    x: -17,
    z: 18,
    radius: 0.9,
  },

  {
    type: "circle",
    x: 15,
    z: 20,
    radius: 0.9,
  },

  {
    type: "circle",
    x: -5,
    z: 23,
    radius: 0.9,
  },

  {
    type: "circle",
    x: 5,
    z: 22,
    radius: 0.9,
  },

  // =========================================================
  // ROCKS
  // =========================================================

  {
    type: "circle",
    x: -8,
    z: -8,
    radius: 0.8,
  },

  {
    type: "circle",
    x: 10,
    z: -5,
    radius: 0.9,
  },

  {
    type: "circle",
    x: -13,
    z: 10,
    radius: 1.0,
  },

  {
    type: "circle",
    x: 12,
    z: 14,
    radius: 1.1,
  },
];

// =========================================================
// TREE
// =========================================================

function Tree({
  position,
  scale = 1,
}) {
  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh
        position={[0, 1, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.15,
            0.2,
            2,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#5b3a24"
        />
      </mesh>

      <mesh
        position={[0, 2.3, 0]}
        castShadow
      >
        <coneGeometry
          args={[
            1,
            2.5,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#245c2a"
        />
      </mesh>
    </group>
  );
}

// =========================================================
// ROCK
// =========================================================

function Rock({
  position,
  scale = 1,
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
    >
      <dodecahedronGeometry
        args={[0.7, 0]}
      />

      <meshStandardMaterial
        color="#555b58"
      />
    </mesh>
  );
}

// =========================================================
// HOUSE
// =========================================================

function House({
  position,
  rotation = 0,
}) {
  return (
    <group
      position={position}
      rotation={[
        0,
        rotation,
        0,
      ]}
    >
      <mesh
        position={[0, 1, 0]}
        castShadow
      >
        <boxGeometry
          args={[
            4,
            2,
            4,
          ]}
        />

        <meshStandardMaterial
          color="#b7a27d"
        />
      </mesh>

      <mesh
        position={[0, 2.5, 0]}
        rotation={[
          0,
          Math.PI / 4,
          0,
        ]}
        castShadow
      >
        <coneGeometry
          args={[
            3.2,
            1.8,
            4,
          ]}
        />

        <meshStandardMaterial
          color="#5a2922"
        />
      </mesh>

      <mesh
        position={[
          0,
          0.7,
          2.03,
        ]}
      >
        <boxGeometry
          args={[
            0.8,
            1.4,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#39251b"
        />
      </mesh>
    </group>
  );
}

// =========================================================
// ROAD
// =========================================================

function Road({
  position,
  rotation = 0,
}) {
  return (
    <mesh
      position={[
        position[0],
        0.03,
        position[1],
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        rotation,
      ]}
    >
      <planeGeometry
        args={[
          10,
          80,
        ]}
      />

      <meshStandardMaterial
        color="#333536"
      />
    </mesh>
  );
}

// =========================================================
// BATTLE ISLAND
// =========================================================

export default function BattleIsland() {
  const trees = useMemo(
    () => [
      [-15, 0, -15],
      [-10, 0, -20],
      [12, 0, -18],
      [18, 0, -10],
      [-20, 0, 5],
      [20, 0, 8],
      [-17, 0, 18],
      [15, 0, 20],
      [-5, 0, 23],
      [5, 0, 22],
    ],
    []
  );

  const rocks = useMemo(
    () => [
      [-8, 0.5, -8],
      [10, 0.5, -5],
      [-13, 0.5, 10],
      [12, 0.5, 14],
    ],
    []
  );

  return (
    <group>

      {/* =====================================================
          ISLAND
          ===================================================== */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[
            70,
            70,
          ]}
        />

        <meshStandardMaterial
          color="#476d3d"
        />
      </mesh>

      {/* =====================================================
          WATER
          ===================================================== */}

      <mesh
        position={[
          0,
          -0.15,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            110,
            110,
          ]}
        />

        <meshStandardMaterial
          color="#1c5b73"
        />
      </mesh>

      {/* =====================================================
          ROAD
          ===================================================== */}

      <Road
        position={[
          0,
          0,
        ]}
      />

      {/* =====================================================
          HOUSES
          ===================================================== */}

      <House
        position={[
          -7,
          0,
          -8,
        ]}
      />

      <House
        position={[
          7,
          0,
          -8,
        ]}
        rotation={
          Math.PI / 2
        }
      />

      <House
        position={[
          -7,
          0,
          8,
        ]}
        rotation={
          Math.PI
        }
      />

      {/* =====================================================
          TREES
          ===================================================== */}

      {trees.map(
        (
          position,
          index
        ) => (
          <Tree
            key={index}
            position={
              position
            }
            scale={
              0.8 +
              (index % 3) *
                0.15
            }
          />
        )
      )}

      {/* =====================================================
          ROCKS
          ===================================================== */}

      {rocks.map(
        (
          position,
          index
        ) => (
          <Rock
            key={index}
            position={
              position
            }
            scale={
              0.8 +
              index * 0.1
            }
          />
        )
      )}

      {/* =====================================================
          TRAINING DUMMY
          ===================================================== */}

      <TrainingDummy
        position={[
          0,
          0,
          -12,
        ]}
      />

      {/* =====================================================
          ENEMY
          ===================================================== */}

      <EnemyBot
        position={[
          14,
          0,
          -5,
        ]}
      />

      {/* =====================================================
          LOOT
          ===================================================== */}

      <LootPickup
        type="ammo"
        position={[
          2,
          0.25,
          3,
        ]}
      />

      <LootPickup
        type="ammo"
        position={[
          -3,
          0.25,
          5,
        ]}
      />

      <LootPickup
        type="medkits"
        position={[
          9,
          0.25,
          2,
        ]}
      />

      <LootPickup
        type="grenades"
        position={[
          -10,
          0.25,
          -2,
        ]}
      />

    </group>
  );
}