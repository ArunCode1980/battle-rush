import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import KaiCharacter from "../player/KaiCharacter";

const MAP_LIMIT = 17;

export default function WaitingController() {
  const playerRef = useRef(null);

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false,
  });

  const velocityY = useRef(0);

  const yaw = useRef(Math.PI);

  const pitch = useRef(-0.08);

  const mouseLook = useRef(false);

  const { camera, gl } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") keys.current.w = true;
      if (key === "a") keys.current.a = true;
      if (key === "s") keys.current.s = true;
      if (key === "d") keys.current.d = true;
      if (key === "shift") keys.current.shift = true;

      if (event.code === "Space") {
        keys.current.space = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (key === "w") keys.current.w = false;
      if (key === "a") keys.current.a = false;
      if (key === "s") keys.current.s = false;
      if (key === "d") keys.current.d = false;
      if (key === "shift") keys.current.shift = false;

      if (event.code === "Space") {
        keys.current.space = false;
      }
    };

    const handleMouseDown = (event) => {
      if (event.button === 0 || event.button === 2) {
        mouseLook.current = true;
      }
    };

    const handleMouseUp = () => {
      mouseLook.current = false;
    };

    const handleMouseMove = (event) => {
      if (!mouseLook.current) return;

      yaw.current -= event.movementX * 0.0025;
      pitch.current -= event.movementY * 0.0018;

      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        -0.45,
        0.3
      );
    };

    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("contextmenu", preventContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  useFrame((_, delta) => {
    const player = playerRef.current;

    if (!player) return;

    const inputX =
      (keys.current.d ? 1 : 0) -
      (keys.current.a ? 1 : 0);

    const inputZ =
      (keys.current.s ? 1 : 0) -
      (keys.current.w ? 1 : 0);

    const input = new THREE.Vector3(
      inputX,
      0,
      inputZ
    );

    const isMoving = input.lengthSq() > 0;

    if (isMoving) {
      input.normalize();

      /*
       * Camera-relative movement
       */

      const forward = new THREE.Vector3(
        -Math.sin(yaw.current),
        0,
        -Math.cos(yaw.current)
      );

      const right = new THREE.Vector3(
        Math.cos(yaw.current),
        0,
        -Math.sin(yaw.current)
      );

      const movement = new THREE.Vector3();

      movement.addScaledVector(forward, -input.z);
      movement.addScaledVector(right, input.x);

      movement.normalize();

      const speed = keys.current.shift ? 7.5 : 4.5;

      player.position.addScaledVector(
        movement,
        speed * delta
      );

      /*
       * Character faces movement direction
       */

      const targetRotation = Math.atan2(
        movement.x,
        movement.z
      );

      player.rotation.y = THREE.MathUtils.damp(
        player.rotation.y,
        targetRotation,
        10,
        delta
      );
    }

    /*
     * Jump
     */

    const grounded =
      player.position.y <= 0.02;

    if (
      grounded &&
      keys.current.space
    ) {
      velocityY.current = 6.5;
      keys.current.space = false;
    }

    velocityY.current -= 18 * delta;

    player.position.y +=
      velocityY.current * delta;

    if (player.position.y < 0) {
      player.position.y = 0;
      velocityY.current = 0;
    }

    /*
     * Waiting island boundaries
     */

    player.position.x = THREE.MathUtils.clamp(
      player.position.x,
      -MAP_LIMIT,
      MAP_LIMIT
    );

    player.position.z = THREE.MathUtils.clamp(
      player.position.z,
      -MAP_LIMIT,
      MAP_LIMIT
    );

    /*
     * Third-person camera
     */

    const cameraDistance = 6.2;

    const horizontalDistance =
      Math.cos(pitch.current) *
      cameraDistance;

    const verticalDistance =
      Math.sin(pitch.current) *
      cameraDistance;

    const cameraOffset = new THREE.Vector3(
      Math.sin(yaw.current) * horizontalDistance,
      2.7 - verticalDistance,
      Math.cos(yaw.current) * horizontalDistance
    );

    const desiredCamera =
      player.position
        .clone()
        .add(cameraOffset);

    camera.position.lerp(
      desiredCamera,
      1 - Math.pow(0.001, delta)
    );

    const lookTarget =
      player.position
        .clone()
        .add(new THREE.Vector3(0, 1.25, 0));

    camera.lookAt(lookTarget);
  });

  return (
    <group
      ref={playerRef}
      position={[0, 0, 6]}
    >
      <KaiCharacter />
    </group>
  );
}