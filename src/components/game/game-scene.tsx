'use client';

import { AnimatedRobot } from '@/components/game/animated-robot';
import type { GameState } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const ROAD_LENGTH = 200;

function Ground() {
  const roadLines = useMemo(() => {
    const lines = [];
    const numLines = ROAD_LENGTH / 4;
    for (let i = 0; i < numLines; i++) {
        // Left divider
        lines.push(
            <mesh key={`l-${i}`} position={[-LANE_WIDTH / 2, 0.02, i * -4]}>
                <boxGeometry args={[0.1, 0.02, 2]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
        );
         // Right divider
        lines.push(
            <mesh key={`r-${i}`} position={[LANE_WIDTH / 2, 0.02, i * -4]}>
                <boxGeometry args={[0.1, 0.02, 2]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
        );
    }
    return lines;
  }, []);

  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[NUM_LANES * LANE_WIDTH, ROAD_LENGTH]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {roadLines}
    </>
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

// Simple car obstacle
function Car({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (ref.current) {
        // Move car towards the player
        ref.current.position.z += delta * 15;
    }
  });

  return (
    <group ref={ref} position={position}>
        <mesh castShadow>
            <boxGeometry args={[2, 1.5, 4]} />
            <meshStandardMaterial color="red" />
        </mesh>
    </group>
  )
}

interface GameSceneProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

let nextCarId = 0;

export function GameScene({ gameState, setGameState }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);
  const [cars, setCars] = useState<any[]>([]);
  const spawnTimer = useRef(0);
  const playerBox = useMemo(() => new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()), []);

  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      if (gameState === 'menu' && cars.length > 0) {
        setCars([]); // Clear cars on menu
        if (robotRef.current) {
          robotRef.current.position.z = 0;
        }
      }
      return;
    }
    
    // --- Constant Forward Movement ---
    const speed = 10;
    state.camera.position.z -= delta * speed;
    robotRef.current.position.z -= delta * speed;
    
    // --- Camera Follow ---
     state.camera.lookAt(
      new THREE.Vector3(
        robotRef.current.position.x,
        robotRef.current.position.y + 2,
        robotRef.current.position.z
      )
    );

    // --- Car Spawning Logic ---
    spawnTimer.current += delta;
    if (spawnTimer.current > 2) { // Spawn a car every 2 seconds
        spawnTimer.current = Math.random(); // Add randomness
        const lane = Math.floor(Math.random() * NUM_LANES); // 0, 1, or 2
        const laneX = (lane - 1) * LANE_WIDTH;
        const newCar = {
            id: nextCarId++,
            position: new THREE.Vector3(laneX, 0.75, robotRef.current.position.z - 80), // Spawn ahead of player
            ref: useRef<THREE.Group>(null!),
            box: new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()),
        }
        setCars(prevCars => [...prevCars, newCar]);
    }

    // --- Update Cars & Collision ---
    playerBox.setFromObject(robotRef.current);

    setCars(currentCars => {
        const updatedCars = [];
        for (const car of currentCars) {
            if (car.position.z > state.camera.position.z + 10) {
                // Car is behind the camera, remove it
                continue;
            }

            // Move car forward
            car.position.z += delta * 15;

            // Check for collision
            if(car.ref.current) {
                car.box.setFromObject(car.ref.current);
                if (playerBox.intersectsBox(car.box)) {
                    setGameState('gameOver');
                }
            }

            updatedCars.push(car);
        }
        return updatedCars;
    });

  });

  return (
    <>
      <AnimatedRobot ref={robotRef} gameState={gameState} />
      {gameState === 'menu' ? <Garage /> : <Ground />}
      {gameState === 'playing' && cars.map(car => (
          <group key={car.id} ref={car.ref} position={car.position}>
             <mesh castShadow>
                <boxGeometry args={[2, 1.5, 4]} />
                <meshStandardMaterial color={`hsl(${Math.random() * 360}, 80%, 50%)`} />
             </mesh>
          </group>
      ))}
    </>
  );
}
