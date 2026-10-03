import {
  useEffect,
  useState,
} from "react";

import {
  useGameState,
  gameState,
} from "../systems/gameState";

export default function InventoryHUD() {
  const {
    inventory,
    playerHealth,
    eliminated,
  } = useGameState();

  const [
    usingMedkit,
    setUsingMedkit,
  ] = useState(false);

  const [
    damageFlash,
    setDamageFlash,
  ] = useState(false);

  // =========================================================
  // MEDKIT
  // =========================================================

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.code !==
          "KeyQ"
        ) {
          return;
        }

        if (event.repeat) {
          return;
        }

        if (eliminated) {
          return;
        }

        if (usingMedkit) {
          return;
        }

        if (
          inventory.medkits <=
          0
        ) {
          return;
        }

        if (
          playerHealth >=
          100
        ) {
          return;
        }

        setUsingMedkit(
          true
        );

        setTimeout(() => {
          gameState.useMedkit();

          setUsingMedkit(
            false
          );
        }, 1200);
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    inventory.medkits,
    playerHealth,
    usingMedkit,
    eliminated,
  ]);

  // =========================================================
  // DAMAGE FLASH
  // =========================================================

  useEffect(() => {
    let previousHealth =
      playerHealth;

    const handleStateChange =
      () => {
        const currentHealth =
          gameState.getState()
            .playerHealth;

        if (
          currentHealth <
          previousHealth
        ) {
          setDamageFlash(
            true
          );

          setTimeout(() => {
            setDamageFlash(
              false
            );
          }, 180);
        }

        previousHealth =
          currentHealth;
      };

    return gameState.subscribe(
      handleStateChange
    );
  }, []);

  // =========================================================
  // HEALTH %
  // =========================================================

  const healthPercent =
    Math.max(
      0,
      Math.min(
        100,
        playerHealth
      )
    );

  // =========================================================
  // ELIMINATED
  // =========================================================

  if (eliminated) {
    return (
      <>
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex: 5000,
            background:
              "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
            fontFamily:
              "Arial, sans-serif",
            pointerEvents:
              "auto",
          }}
        >
          <div
            style={{
              color:
                "#e53935",
              fontSize:
                "64px",
              fontWeight:
                "900",
              letterSpacing:
                "5px",
              textShadow:
                "0 4px 15px black",
            }}
          >
            ELIMINATED
          </div>

          <div
            style={{
              color:
                "white",
              fontSize:
                "18px",
              marginTop:
                "12px",
              opacity:
                0.85,
            }}
          >
            KAI has been eliminated
          </div>

          <button
            onClick={() => {
              gameState.resetMatch();

              window.location.reload();
            }}
            style={{
              marginTop:
                "28px",
              padding:
                "13px 32px",
              border:
                "none",
              borderRadius:
                "6px",
              background:
                "#e53935",
              color:
                "white",
              fontSize:
                "16px",
              fontWeight:
                "800",
              cursor:
                "pointer",
              letterSpacing:
                "1px",
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* =====================================================
          DAMAGE FLASH
      ===================================================== */}

      {damageFlash && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex: 3000,
            border:
              "5px solid rgba(255,0,0,0.65)",
            pointerEvents:
              "none",
          }}
        />
      )}

      {/* =====================================================
          HUD
      ===================================================== */}

      <div
        style={{
          position:
            "fixed",
          left: "22px",
          bottom: "22px",
          zIndex: 2000,
          fontFamily:
            "Arial, sans-serif",
          pointerEvents:
            "none",
        }}
      >
        {/* HEALTH */}

        <div
          style={{
            width: "270px",
            background:
              "rgba(0,0,0,0.72)",
            padding: "10px",
            borderRadius:
              "7px",
            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              color:
                "white",
              fontSize:
                "13px",
              fontWeight:
                "700",
              marginBottom:
                "6px",
            }}
          >
            <span>
              KAI
            </span>

            <span>
              {playerHealth} / 100
            </span>
          </div>

          <div
            style={{
              width:
                "100%",
              height:
                "12px",
              background:
                "rgba(255,255,255,0.18)",
              borderRadius:
                "4px",
              overflow:
                "hidden",
            }}
          >
            <div
              style={{
                width:
                  `${healthPercent}%`,
                height:
                  "100%",
                background:
                  healthPercent >
                  50
                    ? "#35d46b"
                    : healthPercent >
                      25
                    ? "#f5c542"
                    : "#e53935",
                transition:
                  "width 0.25s ease",
              }}
            />
          </div>

          {usingMedkit && (
            <div
              style={{
                marginTop:
                  "7px",
                color:
                  "#f5c542",
                fontSize:
                  "12px",
                fontWeight:
                  "700",
                textAlign:
                  "center",
              }}
            >
              USING MEDKIT...
            </div>
          )}
        </div>

        {/* INVENTORY */}

        <div
          style={{
            display:
              "flex",
            gap:
              "8px",
            marginTop:
              "9px",
          }}
        >
          <div
            style={{
              background:
                "rgba(0,0,0,0.72)",
              color:
                "#f5c542",
              padding:
                "7px 11px",
              borderRadius:
                "6px",
              fontSize:
                "13px",
              fontWeight:
                "700",
            }}
          >
            🔸 AMMO {inventory.ammo}
          </div>

          <div
            style={{
              background:
                "rgba(0,0,0,0.72)",
              color:
                "#ff5a5a",
              padding:
                "7px 11px",
              borderRadius:
                "6px",
              fontSize:
                "13px",
              fontWeight:
                "700",
            }}
          >
            ❤️ {inventory.medkits}
          </div>

          <div
            style={{
              background:
                "rgba(0,0,0,0.72)",
              color:
                "#66d96a",
              padding:
                "7px 11px",
              borderRadius:
                "6px",
              fontSize:
                "13px",
              fontWeight:
                "700",
            }}
          >
            💣 {inventory.grenades}
          </div>
        </div>

        {/* MEDKIT HELP */}

        {inventory.medkits >
          0 &&
          playerHealth <
            100 &&
          !usingMedkit && (
            <div
              style={{
                marginTop:
                  "7px",
                color:
                  "white",
                fontSize:
                  "12px",
                textShadow:
                  "0 1px 4px black",
              }}
            >
              [Q] USE MEDKIT
            </div>
          )}
      </div>
    </>
  );
}