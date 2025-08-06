'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/app/play/page';

const LANE_WIDTH = 3;
const NUM_LANES = 3;

function Player() {
  const playerRef = useRef<THREE.Mesh>(null);
  const currentLane = useRef(1); // 0: left, 1: middle, 2: right
  const targetX = useRef(0);

  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const moveRequest = useRef<'left' | 'right' | null>(null);


  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Handle lane switching
    if (rightPressed && moveRequest.current !== 'right') {
        moveRequest.current = 'right';
    } else if (leftPressed && moveRequest.current !== 'left') {
        moveRequest.current = 'left';
    }

    if (!rightPressed && !leftPressed && moveRequest.current) {
        if (moveRequest.current === 'right' && currentLane.current < NUM_LANES - 1) {
            currentLane.current++;
        }
        if (moveRequest.current === 'left' && currentLane.current > 0) {
            currentLane.current--;
        }
        targetX.current = (currentLane.current - 1) * LANE_WIDTH;
        moveRequest.current = null;
    }

    // Smoothly move the player to the target lane
    playerRef.current.position.x = THREE.MathUtils.lerp(
      playerRef.current.position.x,
      targetX.current,
      delta * 10 
    );
  });

  return (
    <mesh ref={playerRef} castShadow position={[0, 1, 0]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export function GameScene() {
  return (
    <>
      <Player />
      <Ground />
    </>
  );
}
