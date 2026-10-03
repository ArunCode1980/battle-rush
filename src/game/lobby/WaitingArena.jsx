import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import WaitingController from "./WaitingController";

/* =========================================================
   HOUSE
========================================================= */

function House({
  position,
  rotation = 0,
  scale = 1,
  color = "#b39a76",
  roofColor = "#4b3b31",
}) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >
      {/* Foundation */}

      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[4.1, 0.26, 3.35]} />
        <meshStandardMaterial
          color="#625e54"
          roughness={1}
        />
      </mesh>

      {/* Main building */}

      <mesh
        position={[0, 1.55, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.75, 2.8, 3]} />

        <meshStandardMaterial
          color={color}
          roughness={0.88}
        />
      </mesh>

      {/* Roof */}

      <mesh
        position={[0, 3.32, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <coneGeometry
          args={[2.85, 1.5, 4]}
        />

        <meshStandardMaterial
          color={roofColor}
          roughness={0.95}
        />
      </mesh>

      {/* Front porch */}

      <mesh position={[0, 0.52, 1.82]}>
        <boxGeometry args={[1.7, 0.12, 0.9]} />

        <meshStandardMaterial
          color="#77664f"
          roughness={1}
        />
      </mesh>

      {/* Door */}

      <mesh position={[0, 1.05, 1.53]}>
        <boxGeometry args={[0.72, 1.65, 0.1]} />

        <meshStandardMaterial
          color="#3c2a20"
          roughness={0.9}
        />
      </mesh>

      {/* Door handle */}

      <mesh position={[0.21, 1.05, 1.6]}>
        <sphereGeometry args={[0.055, 8, 8]} />

        <meshStandardMaterial
          color="#d2b46b"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Front windows */}

      <mesh position={[-1.08, 1.72, 1.53]}>
        <boxGeometry args={[0.8, 0.72, 0.08]} />

        <meshStandardMaterial
          color="#6fabb7"
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>

      <mesh position={[1.08, 1.72, 1.53]}>
        <boxGeometry args={[0.8, 0.72, 0.08]} />

        <meshStandardMaterial
          color="#6fabb7"
          roughness={0.22}
          metalness={0.12}
        />
      </mesh>

      {/* Window vertical frames */}

      <mesh position={[-1.08, 1.72, 1.59]}>
        <boxGeometry args={[0.07, 0.78, 0.05]} />

        <meshStandardMaterial color="#51463a" />
      </mesh>

      <mesh position={[1.08, 1.72, 1.59]}>
        <boxGeometry args={[0.07, 0.78, 0.05]} />

        <meshStandardMaterial color="#51463a" />
      </mesh>

      {/* Side window */}

      <mesh
        position={[1.9, 1.72, 0.35]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[0.75, 0.7, 0.08]} />

        <meshStandardMaterial
          color="#6fabb7"
          roughness={0.22}
        />
      </mesh>

      {/* Small chimney */}

      <mesh position={[0.95, 4.05, -0.55]}>
        <boxGeometry args={[0.45, 1.1, 0.45]} />

        <meshStandardMaterial
          color="#63584c"
          roughness={1}
        />
      </mesh>

      {/* Balcony */}

      <group position={[0, 2.45, -1.58]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.65, 0.1, 0.75]} />

          <meshStandardMaterial
            color="#77634e"
          />
        </mesh>

        {[-0.7, -0.23, 0.23, 0.7].map(
          (x, index) => (
            <mesh
              key={index}
              position={[x, 0.45, 0.25]}
            >
              <cylinderGeometry
                args={[0.035, 0.035, 0.9, 6]}
              />

              <meshStandardMaterial
                color="#4d4338"
              />
            </mesh>
          )
        )}
      </group>
    </group>
  );
}

/* =========================================================
   TREE
========================================================= */

