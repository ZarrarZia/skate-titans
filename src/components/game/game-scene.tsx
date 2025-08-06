'use client';

import { AnimatedRobot } from '@/components/game/animated-robot';
import type { GameState } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, createRef } from 'react';
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

interface GameSceneProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

let nextCarId = 0;

interface Car {
    id: number;
    position: THREE.Vector3;
    ref: React.RefObject<THREE.Group>;
    box: THREE.Box3;
}

export function GameScene({ gameState, setGameState }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);
  const [cars, setCars] = useState<Car[]>([]);
  const spawnTimer = useRef(0);
  const playerBox = useMemo(() => new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()), []);
  const roadSegment1Ref = useRef<THREE.Group>(null!);
  const roadSegment2Ref = useRef<THREE.Group>(null!);


  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      if ((gameState === 'menu' || gameState === 'gameOver') && cars.length > 0) {
        setCars([]); // Clear cars on menu or game over
        if (robotRef.current) {
          // Reset robot position
          robotRef.current.position.set(0, 1.2, 0);
          state.camera.position.set(0, 5, 10);
        }
      }
       if (robotRef.current) {
         state.camera.lookAt(robotRef.current.position);
       }
      return;
    }
    
    // --- Constant Forward Movement ---
    const speed = 10;
    robotRef.current.position.z -= delta * speed;
    
    // --- Camera Follow ---
     state.camera.position.z = robotRef.current.position.z + 10;
     state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, robotRef.current.position.x, delta * 2);
     state.camera.lookAt(
      new THREE.Vector3(
        robotRef.current.position.x,
        robotRef.current.position.y,
        robotRef.current.position.z
      )
    );

    // --- Endless Road Loop ---
    if (roadSegment1Ref.current && roadSegment1Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment1Ref.current.position.z -= ROAD_LENGTH * 2;
    }
    if (roadSegment2Ref.current && roadSegment2Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment2Ref.current.position.z -= ROAD_LENGTH * 2;
    }


    // --- Car Spawning Logic ---
    spawnTimer.current += delta;
    if (spawnTimer.current > 1) { // Spawn a car every 1-2 seconds
        spawnTimer.current = Math.random(); // Add randomness
        const lane = Math.floor(Math.random() * NUM_LANES); // 0, 1, or 2
        const laneX = (lane - 1) * LANE_WIDTH;
        
        // Don't call hooks here!
        const newCar = {
            id: nextCarId++,
            position: new THREE.Vector3(laneX, 0.75, robotRef.current.position.z - 80), // Spawn ahead of player
            ref: createRef<THREE.Group>(),
            box: new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()),
        }
        setCars(prevCars => [...prevCars, newCar]);
    }

    // --- Update Cars & Collision ---
    if (robotRef.current) {
      playerBox.setFromObject(robotRef.current);
    }


    setCars(currentCars => {
        const updatedCars = [];
        for (const car of currentCars) {
            // Remove cars that are far behind the player
            if (car.position.z > state.camera.position.z + 10) {
                continue;
            }

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
  
  const RoadSegment = ({ fRef, position }: { fRef: React.Ref<THREE.Group>, position: THREE.Vector3 }) => (
    <group ref={fRef} position={position}>
       <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[NUM_LANES * LANE_WIDTH, ROAD_LENGTH]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
       {useMemo(() => {
            const lines = [];
            const numLines = ROAD_LENGTH / 4;
            for (let i = 0; i < numLines; i++) {
                lines.push(
                    <mesh key={`l-${position.z}-${i}`} position={[-LANE_WIDTH / 2, 0.02, (ROAD_LENGTH / 2) - i * 4]}>
                        <boxGeometry args={[0.1, 0.02, 2]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                );
                lines.push(
                    <mesh key={`r-${position.z}-${i}`} position={[LANE_WIDTH / 2, 0.02, (ROAD_LENGTH / 2) - i * 4]}>
                        <boxGeometry args={[0.1, 0.02, 2]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                );
            }
            return lines;
      }, [position.z])}
    </group>
  );


  return (
    <>
      <AnimatedRobot ref={robotRef} gameState={gameState} />
      
      {gameState === 'menu' && <Garage />}
      {gameState !== 'menu' && (
        <>
            <RoadSegment fRef={roadSegment1Ref} position={new THREE.Vector3(0,0,0)} />
            <RoadSegment fRef={roadSegment2Ref} position={new THREE.Vector3(0,0,-ROAD_LENGTH)} />
        </>
      )}

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
