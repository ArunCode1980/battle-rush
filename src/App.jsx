import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import BattleIsland from "./game/world/BattleIsland";
import KaiController from "./game/player/KaiController";
import KaiCharacter from "./game/player/KaiCharacter";
import InventoryHUD from "./game/ui/InventoryHUD";
import WaitingArena from "./game/lobby/WaitingArena";

import "./App.css";

function GameWorld() {
  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <PerspectiveCamera
        makeDefault
        position={[0, 5.8, 9]}
        fov={65}
      />

      <hemisphereLight
        intensity={1.5}
        groundColor="#182018"
        skyColor="#dfffea"
      />

      <directionalLight
        position={[8, 14, 8]}
        intensity={2.3}
        castShadow
      />

      <ambientLight intensity={0.35} />

      <BattleIsland />

      <KaiController />
    </Canvas>
  );
}

function LobbyWorld() {
  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <PerspectiveCamera
        makeDefault
        position={[0, 2.8, 7.5]}
        fov={45}
      />

      <hemisphereLight
        intensity={1.7}
        groundColor="#182018"
        skyColor="#dfffea"
      />

      <directionalLight
        position={[5, 10, 7]}
        intensity={2.4}
        castShadow
      />

      <ambientLight intensity={0.4} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
      >
        <planeGeometry args={[30, 30]} />

        <meshStandardMaterial
          color="#26382b"
          roughness={1}
        />
      </mesh>

      <KaiCharacter
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </Canvas>
  );
}

function LoadingScreen({ onDone }) {
  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => {
        const next = Math.min(
          value + 4,
          100
        );

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(onDone, 500);
        }

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="loading-screen">
      <div className="loading-logo">
        BR
      </div>

      <div className="loading-title">
        BATTLE RUSH
      </div>

      <div className="loading-subtitle">
        BATTLE ROYALE
      </div>

      <div className="loading-bar">
        <div
          className="loading-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="loading-percent">
        {progress}%
      </div>
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div
      className="start-screen"
      onClick={onStart}
    >
      <div className="start-logo">
        BR
      </div>

      <div className="start-title">
        BATTLE RUSH
      </div>

      <div className="start-subtitle">
        BATTLE ROYALE
      </div>

      <button className="start-button">
        TAP TO BEGIN
      </button>

      <div className="start-hint">
        CLICK ANYWHERE TO START
      </div>
    </div>
  );
}

function Lobby({ onPlay }) {
  return (
    <div className="lobby-screen">
      <div className="lobby-world">
        <LobbyWorld />
      </div>

      <div className="lobby-overlay" />

      <div className="lobby-top">
        <div>
          <div className="lobby-logo-small">
            BR
          </div>

          <div className="lobby-title">
            BATTLE RUSH
          </div>
        </div>

        <div className="player-profile">
          <div className="profile-avatar">
            K
          </div>

          <div>
            <div className="profile-name">
              KAI
            </div>

            <div className="profile-level">
              LV. 1
            </div>
          </div>
        </div>
      </div>

      <div className="character-card">
        <div className="character-label">
          DEFAULT HERO
        </div>

        <div className="character-name">
          KAI
        </div>

        <div className="character-role">
          ASSAULT • SURVIVOR
        </div>
      </div>

      <div className="lobby-bottom-menu">
        <button>CHARACTER</button>
        <button>WEAPONS</button>
        <button>INVENTORY</button>
        <button>ROYALE</button>
      </div>

      <button
        className="lobby-play-button"
        onClick={onPlay}
      >
        PLAY
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] =
    useState("loading");

  const goToStart = () => {
    setScreen("start");
  };

  const goToLobby = () => {
    setScreen("lobby");
  };

  const startMatchmaking = () => {
    setScreen("waiting");
  };

  const startGame = () => {
    setScreen("game");
  };

  return (
    <div className="app">
      {screen === "loading" && (
        <LoadingScreen
          onDone={goToStart}
        />
      )}

      {screen === "start" && (
        <StartScreen
          onStart={goToLobby}
        />
      )}

      {screen === "lobby" && (
        <Lobby
          onPlay={startMatchmaking}
        />
      )}

      {screen === "waiting" && (
        <WaitingArena
          onMatchStart={startGame}
        />
      )}

      {screen === "game" && (
        <div className="game-screen">
          <div className="game-world">
            <GameWorld />
          </div>

          <div className="game-top-hud">
            <div className="game-logo">
              BR
            </div>

            <div className="match-info">
              <span>ALIVE</span>
              <strong>24</strong>
            </div>

            <div className="match-info">
              <span>KILLS</span>
              <strong>0</strong>
            </div>
          </div>

          <InventoryHUD />
        </div>
      )}
    </div>
  );
}