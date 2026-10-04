import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

import BattleIsland from "./game/world/BattleIsland";
import KaiController from "./game/player/KaiController";
import KaiCharacter from "./game/player/KaiCharacter";
import InventoryHUD from "./game/ui/InventoryHUD";
import WaitingArena from "./game/lobby/WaitingArena";
import { useSyncExternalStore } from "react";

import "./App.css";
import {
  subscribeInventory,
  getInventorySnapshot,
  buyClothing,
  isClothingOwned,
  equipClothing,
  isClothingEquipped
} from "./game/systems/playerInventory";

import { CLOTHING_ITEMS } from "./game/player/clothingData";

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
  const [lobbyPage, setLobbyPage] = useState(null);
  const [selectedInventoryClothing, setSelectedInventoryClothing] =useState("kai_standard");
  const inventory = useSyncExternalStore(
  subscribeInventory,
  getInventorySnapshot,
  getInventorySnapshot,
  
);

const rubyBalance = inventory.currency.ruby;
const urbanRushOwned = isClothingOwned("urban_rush");
const urbanRushEquipped = isClothingEquipped("urban_rush");
const selectedInventoryItem =
  CLOTHING_ITEMS[selectedInventoryClothing] ||
  CLOTHING_ITEMS.kai_standard;
const equippedClothing =
  CLOTHING_ITEMS[inventory.equipped.clothing] ||
  CLOTHING_ITEMS.kai_standard;

const [weaponCategory, setWeaponCategory] =useState("RIFLE");

const [selectedWeapon, setSelectedWeapon] =useState("BR-01");

const [chatMessage, setChatMessage] = useState("");
const [chatMessages, setChatMessages] = useState([
  { name: "RAVEN_07", text: "Anyone up for squad?", own: false },
  { name: "KINGBR", text: "Looking for 2 players.", own: false },
  { name: "MASON_X", text: "Let's play ranked.", own: false },
  { name: "KAI", text: "BR lobby ready 🔥", own: true },
]);

const weaponCategories = [
  "RIFLE",
  "MARKSMAN",
  "MACHINE GUN",
  "SMG",
  "SHOTGUN",
  "SNIPER",
  "PISTOL",
];

const weaponData = {
  RIFLE: [
    {
      name: "BR-01",
      type: "ASSAULT RIFLE",
      damage: 25,
      fire: 82,
      range: 78,
      accuracy: 72,
      magazine: 30,
    },
    {
      name: "BR-02",
      type: "ASSAULT RIFLE",
      damage: 29,
      fire: 76,
      range: 82,
      accuracy: 80,
      magazine: 30,
    },
    {
      name: "BR-04",
      type: "ASSAULT RIFLE",
      damage: 23,
      fire: 91,
      range: 70,
      accuracy: 68,
      magazine: 35,
    },
  ],

  MARKSMAN: [
    {
      name: "MR-01",
      type: "MARKSMAN RIFLE",
      damage: 54,
      fire: 48,
      range: 91,
      accuracy: 89,
      magazine: 12,
    },
    {
      name: "MR-02",
      type: "MARKSMAN RIFLE",
      damage: 61,
      fire: 42,
      range: 95,
      accuracy: 93,
      magazine: 10,
    },
  ],

  "MACHINE GUN": [
    {
      name: "MG-01",
      type: "MACHINE GUN",
      damage: 22,
      fire: 96,
      range: 62,
      accuracy: 58,
      magazine: 60,
    },
  ],

  SMG: [
    {
      name: "SMG-01",
      type: "SUB MACHINE GUN",
      damage: 19,
      fire: 98,
      range: 52,
      accuracy: 64,
      magazine: 35,
    },
    {
      name: "SMG-02",
      type: "SUB MACHINE GUN",
      damage: 24,
      fire: 88,
      range: 58,
      accuracy: 71,
      magazine: 30,
    },
  ],

  SHOTGUN: [
    {
      name: "SG-01",
      type: "SHOTGUN",
      damage: 86,
      fire: 38,
      range: 32,
      accuracy: 48,
      magazine: 6,
    },
  ],

  SNIPER: [
    {
      name: "SR-01",
      type: "SNIPER RIFLE",
      damage: 96,
      fire: 25,
      range: 100,
      accuracy: 98,
      magazine: 5,
    },
  ],

  PISTOL: [
    {
      name: "P-01",
      type: "PISTOL",
      damage: 31,
      fire: 70,
      range: 45,
      accuracy: 76,
      magazine: 15,
    },
    {
      name: "P-02",
      type: "PISTOL",
      damage: 38,
      fire: 55,
      range: 51,
      accuracy: 83,
      magazine: 12,
    },
  ],
};

const activeWeapons =
  weaponData[weaponCategory];

