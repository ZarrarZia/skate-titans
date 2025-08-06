'use client';

import * as React from 'react';
import { AnimatedRobot } from '@/components/game/animated-robot';
import type { GameState } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const ROAD_LENGTH = 200;

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

const RoadSegment = ({ fRef, position }: { fRef: React.Ref<THREE.Group>, position: [number, number, number] }) => (
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
                    <mesh key={`l-${position[2]}-${i}`} position={[-LANE_WIDTH / 2, 0.02, (ROAD_LENGTH / 2) - i * 4]}>
                        <boxGeometry args={[0.1, 0.02, 2]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                );
                lines.push(
                    <mesh key={`r-${position[2]}-${i}`} position={[LANE_WIDTH / 2, 0.02, (ROAD_LENGTH / 2) - i * 4]}>
                        <boxGeometry args={[0.1, 0.02, 2]} />
                        <meshStandardMaterial color="yellow" />
                    </mesh>
                );
            }
            return lines;
      }, [position])}
    </group>
);


export function GameScene({ gameState, setGameState }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);
  
  // Use state for triggering re-render, but manage positions in a ref.
  const carsRef = useRef<Car[]>([]);
  const [iteration, setIteration] = useState(0); // Used to force re-render

  const spawnTimer = useRef(0);
  const playerBox = useMemo(() => new THREE.Box3(), []);

  const roadSegment1Ref = useRef<THREE.Group>(null!);
  const roadSegment2Ref = useRef<THREE.Group>(null!);
  
  // Reset game state when gameState changes
  useEffect(() => {
    if (gameState === 'menu' || gameState === 'gameOver') {
      carsRef.current = [];
      if (robotRef.current) {
        robotRef.current.position.set(0, 1.2, 0);
      }
      if (roadSegment1Ref.current) roadSegment1Ref.current.position.z = 0;
      if (roadSegment2Ref.current) roadSegment2Ref.current.position.z = -ROAD_LENGTH;
      setIteration(i => i + 1);
    }
  }, [gameState]);


  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      if (robotRef.current) {
        state.camera.position.x = 0;
        state.camera.position.y = 5;
        state.camera.position.z = 10;
        state.camera.lookAt(robotRef.current.position);
      }
      return;
    }
    
    const speed = 10;
    robotRef.current.position.z -= delta * speed;
    
    state.camera.position.z = robotRef.current.position.z + 10;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, robotRef.current.position.x, delta * 2);
    state.camera.lookAt(
      robotRef.current.position.x,
      robotRef.current.position.y,
      robotRef.current.position.z
    );

    if (roadSegment1Ref.current && roadSegment1Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment1Ref.current.position.z -= ROAD_LENGTH * 2;
    }
    if (roadSegment2Ref.current && roadSegment2Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment2Ref.current.position.z -= ROAD_LENGTH * 2;
    }

    spawnTimer.current += delta;
    if (spawnTimer.current > 1) { 
        spawnTimer.current = Math.random(); 
        const lane = Math.floor(Math.random() * NUM_LANES);
        const laneX = (lane - 1) * LANE_WIDTH;
        
        carsRef.current.push({
            id: nextCarId++,
            position: new THREE.Vector3(laneX, 0.75, robotRef.current.position.z - 80),
            ref: React.createRef<THREE.Group>(),
            box: new THREE.Box3(),
        });
        setIteration(i => i + 1); // Trigger re-render to show new car
    }

    if (robotRef.current) {
      playerBox.setFromObject(robotRef.current);
    }

    const activeCars: Car[] = [];
    for (const car of carsRef.current) {
        if (car.position.z > state.camera.position.z + 10) {
            continue; // Car is behind the camera, let it get garbage collected
        }

        if (car.ref.current) {
            car.box.setFromObject(car.ref.current);
            if (playerBox.intersectsBox(car.box)) {
                setGameState('gameOver');
            }
        }
        activeCars.push(car);
    }
    
    // Only update if the array has changed
    if (activeCars.length !== carsRef.current.length) {
      carsRef.current = activeCars;
      setIteration(i => i + 1); // Trigger re-render to remove old cars
    }
  });
  
  return (
    <>
      <AnimatedRobot ref={robotRef} gameState={gameState} />
      
      {gameState === 'menu' && <Garage />}
      {gameState !== 'menu' && (
        <>
            <RoadSegment fRef={roadSegment1Ref} position={[0,0,0]} />
            <RoadSegment fRef={roadSegment2Ref} position={[0,0,-ROAD_LENGTH]} />
        </>
      )}

      {/* This renders the cars based on the ref, not state */}
      {carsRef.current.map(car => (
          <group key={car.id} ref={car.ref} position={car.position}>
             <mesh castShadow>
                <boxGeometry args={[2, 1.5, 4]} />
                <meshStandardMaterial color={`hsl(${car.id * 40}, 80%, 50%)`} />
             </mesh>
          </group>
      ))}
    </>
  );
}