function Tree({
  position,
  scale = 1,
  variant = 0,
}) {
  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Trunk */}

      <mesh
        position={[0, 1.35, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.18,
            0.34,
            2.7,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#4f3926"
          roughness={1}
        />
      </mesh>

      {/* Branch */}

      <mesh
        position={[
          variant === 1 ? 0.3 : -0.25,
          2.35,
          0,
        ]}
        rotation={[
          0,
          0,
          variant === 1 ? -0.45 : 0.45,
        ]}
      >
        <cylinderGeometry
          args={[0.07, 0.11, 1.15, 7]}
        />

        <meshStandardMaterial
          color="#4f3926"
          roughness={1}
        />
      </mesh>

      {/* Lower leaves */}

      <mesh
        position={[0, 2.55, 0]}
        castShadow
      >
        <sphereGeometry
          args={[1.35, 10, 8]}
        />

        <meshStandardMaterial
          color={
            variant === 2
              ? "#315f36"
              : "#285c31"
          }
          roughness={1}
        />
      </mesh>

      {/* Upper leaves */}

      <mesh
        position={[
          variant === 1 ? 0.18 : -0.12,
          3.45,
          0,
        ]}
        castShadow
      >
        <coneGeometry
          args={[
            1.15,
            2.25,
            9,
          ]}
        />

        <meshStandardMaterial
          color={
            variant === 2
              ? "#3b7040"
              : "#2f6837"
          }
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   ROCK
========================================================= */

function Rock({
  position,
  scale = 1,
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[
        0.12,
        0.45,
        -0.1,
      ]}
      castShadow
    >
      <dodecahedronGeometry
        args={[0.7, 1]}
      />

      <meshStandardMaterial
        color="#66685f"
        roughness={1}
      />
    </mesh>
  );
}

/* =========================================================
   FENCE
========================================================= */

function Fence({
  position,
  rotation = 0,
  length = 3,
}) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >
      {[...Array(4)].map(
        (_, index) => {
          const x =
            -length / 2 +
            index * (length / 3);

          return (
            <mesh
              key={index}
              position={[x, 0.6, 0]}
            >
              <boxGeometry
                args={[
                  0.13,
                  1.2,
                  0.13,
                ]}
              />

              <meshStandardMaterial
                color="#6b5137"
                roughness={1}
              />
            </mesh>
          );
        }
      )}

      <mesh
        position={[0, 0.85, 0]}
      >
        <boxGeometry
          args={[length, 0.12, 0.12]}
        />

        <meshStandardMaterial
          color="#735638"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, 0.42, 0]}
      >
        <boxGeometry
          args={[length, 0.1, 0.1]}
        />

        <meshStandardMaterial
          color="#735638"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   STREET LIGHT
========================================================= */

function StreetLight({
  position,
}) {
  return (
    <group position={position}>
      <mesh
        position={[0, 2, 0]}
      >
        <cylinderGeometry
          args={[0.07, 0.1, 4, 8]}
        />

        <meshStandardMaterial
          color="#30332f"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      <mesh
        position={[0, 4.05, 0]}
      >
        <boxGeometry
          args={[0.65, 0.1, 0.1]}
        />

        <meshStandardMaterial
          color="#30332f"
        />
      </mesh>

      <mesh
        position={[0.28, 3.95, 0]}
      >
        <sphereGeometry
          args={[0.13, 10, 10]}
        />

        <meshStandardMaterial
          color="#f5df9b"
          emissive="#c99846"
          emissiveIntensity={1.5}
        />
      </mesh>

      <pointLight
        position={[0.28, 3.9, 0]}
        intensity={0.45}
        distance={6}
        color="#ffd88a"
      />
    </group>
  );
}

/* =========================================================
   BENCH
========================================================= */

function Bench({
  position,
  rotation = 0,
}) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry
          args={[1.7, 0.15, 0.45]}
        />

        <meshStandardMaterial
          color="#745337"
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 1.05, -0.18]}>
        <boxGeometry
          args={[1.7, 0.75, 0.12]}
        />

        <meshStandardMaterial
          color="#745337"
          roughness={1}
        />
      </mesh>

      {[-0.6, 0.6].map(
        (x, index) => (
          <mesh
            key={index}
            position={[x, 0.3, 0]}
          >
            <boxGeometry
              args={[0.12, 0.6, 0.12]}
            />

            <meshStandardMaterial
              color="#3e3428"
            />
          </mesh>
        )
      )}
    </group>
  );
}

/* =========================================================
   WAITING PLAYER
========================================================= */

