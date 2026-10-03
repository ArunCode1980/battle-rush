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

function Lobby({ onPlay,matchmakingTime,matchmakingTotal,onCancelMatchmaking, }) {

  const [selectedMode, setSelectedMode] = useState("solo");

  return (
    <div className="lobby-screen">
      <div className="lobby-world">
        <LobbyWorld />
      </div>

      <div className="lobby-overlay" />

      {matchmakingTime !== null && (
  <div className="lobby-matchmaking-mini">

    <div className="lobby-matchmaking-info">

      <span className="lobby-matchmaking-label">
        MATCHING
      </span>

      <strong>
        {matchmakingTime}
      </strong>

      <span className="lobby-matchmaking-sec">
        SEC
      </span>

    </div>

    <div className="lobby-matchmaking-progress">
      <div
        style={{
          width: `${
            matchmakingTotal
              ? ((matchmakingTotal - matchmakingTime) /
                  matchmakingTotal) *
                100
              : 0
          }%`,
        }}
      />
    </div>

    <button
      className="lobby-matchmaking-cancel"
      onClick={onCancelMatchmaking}
      aria-label="Cancel matchmaking"
    >
      ×
    </button>

  </div>
)}

      <div className="lobby-currency-bar">
  <div className="lobby-player-mini">
    <div className="lobby-player-avatar">K</div>

    <div>
      <strong>KAI</strong>
      <span>LV. 1</span>
    </div>
  </div>

  <div className="lobby-currency">
    <div>
      <span>GOLD</span>
      <strong>0</strong>
    </div>

    <div>
      <span>DIAMONDS</span>
      <strong>0</strong>
    </div>
  </div>
</div>

<div className="lobby-side-menu">
  <button>
    <b>⚡</b>
    <span>EVENTS</span>
  </button>

  <button>
    <b>◈</b>
    <span>STORE</span>
  </button>

  <button>
    <b>◆</b>
    <span>ROYALE</span>
  </button>

  <button>
    <b>★</b>
    <span>MISSIONS</span>
  </button>
</div>

<div className="lobby-event-card">
  <span className="lobby-event-tag">LIVE EVENT</span>

  <strong>SEASON ZERO</strong>

  <p>
    Prepare for the first BATTLE RUSH season.
  </p>

  <button>VIEW EVENT</button>
</div>

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
      <div className="lobby-mode-selector">

  <div className="lobby-mode-label">
    BATTLE MODE
  </div>

  <div className="lobby-mode-options">

    <button
      className={`lobby-mode-card ${
        selectedMode === "solo" ? "active" : ""
      }`}
      onClick={() => setSelectedMode("solo")}
    >
      <div className="mode-players mode-solo">
        <span>●</span>
      </div>

      <strong>SOLO</strong>
      <small>1 PLAYER</small>
    </button>


    <button
      className={`lobby-mode-card ${
        selectedMode === "duo" ? "active" : ""
      }`}
      onClick={() => setSelectedMode("duo")}
    >
      <div className="mode-players mode-duo">
        <span>●</span>
        <span>●</span>
      </div>

      <strong>DUO</strong>
      <small>2 PLAYERS</small>
    </button>


    <button
      className={`lobby-mode-card ${
        selectedMode === "squad" ? "active" : ""
      }`}
      onClick={() => setSelectedMode("squad")}
    >
      <div className="mode-players mode-squad">
        <span>●</span>
        <span>●</span>
        <span>●</span>
        <span>●</span>
      </div>

      <strong>SQUAD</strong>
      <small>4 PLAYERS</small>
    </button>

  </div>

</div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] =
    useState("loading");

    const [matchmakingTime, setMatchmakingTime] = useState(null);
    const [matchmakingTotal, setMatchmakingTotal] = useState(null);

  const goToStart = () => {
    setScreen("start");
  };

  const goToLobby = () => {
    setScreen("lobby");
  };

  const startMatchmaking = () => {
    const randomTime =
    Math.floor(Math.random() * 51) + 10;

   setMatchmakingTotal(randomTime);
   setMatchmakingTime(randomTime);
  };


  const cancelMatchmaking = () => {
  setMatchmakingTime(null);
  setMatchmakingTotal(null);
};


useEffect(() => {
  if (matchmakingTime === null) return;

  const timer = setInterval(() => {
    setMatchmakingTime((current) => {
      if (current === null) {
        return current;
      }

      if (current <= 1) {
        clearInterval(timer);

        setTimeout(() => {
          setMatchmakingTime(null);
          setMatchmakingTotal(null);
          setScreen("waiting");
        }, 400);

        return 0;
      }

      return current - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [matchmakingTime]);


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
          matchmakingTime={matchmakingTime}
          matchmakingTotal={matchmakingTotal}
          onCancelMatchmaking={cancelMatchmaking}
        />
      )}


    {screen === "matchmaking" && (
  <div className="matchmaking-screen">

    <div className="matchmaking-content">

      <div className="matchmaking-label">
        BATTLE RUSH
      </div>

      <div className="matchmaking-title">
        MATCH FOUND
      </div>

      <div className="matchmaking-subtitle">
        PREPARING BATTLEFIELD
      </div>

      <div className="matchmaking-timer">
        <span>
          {matchmakingTime}
        </span>
        <small>SEC</small>
      </div>

      <div className="matchmaking-progress">
        <div
          className="matchmaking-progress-fill"
          style={{
            width: `${
              matchmakingTotal
                ? ((matchmakingTotal - matchmakingTime) /
                    matchmakingTotal) *
                  100
                : 0
            }%`,
          }}
        />
      </div>

      <button
        className="matchmaking-cancel"
        onClick={cancelMatchmaking}
      >
        CANCEL
      </button>

    </div>

  </div>
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