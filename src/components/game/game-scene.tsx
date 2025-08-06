'use client';

import { AnimatedRobot } from '@/components/game/animated-robot';
import type { GameState } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function Ground() {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[30, 200]} />
      <meshStandardMaterial color="#444444" />
    </mesh>
  );
}

function Garage() {
    return (
        <group>
            <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.01}>
                <circleGeometry args={[10, 64]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
            </mesh>
            <gridHelper args={[20, 20]} />
        </group>
    );
}


interface GameSceneProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

export function GameScene({ gameState, setGameState }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (gameState !== 'playing' || !robotRef.current) return;
    
    // Move the camera and robot forward
    state.camera.position.z -= delta * 10;
    robotRef.current.position.z -= delta * 10;

    // Keep camera focused on the robot
     state.camera.lookAt(
      new THREE.Vector3(
        robotRef.current.position.x,
        robotRef.current.position.y + 2,
        robotRef.current.position.z
      )
    );
  });


  return (
    <>
      <AnimatedRobot ref={robotRef} gameState={gameState} />
      {gameState === 'menu' ? <Garage /> : <Ground />}
    </>
  );
}