function WaitingPlayer({
  position,
  color,
  rotation = 0,
}) {
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
    >
      {/* Body */}

      <mesh
        position={[0, 1.05, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.58, 0.9, 0.34]}
        />

        <meshStandardMaterial
          color={color}
          roughness={0.8}
        />
      </mesh>

      {/* Head */}

      <mesh
        position={[0, 1.72, 0]}
        castShadow
      >
        <sphereGeometry
          args={[0.3, 16, 16]}
        />

        <meshStandardMaterial
          color="#d5a078"
          roughness={0.8}
        />
      </mesh>

      {/* Hair */}

      <mesh
        position={[0, 1.9, 0]}
      >
        <sphereGeometry
          args={[0.31, 14, 10]}
        />

        <meshStandardMaterial
          color="#161616"
          roughness={0.9}
        />
      </mesh>

      {/* Arms */}

      <mesh
        position={[-0.4, 1.08, 0]}
      >
        <boxGeometry
          args={[0.18, 0.75, 0.18]}
        />

        <meshStandardMaterial
          color={color}
        />
      </mesh>

      <mesh
        position={[0.4, 1.08, 0]}
      >
        <boxGeometry
          args={[0.18, 0.75, 0.18]}
        />

        <meshStandardMaterial
          color={color}
        />
      </mesh>

      {/* Legs */}

      <mesh
        position={[-0.17, 0.42, 0]}
      >
        <boxGeometry
          args={[0.22, 0.7, 0.25]}
        />

        <meshStandardMaterial
          color="#252525"
        />
      </mesh>

      <mesh
        position={[0.17, 0.42, 0]}
      >
        <boxGeometry
          args={[0.22, 0.7, 0.25]}
        />

        <meshStandardMaterial
          color="#252525"
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   LAKE
========================================================= */

function Lake() {
  return (
    <group position={[9, 0, -8]}>
      {/* Shore */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <circleGeometry
          args={[4.7, 48]}
        />

        <meshStandardMaterial
          color="#68755c"
          roughness={1}
        />
      </mesh>

      {/* Water */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.065, 0]}
      >
        <circleGeometry
          args={[4.2, 64]}
        />

        <meshStandardMaterial
          color="#3e899c"
          roughness={0.16}
          metalness={0.08}
        />
      </mesh>

      {/* Water inner highlight */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.075, 0]}
      >
        <torusGeometry
          args={[
            3.25,
            0.035,
            8,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#75c1cc"
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Little island */}

      <mesh
        position={[-0.65, 0.18, 0.45]}
      >
        <cylinderGeometry
          args={[0.9, 1.05, 0.3, 20]}
        />

        <meshStandardMaterial
          color="#52694b"
          roughness={1}
        />
      </mesh>

      {/* Tree on island */}

      <Tree
        position={[-0.65, 0.25, 0.45]}
        scale={0.42}
        variant={2}
      />

      {/* Wooden dock */}

      <group
        position={[-3.5, 0.18, 0.2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <mesh>
          <boxGeometry
            args={[3.2, 0.18, 1]}
          />

          <meshStandardMaterial
            color="#765637"
            roughness={1}
          />
        </mesh>

        {[-1.2, 1.2].map(
          (x, index) => (
            <mesh
              key={index}
              position={[
                x,
                -0.35,
                0,
              ]}
            >
              <cylinderGeometry
                args={[
                  0.08,
                  0.08,
                  0.7,
                  8,
                ]}
              />

              <meshStandardMaterial
                color="#4c3926"
              />
            </mesh>
          )
        )}
      </group>
    </group>
  );
}

/* =========================================================
   WAITING WORLD
========================================================= */

function WaitingWorld() {
  const trees = [
    [-16, 0, -14],
    [-14, 0, -5],
    [-16, 0, 4],
    [-14, 0, 13],

    [16, 0, -14],
    [14, 0, -5],
    [16, 0, 5],
    [14, 0, 14],

    [-7, 0, -16],
    [0, 0, -16],
    [7, 0, -16],

    [-7, 0, 16],
    [1, 0, 16],
    [8, 0, 16],

    [-16, 0, -1],
    [16, 0, 1],
  ];

  const bots = [
    {
      p: [-6, 0, -3],
      c: "#3b82f6",
      r: 0.7,
    },
    {
      p: [6, 0, -3],
      c: "#ef4444",
      r: -0.7,
    },
    {
      p: [-7, 0, 5],
      c: "#f59e0b",
      r: 1.4,
    },
    {
      p: [7, 0, 5],
      c: "#a855f7",
      r: -1.4,
    },
    {
      p: [-3, 0, 8],
      c: "#14b8a6",
      r: 2.6,
    },
    {
      p: [4, 0, 9],
      c: "#f97316",
      r: -2.6,
    },
    {
      p: [-10, 0, -7],
      c: "#22c55e",
      r: 0.3,
    },
    {
      p: [10, 0, -6],
      c: "#ec4899",
      r: -0.3,
    },
    {
      p: [-9, 0, 11],
      c: "#eab308",
      r: 1.9,
    },
    {
      p: [12, 0, 10],
      c: "#06b6d4",
      r: -1.9,
    },
  ];

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 3, 11]}
        fov={55}
      />

      {/* Lighting */}

      <hemisphereLight
        intensity={1.55}
        skyColor="#d9f4df"
        groundColor="#18231a"
      />

      <directionalLight
        position={[8, 14, 7]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <ambientLight intensity={0.35} />

      {/* Main terrain */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[40, 40]}
        />

        <meshStandardMaterial
          color="#486846"
          roughness={1}
        />
      </mesh>

      {/* Slight outer terrain */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.045, 0]}
      >
        <ringGeometry
          args={[18, 22, 48]}
        />

        <meshStandardMaterial
          color="#344b35"
          roughness={1}
        />
      </mesh>

      {/* Main vertical road */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <planeGeometry
          args={[4.4, 37]}
        />

        <meshStandardMaterial
          color="#766b56"
          roughness={1}
        />
      </mesh>

      {/* Main horizontal road */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          Math.PI / 2,
        ]}
        position={[0, 0.015, 0]}
      >
        <planeGeometry
          args={[4.4, 37]}
        />

        <meshStandardMaterial
          color="#766b56"
          roughness={1}
        />
      </mesh>

      {/* Road center markings */}

      {[-13, -8, -3, 3, 8, 13].map(
        (z, index) => (
          <mesh
            key={`v-${index}`}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
            position={[
              0,
              0.025,
              z,
            ]}
          >
            <planeGeometry
              args={[0.16, 2]}
            />

            <meshBasicMaterial
              color="#c4ad72"
            />
          </mesh>
        )
      )}

      {[-13, -8, -3, 3, 8, 13].map(
        (x, index) => (
          <mesh
            key={`h-${index}`}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
            position={[
              x,
              0.03,
              0,
            ]}
          >
            <planeGeometry
              args={[2, 0.16]}
            />

            <meshBasicMaterial
              color="#c4ad72"
            />
          </mesh>
        )
      )}

      {/* Lake */}

      <Lake />

      {/* Houses */}

      <House
        position={[-10, 0, -10]}
        rotation={0.15}
        scale={0.92}
        color="#b89d78"
        roofColor="#4a3830"
      />

      <House
        position={[-11, 0, 7]}
        rotation={-0.35}
        scale={1}
        color="#9d886c"
        roofColor="#45382f"
      />

      <House
        position={[10, 0, 8]}
        rotation={2.9}
        scale={0.88}
        color="#b19b7a"
        roofColor="#514039"
      />

      <House
        position={[9, 0, -2]}
        rotation={-0.4}
        scale={0.78}
        color="#aa9070"
        roofColor="#47372f"
      />

      {/* Trees */}

      {trees.map(
        (tree, index) => (
          <Tree
            key={index}
            position={tree}
            scale={
              0.78 +
              (index % 4) * 0.12
            }
            variant={
              index % 3
            }
          />
        )
      )}

      {/* Rocks */}

      <Rock
        position={[-7, 0.55, -11]}
        scale={1.1}
      />

      <Rock
        position={[3, 0.4, -13]}
        scale={0.72}
      />

      <Rock
        position={[-14, 0.45, 1]}
        scale={0.9}
      />

      <Rock
        position={[14, 0.4, 12]}
        scale={0.82}
      />

      <Rock
        position={[-13, 0.35, 10]}
        scale={0.6}
      />

      {/* Fences near houses */}

      <Fence
        position={[-7.7, 0, -10.8]}
        rotation={0.15}
        length={3.2}
      />

      <Fence
        position={[-12.5, 0, 9]}
        rotation={-0.35}
        length={3}
      />

      <Fence
        position={[12.4, 0, 8.8]}
        rotation={2.9}
        length={3}
      />

      {/* Street lights */}

      <StreetLight
        position={[-2.7, 0, -7]}
      />

      <StreetLight
        position={[2.7, 0, 7]}
      />

      <StreetLight
        position={[-7, 0, 2.7]}
      />

      <StreetLight
        position={[7, 0, -2.7]}
      />

      {/* Benches */}

      <Bench
        position={[-3, 0, 3.2]}
        rotation={0}
      />

      <Bench
        position={[3, 0, -3.2]}
        rotation={Math.PI}
      />

      {/* Central gathering plaza */}

      <mesh
        position={[0, 0.08, 0]}
      >
        <cylinderGeometry
          args={[4.5, 4.5, 0.16, 48]}
        />

        <meshStandardMaterial
          color="#4d574b"
          roughness={1}
        />
      </mesh>

      {/* Plaza outer ring */}

      <mesh
        position={[0, 0.18, 0]}
      >
        <torusGeometry
          args={[
            3.5,
            0.07,
            10,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#67e6a5"
        />
      </mesh>

      {/* Center fire pit */}

      <mesh
        position={[0, 0.28, 0]}
      >
        <cylinderGeometry
          args={[0.7, 0.8, 0.35, 12]}
        />

        <meshStandardMaterial
          color="#39342b"
          roughness={1}
        />
      </mesh>

      {/* Fire glow */}

      <pointLight
        position={[0, 1, 0]}
        intensity={1.3}
        distance={7}
        color="#ffb45c"
      />

      {/* Waiting players */}

      {bots.map(
        (bot, index) => (
          <WaitingPlayer
            key={index}
            position={bot.p}
            color={bot.c}
            rotation={bot.r}
          />
        )
      )}

      {/* Actual KAI */}

      <WaitingController />
    </>
  );
}

/* =========================================================
   WAITING ARENA
========================================================= */

export default function WaitingArena({
  onMatchStart,
}) {
  const [countdown, setCountdown] =
    useState(30);

  const [players, setPlayers] =
    useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((value) =>
        Math.max(0, value - 1)
      );

      setPlayers((value) => {
        if (value >= 24) {
          return 24;
        }

        if (Math.random() > 0.3) {
          return Math.min(
            24,
            value + 1
          );
        }

        return value;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown !== 0) {
      return;
    }

    const timeout = setTimeout(() => {
      if (onMatchStart) {
        onMatchStart();
      }
    }, 1800);

    return () =>
      clearTimeout(timeout);
  }, [
    countdown,
    onMatchStart,
  ]);

  return (
    <div className="waiting-screen">
      {/* 3D WORLD */}

      <div className="waiting-world">
        <Canvas
          shadows
          dpr={[1, 1.5]}
        >
          <WaitingWorld />
        </Canvas>
      </div>

      {/* TOP HUD */}

      <div className="waiting-top-hud">
        <div className="waiting-mini-brand">
          <div className="waiting-mini-logo">
            BR
          </div>

          <div>
            <div className="waiting-mini-title">
              BATTLE RUSH
            </div>

            <div className="waiting-mini-subtitle">
              WAITING ISLAND
            </div>
          </div>
        </div>

        <div className="waiting-match-box">
          <div>
            <span>PLAYERS</span>

            <strong>
              {players}/24
            </strong>
          </div>

          <div className="waiting-divider" />

          <div>
            <span>STARTING</span>

            <strong className="waiting-time">
              {countdown}s
            </strong>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}

      <div className="waiting-bottom-hud">
        <div className="waiting-control">
          <b>W A S D</b>
          <span>MOVE</span>
        </div>

        <div className="waiting-control">
          <b>SHIFT</b>
          <span>SPRINT</span>
        </div>

        <div className="waiting-control">
          <b>SPACE</b>
          <span>JUMP</span>
        </div>

        <div className="waiting-control">
          <b>MOUSE</b>
          <span>LOOK</span>
        </div>
      </div>

      <div className="waiting-location">
        PRE-MATCH ISLAND
      </div>

      {countdown <= 5 && (
        <div className="waiting-deploy">
          MATCH STARTING...
        </div>
      )}
    </div>
  );
}