'use client';

import * as React from 'react';
import { AnimatedRobot } from '@/components/game/animated-robot';
import type { GameState } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Car } from './car';

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
  setJumpState: (state: { count: number; cooldown: number }) => void;
}

let nextCarId = 0;

interface CarData {
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


export function GameScene({ gameState, setGameState, setJumpState }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);
  
  const carsRef = useRef<CarData[]>([]);
  const [iteration, setIteration] = useState(0); 

  const spawnTimer = useRef(0);
  const playerBox = useMemo(() => new THREE.Box3(), []);

  const roadSegment1Ref = useRef<THREE.Group>(null!);
  const roadSegment2Ref = useRef<THREE.Group>(null!);
  
  const jumpCount = useRef(2);
  const jumpCooldown = useRef(0);

  useEffect(() => {
    if (gameState === 'menu' || gameState === 'gameOver') {
      carsRef.current = [];
      if (robotRef.current) {
        robotRef.current.position.set(0, 1.2, 0);
      }
      if (roadSegment1Ref.current) roadSegment1Ref.current.position.z = 0;
      if (roadSegment2Ref.current) roadSegment2Ref.current.position.z = -ROAD_LENGTH;
      jumpCount.current = 2;
      jumpCooldown.current = 0;
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
      setIteration(i => i + 1);
    }
  }, [gameState, setJumpState]);


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

    if (jumpCooldown.current > 0) {
      jumpCooldown.current -= 1; 
      if (jumpCooldown.current <= 0) {
        jumpCount.current = 2;
        jumpCooldown.current = 0;
      }
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
    }
    
    const speed = 10;
    robotRef.current.position.z -= delta * speed;
    
    // Camera logic
    state.camera.position.z = robotRef.current.position.z + 10;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, robotRef.current.position.x, delta * 2);
    
    // Make the camera look at a point slightly above the robot's base, but not at its jumping height
    const lookAtTarget = new THREE.Vector3(
      robotRef.current.position.x,
      2, // A fixed height for the camera to look at
      robotRef.current.position.z
    );
    state.camera.lookAt(lookAtTarget);


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
        setIteration(i => i + 1);
    }

    if (robotRef.current) {
      const robotMesh = robotRef.current;
      playerBox.setFromObject(robotMesh).expandByScalar(-0.5); // Adjust bounding box
    }

    const activeCars: CarData[] = [];
    for (const car of carsRef.current) {
        if (car.position.z > state.camera.position.z + 10) {
            continue; 
        }

        if (car.ref.current) {
            car.box.setFromObject(car.ref.current);
            if (playerBox.intersectsBox(car.box)) {
                setGameState('gameOver');
            }
        }
        activeCars.push(car);
    }
    
    if (activeCars.length !== carsRef.current.length) {
      carsRef.current = activeCars;
      setIteration(i => i + 1);
    }
  });

  const handleJump = () => {
    if (jumpCount.current > 0) {
      jumpCount.current--;
      if (jumpCooldown.current <= 0) {
        // Start cooldown in frames (e.g., 120s * 60fps)
        jumpCooldown.current = 120; 
      }
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
      return true; // Jump is allowed
    }
    return false; // No jumps left
  };
  
  return (
    <>
      <AnimatedRobot ref={robotRef} gameState={gameState} onJump={handleJump} />
      
      {gameState === 'menu' && <Garage />}
      {gameState !== 'menu' && (
        <>
            <RoadSegment fRef={roadSegment1Ref} position={[0,0,0]} />
            <RoadSegment fRef={roadSegment2Ref} position={[0,0,-ROAD_LENGTH]} />
        </>
      )}

      {carsRef.current.map(car => (
          <Car key={car.id} carRef={car.ref} position={car.position} color={`hsl(${car.id * 40}, 80%, 50%)`} />
      ))}
    </>
  );
}