const activeWeapon =
  activeWeapons.find(
    (weapon) => weapon.name === selectedWeapon
  ) || activeWeapons[0];

  return (
    <div className="lobby-screen">
      <div className="lobby-world">
        <LobbyWorld />
      </div>

      <div className="lobby-overlay" />
      
      {lobbyPage === "weapons" && (
  <div className="armory-screen">

    <button
      className="armory-back"
      onClick={() => setLobbyPage(null)}
    >
      ← BACK
    </button>

    <div className="armory-title">
      <span>ARSENAL</span>
      <h1>WEAPON COLLECTION</h1>
    </div>

    <div className="armory-layout">

      {/* LEFT — CATEGORIES */}
      <aside className="armory-categories">

        <div className="armory-section-label">
          WEAPONS
        </div>

        {weaponCategories.map((category) => (
          <button
            key={category}
            className={
              weaponCategory === category
                ? "armory-category active"
                : "armory-category"
            }
            onClick={() => {
              setWeaponCategory(category);
              setSelectedWeapon(
                weaponData[category][0].name
              );
            }}
          >
            <span className="armory-category-icon">
              ◆
            </span>

            <span>{category}</span>

            {weaponCategory === category && (
              <b>›</b>
            )}
          </button>
        ))}

      </aside>


      {/* SECOND COLUMN — GUN COLLECTION */}
      <section className="armory-list">

        <div className="armory-list-header">
          <span>{weaponCategory}</span>
          <small>
            {activeWeapons.length} WEAPONS
          </small>
        </div>

        <div className="armory-weapon-list">

          {activeWeapons.map((weapon) => (
            <button
              key={weapon.name}
              className={
                selectedWeapon === weapon.name
                  ? "armory-weapon-card active"
                  : "armory-weapon-card"
              }
              onClick={() =>
                setSelectedWeapon(weapon.name)
              }
            >

              <div className="mini-gun">
                <div className="mini-gun-body" />
                <div className="mini-gun-barrel" />
                <div className="mini-gun-stock" />
              </div>

              <div>
                <strong>{weapon.name}</strong>
                <small>{weapon.type}</small>
              </div>

            </button>
          ))}

        </div>

      </section>


      {/* MAIN WEAPON PREVIEW */}
      <section className="armory-preview">

        <div className="armory-preview-top">
          <span>
            {activeWeapon.type}
          </span>

          <strong>
            {selectedWeapon}
          </strong>
        </div>


        <div className="big-gun-stage">

          <div className="big-gun">

            <div className="big-gun-stock" />
            <div className="big-gun-body">
              <span>
                {selectedWeapon}
              </span>
            </div>
            <div className="big-gun-mag" />
            <div className="big-gun-grip" />
            <div className="big-gun-barrel" />

          </div>

        </div>


        <div className="weapon-description">
          STANDARD ISSUE BATTLE RUSH WEAPON
        </div>


        {/* STATS */}
        <div className="weapon-stats">

          <div className="weapon-stat-row">
            <span>DAMAGE</span>

            <div className="stat-track">
              <i
                style={{
                  width: `${activeWeapon.damage}%`,
                }}
              />
            </div>

            <b>{activeWeapon.damage}</b>
          </div>


          <div className="weapon-stat-row">
            <span>FIRE RATE</span>

            <div className="stat-track">
              <i
                style={{
                  width: `${activeWeapon.fire}%`,
                }}
              />
            </div>

            <b>{activeWeapon.fire}</b>
          </div>


          <div className="weapon-stat-row">
            <span>RANGE</span>

            <div className="stat-track">
              <i
                style={{
                  width: `${activeWeapon.range}%`,
                }}
              />
            </div>

            <b>{activeWeapon.range}</b>
          </div>


          <div className="weapon-stat-row">
            <span>ACCURACY</span>

            <div className="stat-track">
              <i
                style={{
                  width: `${activeWeapon.accuracy}%`,
                }}
              />
            </div>

            <b>{activeWeapon.accuracy}</b>
          </div>

        </div>


        {/* BOTTOM SKINS */}
        <div className="weapon-skins">

          <div className="weapon-skins-title">
            COLLECTION
          </div>

          <div className="weapon-skin-list">

            <button className="weapon-skin active">
              <span>DEFAULT</span>
            </button>

            <button className="weapon-skin">
              <span>ONYX</span>
            </button>

            <button className="weapon-skin locked">
              <span>LOCKED</span>
            </button>

            <button className="weapon-skin locked">
              <span>LOCKED</span>
            </button>

          </div>

        </div>


        <button className="weapon-equip-main">
          ✓ EQUIPPED
        </button>

      </section>

    </div>

  </div>
)}


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

  
<div className="lobby-side-menu">

  <button onClick={() => setLobbyPage("events")}>
    <b>⚡</b>
    <span>EVENTS</span>
  </button>

  <button onClick={() => setLobbyPage("store")}>
     <b>◈</b>
     <span>STORE</span>
  </button>

  <button>
    <b>◆</b>
    <span>ROYALE</span>
  </button>

  <button onClick={() => setLobbyPage("rank")}>
    <b>★</b>
    <span>RANK</span>
  </button>

  <button onClick={() => setLobbyPage("missions")}>
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
        <div className="lobby-currency-bar">
      <div className="lobby-currency">
        <span className="currency-icon gold-icon">●</span>
        <strong>1,000</strong>
      </div>

      <button
         className="lobby-currency ruby-currency-button"
         onClick={() => setLobbyPage("topup")}
      >
        <span className="currency-icon ruby-icon">◆</span>
        <strong>{rubyBalance.toLocaleString()}</strong>
      </button>

  <button className="lobby-top-icon" onClick={() => setLobbyPage("chat")}>
     ✉
  </button>
  <button className="lobby-top-icon">♟</button>
  <button className="lobby-top-icon">⚙</button>
</div>
        <div>
          <div className="lobby-logo-small">
            BR
          </div>
        </div>

  <div
  className="player-profile"
  onClick={() => setLobbyPage("profile")}
>
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

       <button onClick={() => setLobbyPage("character")}>CHARACTER</button>
        <button onClick={() => setLobbyPage("weapons")}> WEAPONS</button>
        <button onClick={() => setLobbyPage("inventory")}>INVENTORY</button>
        <button onClick={() => setLobbyPage("royale")}>ROYALE</button>

      </div>

      {lobbyPage === "profile" && (
  <div className="profile-screen">

    <button
      className="profile-page-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <aside className="profile-sidebar">

      <div className="profile-sidebar-title">
        PROFILE
      </div>

      <button className="profile-tab active">
        OVERVIEW
      </button>

      <button className="profile-tab">
        GALLERY
      </button>

      <button className="profile-tab">
        HISTORY
      </button>

      <button className="profile-tab">
        BATTLE STATS
      </button>

      <button className="profile-tab">
        ACHIEVEMENTS
      </button>

    </aside>


    <main className="profile-character-area">

      <div className="profile-character-label">
        BATTLE RUSH
      </div>

      <div className="profile-character-name">
        KAI
      </div>

      <div className="profile-character-role">
        ASSAULT • SURVIVOR
      </div>

      <div className="profile-character-3d">

        <Canvas
          shadows
          camera={{
            position: [0, 1.25, 7.2],
            fov: 42,
          }}
          dpr={[1, 1.5]}
        >

          <hemisphereLight
            intensity={1.7}
            groundColor="#101812"
            skyColor="#dfffea"
          />

          <directionalLight
            position={[4, 7, 5]}
            intensity={2.8}
            castShadow
          />

          <directionalLight
            position={[-4, 3, 2]}
            intensity={1.1}
          />

          <ambientLight intensity={0.3} />

          <KaiCharacter
            position={[0, -0.65, 0]}
            rotation={[0, Math.PI, 0]}
          />

        </Canvas>

      </div>

    </main>


    <aside className="profile-info-panel">

      <div className="profile-brand">
        BATTLE RUSH
      </div>

      <div className="profile-user-header">

        <div className="profile-big-avatar">
          K
        </div>

        <div>
          <strong>KAI</strong>
          <span>LV. 1</span>
          <small>PLAYER</small>
        </div>

      </div>

      <div className="profile-id-row">
        UID: 100000001
      </div>

      <div className="profile-like-row">
        ♥ 0 LIKES
      </div>


      <div className="profile-section-title">
        RANKED
      </div>

      <div className="profile-rank-tabs">

        <button className="active">
          BR RANKED
        </button>

        <button>
          CLASH SQUAD
        </button>

      </div>


      <div className="profile-rank-card">

        <div className="profile-rank-icon">
          ★
        </div>

        <div>
          <span>SEASON ZERO</span>
          <strong>BRONZE I</strong>
          <small>BATTLE ROYALE</small>
        </div>

      </div>


      <div className="profile-stats">

        <div>
          <strong>0</strong>
          <span>MATCHES</span>
        </div>

        <div>
          <strong>0</strong>
          <span>BOOYAH</span>
        </div>

        <div>
          <strong>0</strong>
          <span>KILLS</span>
        </div>

        <div>
          <strong>0.0</strong>
          <span>K/D</span>
        </div>

      </div>


      <div className="profile-section-title">
        BATTLE STYLE
      </div>

      <div className="profile-tags">

        <span>RUSHER</span>
        <span>SURVIVOR</span>

      </div>


      <div className="profile-section-title">
        SOCIAL STYLE
      </div>

      <div className="profile-tags social">

        <span>JUST FOR FUN</span>
        <span>TEAM PLAYER</span>

      </div>


      <div className="profile-bio">
        FIGHT • LOOT • SURVIVE
      </div>

    </aside>

  </div>
)}

{lobbyPage === "character" && (

  <div className="character-page">

    {/* CLOSE */}
    <button
      className="character-page-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>


    {/* LEFT NAVIGATION */}
    <aside className="character-page-nav">

      <button className="character-nav-item active">
        <span>◈</span>
        CHARACTER
      </button>

      <button className="character-nav-item">
        <span>◆</span>
        LEVEL UP
      </button>

    </aside>


    {/* MAIN CHARACTER AREA */}
    <main className="character-page-main">

      {/* CHARACTER PREVIEW */}
      <section className="character-showcase">

        <div className="character-showcase-label">
          DEFAULT HERO
        </div>

        <div className="character-showcase-name">
          KAI
        </div>

        <div className="character-showcase-role">
          ASSAULT • SURVIVOR
        </div>


        <div className="character-3d-container">

          <Canvas
            shadows
            camera={{
              position: [0, 1.25, 7.2],
              fov: 42,
            }}
            dpr={[1, 1.5]}
          >

            <hemisphereLight
              intensity={1.7}
              groundColor="#101812"
              skyColor="#dfffea"
            />

            <directionalLight
              position={[4, 7, 5]}
              intensity={2.8}
              castShadow
            />

            <directionalLight
              position={[-4, 3, 2]}
              intensity={1.1}
            />

            <ambientLight intensity={0.3} />

            <KaiCharacter
              position={[0, -0.65, 0]}
              rotation={[0, Math.PI, 0]}
            />

            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.08, 0]}
            >
              <circleGeometry args={[1.65, 48]} />

              <meshStandardMaterial
                color="#101611"
                roughness={1}
              />
            </mesh>

          </Canvas>

        </div>


        {/* CHARACTER NAME PLATE */}
        <div className="character-name-plate">
          <strong>KAI</strong>
          <span>LEVEL 1</span>
        </div>

      </section>


      {/* RIGHT INFORMATION PANEL */}
      <section className="character-info-panel">

        <div className="character-info-header">

          <div>
            <span className="character-info-kicker">
              CHARACTER
            </span>

            <h1>KAI</h1>

            <p>
              ASSAULT • SURVIVOR
            </p>
          </div>

          <div className="character-status">
            ACTIVE
          </div>

        </div>


        {/* ABILITY */}
        <div className="character-ability">

          <div className="character-section-title">
            SPECIAL ABILITY
          </div>

          <div className="ability-card">

            <div className="ability-icon">
              ⚡
            </div>

            <div className="ability-info">

              <strong>
                RUSH CORE
              </strong>

              <span>
                ACTIVE ABILITY
              </span>

              <p>
                Temporarily increases movement speed
                during intense combat situations.
              </p>

            </div>

          </div>

        </div>


        {/* SKILL SLOTS */}
        <div className="character-skills">

          <div className="character-section-title">
            SKILL SLOTS
          </div>

          <div className="skill-slot-row">

            <div className="skill-slot active">
              <span>⚡</span>
              <small>ACTIVE</small>
            </div>

            <div className="skill-slot locked">
              <span>🔒</span>
              <small>LOCKED</small>
            </div>

            <div className="skill-slot locked">
              <span>🔒</span>
              <small>LOCKED</small>
            </div>

          </div>

        </div>


        {/* CHARACTER SET */}
        <div className="character-set">

          <div className="character-section-title">
            CHARACTER SET
          </div>

          <div className="character-set-card">

            <div className="character-set-preview">
              K
            </div>

            <div className="character-set-info">

              <strong>
                {equippedClothing.name}
              </strong>

              <span>
                {equippedClothing.type}
              </span>

              <button>
                ✓ {equippedClothing.name}
              </button>

            </div>

          </div>

        </div>


        {/* BOTTOM ACTIONS */}
        <div className="character-actions">

          <button
            className="character-change-button"
          >
            CHANGE
          </button>

          <button
             className="character-equip-button"
             onClick={() => {
           if (!urbanRushOwned) {
               alert("OUTFIT NOT OWNED");
            return;
            }

            const result = equipClothing("urban_rush");

            if (!result.success) {
            alert(result.message);
            return;
          }

    alert(result.message);
  }}
>
  {urbanRushEquipped ? "✓ EQUIPPED" : "EQUIP"}
</button>

        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "inventory" && (
  <div className="vault-screen">

    <button
      className="vault-back"
      onClick={() => setLobbyPage(null)}
    >
      ← BACK
    </button>

    <div className="vault-title">
      <span>COLLECTION</span>
      <h1>INVENTORY</h1>
    </div>

    <aside className="vault-categories">

      <div className="vault-category-label">
        VAULT
      </div>

      {[
        "FASHION",
        "EMOTE",
        "POSTURE",
        "SKILL",
        "COLLECTION",
        "VEHICLE",
        "PROFILE",
        "OTHERS",
      ].map((category, index) => (
        <button
          key={category}
          className={
            index === 0
              ? "vault-category active"
              : "vault-category"
          }
        >
          <span>◆</span>
          {category}
        </button>
      ))}

    </aside>

    <main className="vault-main">

      <div className="vault-header">
        <div>
          <span>FASHION</span>
          <h2>CHARACTER OUTFITS</h2>
        </div>

        <small>1 / 12 ITEMS</small>
      </div>

     <div className="vault-items">

  <button
    className={`vault-item ${
      selectedInventoryClothing === "kai_standard"
        ? "active"
        : ""
    }`}
    onClick={() => {
      setSelectedInventoryClothing("kai_standard");
    }}
  >
    <div className="vault-item-preview">
      K
    </div>

    <strong>KAI STANDARD</strong>

    <span>
      {isClothingEquipped("kai_standard")
        ? "EQUIPPED"
        : "OWNED"}
    </span>
  </button>


  <button
    className={`vault-item ${
      selectedInventoryClothing === "urban_rush"
        ? "active"
        : ""
    }`}
    onClick={() => {
      if (!urbanRushOwned) return;

      setSelectedInventoryClothing("urban_rush");
    }}
  >
    <div
      className={`vault-item-preview ${
        urbanRushOwned ? "" : "locked"
      }`}
    >
      {urbanRushOwned ? "K" : "🔒"}
    </div>

    <strong>URBAN RUSH</strong>

    <span>
      {isClothingEquipped("urban_rush")
        ? "EQUIPPED"
        : urbanRushOwned
          ? "OWNED"
          : "LOCKED"}
    </span>
  </button>


  <button className="vault-item">
    <div className="vault-item-preview locked">
      🔒
    </div>

    <strong>SHADOW OPS</strong>

    <span>LOCKED</span>
  </button>


  <button className="vault-item">
    <div className="vault-item-preview locked">
      🔒
    </div>

    <strong>DESERT STRIKE</strong>

    <span>LOCKED</span>
  </button>

</div>

      <section className="vault-preview">

        <div className="vault-preview-label">
          EQUIPPED OUTFIT
        </div>

        <div className="vault-big-character">
          KAI
        </div>

        <div className="vault-preview-name">

  <strong>
    {selectedInventoryItem.name}
  </strong>

  <span>
    {selectedInventoryItem.type}
  </span>

</div>


<button
  className="vault-equip"
  onClick={() => {
    if (!isClothingOwned(selectedInventoryClothing)) {
      alert("OUTFIT NOT OWNED");
      return;
    }

    const result = equipClothing(
      selectedInventoryClothing
    );

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(result.message);
  }}
>
  {isClothingEquipped(selectedInventoryClothing)
    ? "✓ EQUIPPED"
    : "EQUIP"}
</button>

      </section>

    </main>

  </div>
)}

