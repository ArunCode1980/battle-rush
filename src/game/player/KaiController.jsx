import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import { Html } from "@react-three/drei";

import KaiCharacter from "./KaiCharacter";

import {
  WORLD_COLLIDERS,
} from "../world/BattleIsland";

import {
  ASSAULT_RIFLE,
} from "../weapons/weaponData";

import {
  gameState,
  useGameState,
} from "../systems/gameState";

export default function KaiController() {
  const player = useRef();

  const keys =
    useRef({});

  const velocity =
    useRef(
      new THREE.Vector3()
    );

  const yaw =
    useRef(0);

  const pitch =
    useRef(0.25);

  // =========================================================
  // CAMERA RECOIL
  // =========================================================

  const cameraRecoil =
    useRef(0);

  const cameraSideRecoil =
    useRef(0);

  const {
    camera,
    gl,
    scene,
  } = useThree();

  // =========================================================
  // GAME STATE
  // =========================================================

  const {
    eliminated,
  } = useGameState();

  // =========================================================
  // PLAYER STATE
  // =========================================================

  const [
    isMoving,
    setIsMoving,
  ] = useState(false);

  const [
    isSprinting,
    setIsSprinting,
  ] = useState(false);

  const [
    shooting,
    setShooting,
  ] = useState(false);

  const [
    aiming,
    setAiming,
  ] = useState(false);

  const [
    reloading,
    setReloading,
  ] = useState(false);

  const [
    ammo,
    setAmmo,
  ] = useState(
    ASSAULT_RIFLE.magazineSize
  );

  const [
    muzzleFlashId,
    setMuzzleFlashId,
  ] = useState(0);

  const [
    hitMarker,
    setHitMarker,
  ] = useState(false);

  // =========================================================
  // INTERNAL STATE
  // =========================================================

  const ammoRef =
    useRef(
      ASSAULT_RIFLE.magazineSize
    );

  const reloadingRef =
    useRef(false);

  const shootingRef =
    useRef(false);

  const aimingRef =
    useRef(false);

  const previousMoving =
    useRef(false);

  const previousSprinting =
    useRef(false);

  const lastShotTime =
    useRef(-Infinity);

  const reloadTimer =
    useRef(null);

  const hitMarkerTimer =
    useRef(null);

  const PLAYER_RADIUS =
    0.45;

  // =========================================================
  // COLLISION
  // =========================================================

  const canMoveTo = (
    x,
    z
  ) => {
    for (
      const collider of WORLD_COLLIDERS
    ) {
      if (
        collider.type ===
        "box"
      ) {
        const closestX =
          THREE.MathUtils.clamp(
            x,
            collider.x -
              collider.halfX,
            collider.x +
              collider.halfX
          );

        const closestZ =
          THREE.MathUtils.clamp(
            z,
            collider.z -
              collider.halfZ,
            collider.z +
              collider.halfZ
          );

        const dx =
          x - closestX;

        const dz =
          z - closestZ;

        if (
          dx * dx +
            dz * dz <
          PLAYER_RADIUS *
            PLAYER_RADIUS
        ) {
          return false;
        }
      }

      if (
        collider.type ===
        "circle"
      ) {
        const dx =
          x - collider.x;

        const dz =
          z - collider.z;

        const distance =
          Math.sqrt(
            dx * dx +
              dz * dz
          );

        if (
          distance <
          PLAYER_RADIUS +
            collider.radius
        ) {
          return false;
        }
      }
    }

    const islandLimit =
      34;

    if (
      x < -islandLimit ||
      x > islandLimit ||
      z < -islandLimit ||
      z > islandLimit
    ) {
      return false;
    }

    return true;
  };

  // =========================================================
  // RELOAD
  // =========================================================

  const startReload =
    () => {
      if (
        eliminated ||
        reloadingRef.current
      ) {
        return;
      }

      if (
        ammoRef.current >=
        ASSAULT_RIFLE.magazineSize
      ) {
        return;
      }

      const reserve =
        gameState
          .getState()
          .inventory.ammo;

      if (
        reserve <= 0
      ) {
        return;
      }

      shootingRef.current =
        false;

      setShooting(false);

      reloadingRef.current =
        true;

      setReloading(true);

      if (
        reloadTimer.current
      ) {
        clearTimeout(
          reloadTimer.current
        );
      }

      reloadTimer.current =
        setTimeout(
          () => {
            const currentReserve =
              gameState
                .getState()
                .inventory
                .ammo;

            const missing =
              ASSAULT_RIFLE
                .magazineSize -
              ammoRef.current;

            const amount =
              Math.min(
                missing,
                currentReserve
              );

            if (
              amount > 0
            ) {
              const removed =
                gameState.removeLoot(
                  "ammo",
                  amount
                );

              if (
                removed
              ) {
                ammoRef.current +=
                  amount;

                setAmmo(
                  ammoRef.current
                );
              }
            }

            reloadingRef.current =
              false;

            setReloading(false);

            reloadTimer.current =
              null;
          },
          ASSAULT_RIFLE
            .reloadTime
        );
    };

  // =========================================================
  // SHOOT
  // =========================================================

  const shoot = (
    time
  ) => {
    if (
      eliminated ||
      reloadingRef.current
    ) {
      return;
    }

    if (
      ammoRef.current <=
      0
    ) {
      shootingRef.current =
        false;

      setShooting(false);

      return;
    }

    const fireDelay =
      60000 /
      ASSAULT_RIFLE.fireRate;

    if (
      time -
        lastShotTime.current <
      fireDelay
    ) {
      return;
    }

    lastShotTime.current =
      time;

    ammoRef.current -=
      1;

    setAmmo(
      ammoRef.current
    );

    setMuzzleFlashId(
      (value) =>
        value + 1
    );

    // =======================================================
    // RECOIL
    // =======================================================

    const verticalKick =
      aimingRef.current
        ? 0.012
        : 0.022;

    const horizontalKick =
      (Math.random() -
        0.5) *
      0.012;

    cameraRecoil.current =
      Math.min(
        cameraRecoil.current +
          verticalKick,
        0.12
      );

    cameraSideRecoil.current =
      THREE.MathUtils.clamp(
        cameraSideRecoil.current +
          horizontalKick,
        -0.05,
        0.05
      );

    // =======================================================
    // RAYCAST
    // =======================================================

    const raycaster =
      new THREE.Raycaster();

    const direction =
      new THREE.Vector3();

    camera.getWorldDirection(
      direction
    );

    raycaster.set(
      camera.position,
      direction
    );

    raycaster.far =
      ASSAULT_RIFLE.range;

    const intersections =
      raycaster.intersectObjects(
        scene.children,
        true
      );

    let targetHit =
      false;

    for (
      const intersection
      of intersections
    ) {
      let object =
        intersection.object;

      while (
        object
      ) {
        if (
          object.userData &&
          object.userData
            .isTarget
        ) {
          targetHit =
            true;

          if (
            typeof
              object.userData
                .takeDamage ===
            "function"
          ) {
            object.userData
              .takeDamage(
                ASSAULT_RIFLE.damage
              );
          }

          break;
        }

        object =
          object.parent;
      }

      if (
        targetHit
      ) {
        break;
      }
    }

    // =======================================================
    // HIT MARKER
    // =======================================================

    if (
      targetHit
    ) {
      setHitMarker(
        true
      );

      if (
        hitMarkerTimer.current
      ) {
        clearTimeout(
          hitMarkerTimer.current
        );
      }

      hitMarkerTimer.current =
        setTimeout(
          () => {
            setHitMarker(
              false
            );
          },
          120
        );
    }
  };

  // =========================================================
  // INPUT
  // =========================================================

  useEffect(
    () => {
      const handleKeyDown =
        (event) => {
          keys.current[
            event.code
          ] = true;

          if (
            event.code ===
            "KeyR"
          ) {
            startReload();
          }

          if (
            event.code ===
              "Space" ||
            event.code ===
              "ArrowUp" ||
            event.code ===
              "ArrowDown"
          ) {
            event.preventDefault();
          }
        };

      const handleKeyUp =
        (event) => {
          keys.current[
            event.code
          ] = false;
        };

      const handleMouseMove =
        (event) => {
          if (
            eliminated
          ) {
            return;
          }

          if (
            document.pointerLockElement !==
            gl.domElement
          ) {
            return;
          }

          yaw.current -=
            event.movementX *
            0.0012;

          pitch.current -=
            event.movementY *
            0.0012;

          pitch.current =
            THREE.MathUtils.clamp(
              pitch.current,
              -0.4,
              1.0
            );
        };

      const handleClick =
        () => {
          if (
            eliminated
          ) {
            return;
          }

          if (
            document.pointerLockElement !==
            gl.domElement
          ) {
            gl.domElement.requestPointerLock();
          }
        };

      const handleMouseDown =
        (event) => {
          if (
            eliminated
          ) {
            return;
          }

          if (
            event.button ===
            0
          ) {
            shootingRef.current =
              true;

            setShooting(
              true
            );
          }

          if (
            event.button ===
            2
          ) {
            event.preventDefault();

            aimingRef.current =
              true;

            setAiming(
              true
            );
          }
        };

      const handleMouseUp =
        (event) => {
          if (
            event.button ===
            0
          ) {
            shootingRef.current =
              false;

            setShooting(
              false
            );
          }

          if (
            event.button ===
            2
          ) {
            aimingRef.current =
              false;

            setAiming(
              false
            );
          }
        };

      const handleContextMenu =
        (event) => {
          event.preventDefault();
        };

      window.addEventListener(
        "keydown",
        handleKeyDown
      );

      window.addEventListener(
        "keyup",
        handleKeyUp
      );

      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      window.addEventListener(
        "mouseup",
        handleMouseUp
      );

      gl.domElement.addEventListener(
        "click",
        handleClick
      );

      gl.domElement.addEventListener(
        "mousedown",
        handleMouseDown
      );

      gl.domElement.addEventListener(
        "contextmenu",
        handleContextMenu
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );

        window.removeEventListener(
          "keyup",
          handleKeyUp
        );

        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        window.removeEventListener(
          "mouseup",
          handleMouseUp
        );

        gl.domElement.removeEventListener(
          "click",
          handleClick
        );

        gl.domElement.removeEventListener(
          "mousedown",
          handleMouseDown
        );

        gl.domElement.removeEventListener(
          "contextmenu",
          handleContextMenu
        );
      };
    },
    [
      gl,
      eliminated,
    ]
  );

  // =========================================================
  // GAME LOOP
  // =========================================================

  useFrame(
    (state, delta) => {
      if (
        !player.current
      ) {
        return;
      }

      // =====================================================
      // ELIMINATED
      // =====================================================

      if (
        eliminated
      ) {
        shootingRef.current =
          false;

        aimingRef.current =
          false;

        setShooting(
          false
        );

        setAiming(
          false
        );

        return;
      }

      const now =
        state.clock
          .elapsedTime *
        1000;

      // =====================================================
      // SHOOT
      // =====================================================

      if (
        shootingRef.current
      ) {
        shoot(now);
      }

      // =====================================================
      // RECOIL
      // =====================================================

      cameraRecoil.current =
        THREE.MathUtils.damp(
          cameraRecoil.current,
          0,
          12,
          delta
        );

      cameraSideRecoil.current =
        THREE.MathUtils.damp(
          cameraSideRecoil.current,
          0,
          14,
          delta
        );

      // =====================================================
      // MOVEMENT
      // =====================================================

      const sprintingNow =
        keys.current
          .ShiftLeft ||
        keys.current
          .ShiftRight;

      const speed =
        sprintingNow
          ? 7
          : 4;

      const forward =
        new THREE.Vector3(
          Math.sin(
            yaw.current
          ),
          0,
          Math.cos(
            yaw.current
          )
        );

      const right =
        new THREE.Vector3(
          -Math.cos(
            yaw.current
          ),
          0,
          Math.sin(
            yaw.current
          )
        );

      const move =
        new THREE.Vector3();

      if (
        keys.current.KeyW
      ) {
        move.add(
          forward
        );
      }

      if (
        keys.current.KeyS
      ) {
        move.sub(
          forward
        );
      }

      if (
        keys.current.KeyD
      ) {
        move.add(
          right
        );
      }

      if (
        keys.current.KeyA
      ) {
        move.sub(
          right
        );
      }

      const movingNow =
        move.length() >
        0;

      if (
        movingNow
      ) {
        move.normalize();

        const currentX =
          player.current
            .position.x;

        const currentZ =
          player.current
            .position.z;

        const nextX =
          currentX +
          move.x *
            speed *
            delta;

        if (
          canMoveTo(
            nextX,
            currentZ
          )
        ) {
          player.current
            .position.x =
            nextX;
        }

        const nextZ =
          currentZ +
          move.z *
            speed *
            delta;

        if (
          canMoveTo(
            player.current
              .position.x,
            nextZ
          )
        ) {
          player.current
            .position.z =
            nextZ;
        }

        const targetRotation =
          Math.atan2(
            move.x,
            move.z
          );

        player.current
          .rotation.y =
          THREE.MathUtils.lerp(
            player.current
              .rotation.y,
            targetRotation,
            0.08
          );
      }

      // =====================================================
      // MOVEMENT STATE
      // =====================================================

      if (
        movingNow !==
        previousMoving.current
      ) {
        previousMoving.current =
          movingNow;

        setIsMoving(
          movingNow
        );
      }

      const sprintingState =
        movingNow &&
        sprintingNow;

      if (
        sprintingState !==
        previousSprinting.current
      ) {
        previousSprinting.current =
          sprintingState;

        setIsSprinting(
          sprintingState
        );
      }

      // =====================================================
      // JUMP
      // =====================================================

      if (
        keys.current.Space &&
        player.current
          .position.y <=
          0.01
      ) {
        velocity.current.y =
          7;

        keys.current.Space =
          false;
      }

      // =====================================================
      // GRAVITY
      // =====================================================

      velocity.current.y -=
        18 * delta;

      player.current
        .position.y +=
        velocity.current.y *
        delta;

      if (
        player.current
          .position.y < 0
      ) {
        player.current
          .position.y = 0;

        velocity.current.y =
          0;
      }

      // =====================================================
      // SEND KAI POSITION
      // =====================================================

      gameState.setPlayerPosition(
        player.current
          .position.x,
        player.current
          .position.y,
        player.current
          .position.z
      );

      // =====================================================
      // CAMERA
      // =====================================================

      const cameraDistance =
        aimingRef.current
          ? 3.8
          : 6;

      const cameraX =
        player.current
          .position.x -
        Math.sin(
          yaw.current
        ) *
          Math.cos(
            pitch.current
          ) *
          cameraDistance;

      const cameraY =
        player.current
          .position.y +
        2.8 +
        Math.sin(
          pitch.current
        ) *
          cameraDistance;

      const cameraZ =
        player.current
          .position.z -
        Math.cos(
          yaw.current
        ) *
          Math.cos(
            pitch.current
          ) *
          cameraDistance;

      const desiredCamera =
        new THREE.Vector3(
          cameraX,
          cameraY,
          cameraZ
        );

      camera.position.lerp(
        desiredCamera,
        aimingRef.current
          ? 0.2
          : 0.12
      );

      const lookTarget =
        new THREE.Vector3(
          player.current
            .position.x,
          player.current
            .position.y +
            1.5 +
            cameraRecoil.current,
          player.current
            .position.z
        );

      camera.lookAt(
        lookTarget
      );

      // =====================================================
      // FOV
      // =====================================================

      const targetFov =
        aimingRef.current
          ? 48
          : 65;

      const newFov =
        THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          0.12
        );

      if (
        Math.abs(
          newFov -
            camera.fov
        ) > 0.001
      ) {
        camera.fov =
          newFov;

        camera.updateProjectionMatrix();
      }
    }
  );

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        reloadTimer.current
      ) {
        clearTimeout(
          reloadTimer.current
        );
      }

      if (
        hitMarkerTimer.current
      ) {
        clearTimeout(
          hitMarkerTimer.current
        );
      }
    };
  }, []);

  // =========================================================
  // CHARACTER
  // =========================================================

  return (
    <>
      <group
        ref={player}
      >
        <KaiCharacter
          moving={
            isMoving
          }
          sprinting={
            isSprinting
          }
          shooting={
            shooting
          }
          reloading={
            reloading
          }
          aiming={
            aiming
          }
          muzzleFlashId={
            muzzleFlashId
          }
        />
      </group>

      {/* =====================================================
          CROSSHAIR + WEAPON HUD
          ===================================================== */}

      <Html
        fullscreen
        zIndexRange={[
          100,
          0,
        ]}
        style={{
          pointerEvents:
            "none",
        }}
      >
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            width:
              "100vw",
            height:
              "100vh",
            pointerEvents:
              "none",
            fontFamily:
              "Arial, sans-serif",
          }}
        >
          {/* CROSSHAIR */}

          {!eliminated && (
            <div
              style={{
                position:
                  "absolute",
                left:
                  "50%",
                top:
                  "50%",
                width:
                  aiming
                    ? "14px"
                    : "18px",
                height:
                  aiming
                    ? "14px"
                    : "18px",
                transform:
                  "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  position:
                    "absolute",
                  left:
                    "50%",
                  top: 0,
                  width:
                    "2px",
                  height:
                    "6px",
                  background:
                    "white",
                  transform:
                    "translateX(-50%)",
                  boxShadow:
                    "0 0 3px black",
                }}
              />

              <div
                style={{
                  position:
                    "absolute",
                  left:
                    "50%",
                  bottom: 0,
                  width:
                    "2px",
                  height:
                    "6px",
                  background:
                    "white",
                  transform:
                    "translateX(-50%)",
                  boxShadow:
                    "0 0 3px black",
                }}
              />

              <div
                style={{
                  position:
                    "absolute",
                  top:
                    "50%",
                  left: 0,
                  width:
                    "6px",
                  height:
                    "2px",
                  background:
                    "white",
                  transform:
                    "translateY(-50%)",
                  boxShadow:
                    "0 0 3px black",
                }}
              />

              <div
                style={{
                  position:
                    "absolute",
                  top:
                    "50%",
                  right: 0,
                  width:
                    "6px",
                  height:
                    "2px",
                  background:
                    "white",
                  transform:
                    "translateY(-50%)",
                  boxShadow:
                    "0 0 3px black",
                }}
              />

              {hitMarker && (
                <div
                  style={{
                    position:
                      "absolute",
                    left:
                      "50%",
                    top:
                      "50%",
                    transform:
                      "translate(-50%, -50%)",
                    color:
                      "white",
                    fontSize:
                      "24px",
                    fontWeight:
                      "bold",
                    textShadow:
                      "0 0 5px black",
                  }}
                >
                  ×
                </div>
              )}
            </div>
          )}

          {/* WEAPON AMMO */}

          {!eliminated && (
            <div
              style={{
                position:
                  "absolute",
                right:
                  "28px",
                bottom:
                  "24px",
                color:
                  "white",
                textAlign:
                  "right",
                textShadow:
                  "0 2px 6px black",
              }}
            >
              <div
                style={{
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                  letterSpacing:
                    "1px",
                  opacity:
                    0.8,
                }}
              >
                {
                  ASSAULT_RIFLE.name
                }
              </div>

              <div
                style={{
                  fontSize:
                    "30px",
                  fontWeight:
                    "bold",
                  lineHeight:
                    1,
                }}
              >
                {ammo}

                <span
                  style={{
                    fontSize:
                      "16px",
                    opacity:
                      0.65,
                    marginLeft:
                      "5px",
                  }}
                >
                  /
                  {
                    ASSAULT_RIFLE
                      .magazineSize
                  }
                </span>
              </div>

              <div
                style={{
                  fontSize:
                    "13px",
                  marginTop:
                    "5px",
                  opacity:
                    0.85,
                }}
              >
                RESERVE:{" "}
                {
                  gameState
                    .getState()
                    .inventory
                    .ammo
                }
              </div>

              {reloading && (
                <div
                  style={{
                    marginTop:
                      "5px",
                    color:
                      "#f5c542",
                    fontSize:
                      "13px",
                    fontWeight:
                      "bold",
                  }}
                >
                  RELOADING...
                </div>
              )}
            </div>
          )}
        </div>
      </Html>
    </>
  );
}