{lobbyPage === "royale" && (
  <div className="royale-screen">

    {/* CLOSE */}
    <button
      className="royale-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    {/* TITLE */}
    <div className="royale-title">
      <span>BATTLE RUSH</span>
      <h1>ROYALE</h1>
    </div>


    {/* LEFT EVENT LIST */}
    <aside className="royale-events">

      <div className="royale-events-label">
        ROYALE
      </div>

      <button className="royale-event active">
        <span>◆</span>

        <div>
          <strong>GOLD ROYALE</strong>
          <small>CLASSIC REWARDS</small>
        </div>
      </button>

      <button className="royale-event">
        <span>◆</span>

        <div>
          <strong>DIAMOND ROYALE</strong>
          <small>PREMIUM REWARDS</small>
        </div>
      </button>

      <button className="royale-event">
        <span>◆</span>

        <div>
          <strong>WEAPON ROYALE</strong>
          <small>WEAPON SKINS</small>
        </div>
      </button>

      <button className="royale-event">
        <span>◆</span>

        <div>
          <strong>EVENT ROYALE</strong>
          <small>LIMITED TIME</small>
        </div>
      </button>

    </aside>


    {/* MAIN ROYALE */}
    <main className="royale-main">

      <div className="royale-hero">

        <div className="royale-hero-kicker">
          GOLD ROYALE
        </div>

        <h2>
          RUSH<br />
          REWARDS
        </h2>

        <p>
          Spin the Royale and collect
          exclusive Battle Rush rewards.
        </p>

        <div className="royale-wheel">

          <div className="royale-wheel-center">
            BR
          </div>

          <div className="royale-reward reward-1">
            100
          </div>

          <div className="royale-reward reward-2">
            K
          </div>

          <div className="royale-reward reward-3">
            +
          </div>

          <div className="royale-reward reward-4">
            ★
          </div>

          <div className="royale-reward reward-5">
            500
          </div>

          <div className="royale-reward reward-6">
            ◆
          </div>

        </div>

      </div>


      {/* REWARD PREVIEW */}
      <section className="royale-rewards">

        <div className="royale-section-title">
          FEATURED REWARDS
        </div>

        <div className="royale-reward-grid">

          <div className="royale-reward-card">
            <div>100</div>
            <span>GOLD</span>
          </div>

          <div className="royale-reward-card">
            <div>◆</div>
            <span>DIAMOND</span>
          </div>

          <div className="royale-reward-card">
            <div>BR</div>
            <span>BADGE</span>
          </div>

          <div className="royale-reward-card locked">
            <div>🔒</div>
            <span>RARE ITEM</span>
          </div>

        </div>

      </section>


      {/* SPIN AREA */}
      <section className="royale-spin">

        <div className="royale-cost">
          <span>COST</span>
          <strong>100 GOLD</strong>
        </div>

        <div className="royale-spin-buttons">

          <button className="royale-spin-single">
            SPIN ×1
          </button>

          <button className="royale-spin-ten">
            SPIN ×10
          </button>

        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "rank" && (
  <div className="rank-screen">

    <button
      className="rank-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="rank-title">
      <span>BATTLE RUSH</span>
      <h1>RANK</h1>
    </div>

    {/* LEFT RANK NAVIGATION */}
    <aside className="rank-sidebar">

      <div className="rank-sidebar-label">
        RANKED MODES
      </div>

      <button className="rank-mode active">
        <span>◆</span>
        <div>
          <strong>BR-RANKED</strong>
          <small>BATTLE ROYALE</small>
        </div>
      </button>

      <button className="rank-mode">
        <span>◆</span>
        <div>
          <strong>CS-RANKED</strong>
          <small>CLASH SQUAD</small>
        </div>
      </button>

      <div className="rank-sidebar-label rank-season-label">
        SEASON
      </div>

      <div className="rank-season-card">
        <strong>SEASON ZERO</strong>
        <span>RANKED SEASON</span>
        <b>DAY 18 / 60</b>
      </div>

    </aside>

    {/* MAIN RANK AREA */}
    <main className="rank-main">

      {/* CURRENT RANK */}
      <section className="rank-overview">

        <div className="rank-badge-large">
          ★
        </div>

        <div className="rank-overview-info">

          <span className="rank-kicker">
            CURRENT RANK
          </span>

          <h2>
            BRONZE I
          </h2>

          <p>
            BATTLE ROYALE RANK
          </p>

          <div className="rank-points">
            <strong>128</strong>
            <span>RANK POINTS</span>
          </div>

          <div className="rank-progress">

            <div className="rank-progress-top">
              <span>128 / 200</span>
              <small>BRONZE II</small>
            </div>

            <div className="rank-progress-track">
              <i style={{ width: "64%" }} />
            </div>

          </div>

        </div>

        <div className="rank-season-info">
          <span>SEASON ZERO</span>
          <strong>18 DAYS</strong>
          <small>REMAINING</small>
        </div>

      </section>

      {/* STATS */}
      <section className="rank-stats">

        <div className="rank-section-heading">
          <span>PERFORMANCE</span>
          <h2>MATCH STATISTICS</h2>
        </div>

        <div className="rank-stat-grid">

          <div className="rank-stat-card">
            <span>MATCHES</span>
            <strong>24</strong>
          </div>

          <div className="rank-stat-card">
            <span>WINS</span>
            <strong>4</strong>
          </div>

          <div className="rank-stat-card">
            <span>KILLS</span>
            <strong>61</strong>
          </div>

          <div className="rank-stat-card">
            <span>TOP 10</span>
            <strong>12</strong>
          </div>

          <div className="rank-stat-card">
            <span>K/D</span>
            <strong>2.54</strong>
          </div>

        </div>

      </section>

      {/* RECENT MATCHES */}
      <section className="rank-history">

        <div className="rank-section-heading">
          <span>BATTLE HISTORY</span>
          <h2>RECENT MATCHES</h2>
        </div>

        <div className="rank-match-list">

          <div className="rank-match-row">
            <div className="rank-match-result win">
              #3
            </div>

            <div className="rank-match-map">
              <strong>RUSH ISLAND</strong>
              <span>SOLO • 24 PLAYERS</span>
            </div>

            <div className="rank-match-kills">
              <span>KILLS</span>
              <strong>6</strong>
            </div>

            <div className="rank-match-points positive">
              +24 RP
            </div>
          </div>

          <div className="rank-match-row">
            <div className="rank-match-result win">
              #7
            </div>

            <div className="rank-match-map">
              <strong>RUSH ISLAND</strong>
              <span>DUO • 48 PLAYERS</span>
            </div>

            <div className="rank-match-kills">
              <span>KILLS</span>
              <strong>4</strong>
            </div>

            <div className="rank-match-points positive">
              +16 RP
            </div>
          </div>

          <div className="rank-match-row">
            <div className="rank-match-result loss">
              #18
            </div>

            <div className="rank-match-map">
              <strong>RUSH ISLAND</strong>
              <span>SQUAD • 48 PLAYERS</span>
            </div>

            <div className="rank-match-kills">
              <span>KILLS</span>
              <strong>2</strong>
            </div>

            <div className="rank-match-points negative">
              -8 RP
            </div>
          </div>

        </div>

      </section>

      {/* REWARDS */}
      <section className="rank-rewards">

        <div className="rank-section-heading">
          <span>SEASON ZERO</span>
          <h2>RANK REWARDS</h2>
        </div>

        <div className="rank-reward-grid">

          <div className="rank-reward-card">
            <div>◆</div>
            <strong>500 GOLD</strong>
            <span>BRONZE I</span>
          </div>

          <div className="rank-reward-card">
            <div>★</div>
            <strong>RANK BADGE</strong>
            <span>BRONZE II</span>
          </div>

          <div className="rank-reward-card locked">
            <div>🔒</div>
            <strong>EXCLUSIVE SKIN</strong>
            <span>SILVER I</span>
          </div>

          <div className="rank-reward-card locked">
            <div>🔒</div>
            <strong>SEASON REWARD</strong>
            <span>GOLD I</span>
          </div>

        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "store" && (
  <div className="store-screen">

    <button
      className="store-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="store-title">
      <span>BATTLE RUSH</span>
      <h1>STORE</h1>
    </div>

    <aside className="store-sidebar">

      <div className="store-sidebar-label">
        STORE
      </div>

      <button className="store-category active">
        <span>◆</span>
        <div>
          <strong>HIGHLIGHT</strong>
          <small>FEATURED ITEMS</small>
        </div>
      </button>

      <button className="store-category">
        <span>◆</span>
        <div>
          <strong>DAILY SPECIAL</strong>
          <small>LIMITED OFFERS</small>
        </div>
      </button>

      <button className="store-category">
        <span>◆</span>
        <div>
          <strong>FASHION</strong>
          <small>CHARACTER ITEMS</small>
        </div>
      </button>

      <button className="store-category">
        <span>◆</span>
        <div>
          <strong>COLLECTION</strong>
          <small>ACCESSORIES</small>
        </div>
      </button>

      <button className="store-category">
        <span>◆</span>
        <div>
          <strong>WEAPON</strong>
          <small>WEAPON SKINS</small>
        </div>
      </button>

      <button className="store-category">
        <span>◆</span>
        <div>
          <strong>ITEM</strong>
          <small>GAME ITEMS</small>
        </div>
      </button>

    </aside>

    <main className="store-main">

      <section className="store-feature">

        <div className="store-feature-info">
          <span>FEATURED DROP</span>

          <h2>URBAN<br />RUSH</h2>

          <p>
            Upgrade KAI with the latest Battle Rush
            collection.
          </p>

          <div className="store-price">
            <span>◆</span>
            <strong>800</strong>
          </div>

          <button
            className="store-buy"
            onClick={() => {
           const result = buyClothing("urban_rush");

          if (!result.success) {
            alert(result.message);
            return;
          }

          alert(result.message);
  }}
>
  {urbanRushOwned ? "OWNED" : "BUY NOW"}
</button>
        </div>

        <div className="store-character-preview">
          <div className="store-character-glow">
            K
          </div>
        </div>

      </section>

      <section className="store-products">

        <div className="store-section-heading">
          <span>SHOP</span>
          <h2>FEATURED ITEMS</h2>
        </div>

        <div className="store-product-grid">

          <div className="store-product active">

            <div className="store-product-image">
              K
            </div>

            <strong>URBAN RUSH</strong>

            <span>OUTFIT</span>

            <div className="store-product-price">
              ◆ 800
            </div>

            {urbanRushOwned && (
             <small className="store-owned-label">
               OWNED
             </small>
           )}

          </div>

          <div className="store-product">

            <div className="store-product-image">
              🔫
            </div>

            <strong>BR-01 ONYX</strong>

            <span>WEAPON SKIN</span>

            <div className="store-product-price">
              ◆ 450
            </div>

          </div>

          <div className="store-product">

            <div className="store-product-image">
              🎒
            </div>

            <strong>RUSH PACK</strong>

            <span>BACKPACK</span>

            <div className="store-product-price">
              ● 1200
            </div>

          </div>

          <div className="store-product">

            <div className="store-product-image">
              ★
            </div>

            <strong>RUSH BADGE</strong>

            <span>PROFILE ITEM</span>

            <div className="store-product-price">
              ● 600
            </div>

          </div>

        </div>

      </section>

      <section className="store-daily">

        <div>
          <span>DAILY SPECIAL</span>
          <strong>NEW ITEMS EVERY DAY</strong>
        </div>

        <div className="store-countdown">
          RESET IN <b>23:41:08</b>
        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "events" && (
  <div className="events-screen">

    <button
      className="events-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="events-title">
      <span>SEASON ZERO</span>
      <h1>EVENTS</h1>
    </div>

    <aside className="events-sidebar">

      <div className="events-sidebar-label">
        LIVE NOW
      </div>

      <button className="events-tab active">
        <span>⚡</span>
        <div>
          <strong>SEASON ZERO</strong>
          <small>MAIN EVENT</small>
        </div>
      </button>

      <button className="events-tab">
        <span>◆</span>
        <div>
          <strong>FIRST DROP</strong>
          <small>DAILY EVENT</small>
        </div>
      </button>

      <button className="events-tab">
        <span>★</span>
        <div>
          <strong>RUSH CHALLENGE</strong>
          <small>MISSIONS</small>
        </div>
      </button>

    </aside>

    <main className="events-main">

      <section className="event-hero">

        <div className="event-hero-info">

          <span>LIVE EVENT</span>

          <h2>
            SEASON<br />
            ZERO
          </h2>

          <p>
            Complete missions, earn rewards and
            unlock exclusive Battle Rush items.
          </p>

          <div className="event-time">
            <span>EVENT ENDS IN</span>
            <strong>18 DAYS</strong>
          </div>

          <button className="event-action">
            VIEW REWARDS
          </button>

        </div>

        <div className="event-hero-emblem">
          BR
        </div>

      </section>

      <section className="event-progress-section">

        <div className="events-section-heading">
          <span>YOUR PROGRESS</span>
          <h2>SEASON MILESTONES</h2>
        </div>

        <div className="event-progress-card">

          <div className="event-progress-info">
            <strong>12 / 30</strong>
            <span>MISSIONS COMPLETED</span>
          </div>

          <div className="event-progress-track">
            <i style={{ width: "40%" }} />
          </div>

          <small>
            Complete 18 more missions to unlock the
            next reward.
          </small>

        </div>

      </section>

      <section className="event-rewards-section">

        <div className="events-section-heading">
          <span>SEASON ZERO</span>
          <h2>EVENT REWARDS</h2>
        </div>

        <div className="event-reward-grid">

          <div className="event-reward-card">
            <div>●</div>
            <strong>1,000 GOLD</strong>
            <span>UNLOCKED</span>
          </div>

          <div className="event-reward-card">
            <div>◆</div>
            <strong>100 DIAMONDS</strong>
            <span>15 MISSIONS</span>
          </div>

          <div className="event-reward-card">
            <div>★</div>
            <strong>RUSH BADGE</strong>
            <span>20 MISSIONS</span>
          </div>

          <div className="event-reward-card locked">
            <div>🔒</div>
            <strong>SEASON SKIN</strong>
            <span>30 MISSIONS</span>
          </div>

        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "missions" && (
  <div className="missions-screen">

    <button
      className="missions-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="missions-title">
      <span>BATTLE RUSH</span>
      <h1>MISSIONS</h1>
    </div>

    <aside className="missions-sidebar">

      <div className="missions-sidebar-label">
        OBJECTIVES
      </div>

      <button className="mission-tab active">
        <span>◆</span>
        <div>
          <strong>DAILY</strong>
          <small>RESET EVERY DAY</small>
        </div>
      </button>

      <button className="mission-tab">
        <span>★</span>
        <div>
          <strong>WEEKLY</strong>
          <small>SEASON PROGRESS</small>
        </div>
      </button>

      <button className="mission-tab">
        <span>⚡</span>
        <div>
          <strong>CHALLENGES</strong>
          <small>SPECIAL OBJECTIVES</small>
        </div>
      </button>

      <div className="missions-reset">
        <span>DAILY RESET</span>
        <strong>11:42:08</strong>
      </div>

    </aside>

    <main className="missions-main">

      <section className="missions-overview">

        <div>
          <span>DAILY MISSIONS</span>
          <h2>COMPLETE & EARN</h2>
          <p>
            Complete missions during your matches
            to earn Battle Rush rewards.
          </p>
        </div>

        <div className="missions-total">
          <strong>2 / 6</strong>
          <span>COMPLETED</span>
        </div>

      </section>

      <section className="missions-list">

        <div className="missions-section-heading">
          <span>TODAY</span>
          <h2>DAILY OBJECTIVES</h2>
        </div>

        <div className="mission-card">

          <div className="mission-icon">⚔</div>

          <div className="mission-info">
            <strong>GET 5 ELIMINATIONS</strong>
            <span>ELIMINATE 5 ENEMY PLAYERS</span>

            <div className="mission-progress">
              <i style={{ width: "60%" }} />
            </div>

            <small>3 / 5</small>
          </div>

          <div className="mission-reward">
            <span>REWARD</span>
            <strong>500 GOLD</strong>
          </div>

          <button className="mission-claim disabled">
            IN PROGRESS
          </button>

        </div>

        <div className="mission-card">

          <div className="mission-icon">🏃</div>

          <div className="mission-info">
            <strong>TRAVEL 2 KM</strong>
            <span>MOVE A TOTAL OF 2 KM</span>

            <div className="mission-progress">
              <i style={{ width: "100%" }} />
            </div>

            <small>2 / 2</small>
          </div>

          <div className="mission-reward">
            <span>REWARD</span>
            <strong>300 GOLD</strong>
          </div>

          <button className="mission-claim">
            CLAIM
          </button>

        </div>

        <div className="mission-card">

          <div className="mission-icon">🎯</div>

          <div className="mission-info">
            <strong>DEAL 1000 DAMAGE</strong>
            <span>DEAL DAMAGE TO ENEMIES</span>

            <div className="mission-progress">
              <i style={{ width: "45%" }} />
            </div>

            <small>450 / 1000</small>
          </div>

          <div className="mission-reward">
            <span>REWARD</span>
            <strong>750 GOLD</strong>
          </div>

          <button className="mission-claim disabled">
            IN PROGRESS
          </button>

        </div>

        <div className="mission-card">

          <div className="mission-icon">🏆</div>

          <div className="mission-info">
            <strong>FINISH TOP 10</strong>
            <span>PLACE IN THE TOP 10</span>

            <div className="mission-progress">
              <i style={{ width: "100%" }} />
            </div>

            <small>1 / 1</small>
          </div>

          <div className="mission-reward">
            <span>REWARD</span>
            <strong>50 DIAMONDS</strong>
          </div>

          <button className="mission-claim">
            CLAIM
          </button>

        </div>

      </section>

      <section className="missions-weekly">

        <div className="missions-section-heading">
          <span>SEASON ZERO</span>
          <h2>WEEKLY PROGRESS</h2>
        </div>

        <div className="weekly-progress-card">

          <div className="weekly-progress-number">
            <strong>8 / 20</strong>
            <span>MISSIONS</span>
          </div>

          <div className="weekly-progress-track">
            <i style={{ width: "40%" }} />
          </div>

          <div className="weekly-reward">
            <span>NEXT REWARD</span>
            <strong>1,500 GOLD</strong>
          </div>

        </div>

      </section>

    </main>

  </div>
)}

{lobbyPage === "chat" && (
  <div className="chat-screen">

    <button
      className="chat-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="chat-title">
      <span>BATTLE RUSH</span>
      <h1>CHAT</h1>
    </div>

    <aside className="chat-sidebar">

      <div className="chat-sidebar-label">
        CHANNELS
      </div>

      <button className="chat-channel active">
        <span>🌍</span>
        <div>
          <strong>WORLD</strong>
          <small>GLOBAL CHAT</small>
        </div>
      </button>

      <button className="chat-channel">
        <span>👥</span>
        <div>
          <strong>RECRUIT</strong>
          <small>FIND PLAYERS</small>
        </div>
      </button>

      <button className="chat-channel">
        <span>◆</span>
        <div>
          <strong>BUILD</strong>
          <small>MAP CREATORS</small>
        </div>
      </button>

      <button className="chat-channel">
        <span>♥</span>
        <div>
          <strong>FRIENDS</strong>
          <small>YOUR FRIENDS</small>
        </div>
      </button>

      <div className="chat-online">
        <span className="chat-online-dot" />
        128 PLAYERS ONLINE
      </div>

    </aside>

    <main className="chat-main">

      <div className="chat-header">
        <div>
          <span>CHANNEL</span>
          <h2>WORLD CHAT</h2>
        </div>

        <small>LIVE</small>
      </div>

      <div className="chat-messages">

        <div className="chat-messages">
  {chatMessages.map((msg, index) => (
    <div
      className={`chat-message ${msg.own ? "own" : ""}`}
      key={index}
    >
      <div className="chat-avatar">
        {msg.name.charAt(0)}
      </div>

      <div>
        <strong>{msg.name}</strong>
        <span>{msg.text}</span>
      </div>
    </div>
  ))}
</div>

      </div>

      <div className="chat-input-area">

        <input
  type="text"
  placeholder="Type a message..."
  value={chatMessage}
  onChange={(e) => setChatMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!chatMessage.trim()) return;

      setChatMessages((prev) => [
        ...prev,
        {
          name: "KAI",
          text: chatMessage.trim(),
          own: true,
        },
      ]);

      setChatMessage("");
    }
  }}
/>

<button
  onClick={() => {
    if (!chatMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        name: "KAI",
        text: chatMessage.trim(),
        own: true,
      },
    ]);

    setChatMessage("");
  }}
>
  SEND
</button>

      </div>

    </main>

  </div>
)}

{lobbyPage === "topup" && (
  <div className="topup-screen">

    <button
      className="topup-close"
      onClick={() => setLobbyPage(null)}
    >
      ×
    </button>

    <div className="topup-title">
      <span>BATTLE RUSH</span>
      <h1>TOP-UP</h1>
    </div>

    <aside className="topup-sidebar">

      <div className="topup-sidebar-label">
        PREMIUM
      </div>

      <button className="topup-tab active">
        <span>◆</span>
        <div>
          <strong>RUBIES</strong>
          <small>TOP-UP</small>
        </div>
      </button>

      <button className="topup-tab">
        <span>★</span>
        <div>
          <strong>MEMBERSHIP</strong>
          <small>PREMIUM BENEFITS</small>
        </div>
      </button>

    </aside>

    <main className="topup-main">

      <section className="topup-hero">

        <div>
          <span>PREMIUM CURRENCY</span>
          <h2>RUBIES</h2>

          <p>
            Use Rubies to unlock premium
            Battle Rush content and rewards.
          </p>
        </div>

        <div className="topup-ruby-big">
          ◆
        </div>

      </section>

      <section className="topup-packages">

        <div className="topup-section-heading">
          <span>SELECT PACKAGE</span>
          <h2>RUBY PACKAGES</h2>
        </div>

        <div className="topup-package-grid">

          <button className="topup-package">
            <span className="topup-package-ruby">◆</span>
            <strong>100</strong>
            <small>RUBIES</small>
            <b>₹ 99</b>
          </button>

          <button className="topup-package active">
            <span className="topup-package-ruby">◆</span>
            <strong>310</strong>
            <small>RUBIES</small>
            <b>₹ 249</b>
            <em>POPULAR</em>
          </button>

          <button className="topup-package">
            <span className="topup-package-ruby">◆</span>
            <strong>520</strong>
            <small>RUBIES</small>
            <b>₹ 399</b>
          </button>

          <button className="topup-package">
            <span className="topup-package-ruby">◆</span>
            <strong>1060</strong>
            <small>RUBIES</small>
            <b>₹ 799</b>
          </button>

          <button className="topup-package">
            <span className="topup-package-ruby">◆</span>
            <strong>2180</strong>
            <small>RUBIES</small>
            <b>₹ 1599</b>
          </button>

          <button className="topup-package">
            <span className="topup-package-ruby">◆</span>
            <strong>5600</strong>
            <small>RUBIES</small>
            <b>₹ 3999</b>
          </button>

        </div>

      </section>

      <section className="membership-section">

        <div className="topup-section-heading">
          <span>PREMIUM ACCESS</span>
          <h2>MEMBERSHIP</h2>
        </div>

        <div className="membership-card">

          <div className="membership-icon">
            ★
          </div>

          <div className="membership-info">
            <strong>BR PRIME</strong>
            <span>30 DAYS MEMBERSHIP</span>

            <p>
              Daily Rubies  • Exclusive rewards •
              Premium badge
            </p>
          </div>

          <div className="membership-price">
            <span>₹ 299</span>
            <button>GET MEMBERSHIP</button>
          </div>

        </div>

      </section>

    </main>

  </div>
)}


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