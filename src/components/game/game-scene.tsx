
'use client';

import * as React from 'react';
import type { GameState, Character } from '@/app/play/page';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { CarModel } from './car-model';
import { BoyRobot } from './characters/boy-robot';
import { GirlRobot } from './characters/girl-robot';
import { RobotCat } from './characters/robot-cat';
import { JUMP_COOLDOWN_SECONDS } from '@/app/play/page';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const ROAD_LENGTH = 200;

function Garage({ character }: { character: Character }) {
    const platformRef = useRef<THREE.Group>(null!);

    useFrame((_, delta) => {
        if (platformRef.current) {
            platformRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group>
            <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.01}>
                <circleGeometry args={[10, 64]} />
                <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
            </mesh>
            <gridHelper args={[20, 20]} />
            <group ref={platformRef}>
                <CharacterModel selectedCharacter={character} gameState="characterSelect" />
            </group>
        </group>
    );
}

interface GameSceneProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setJumpState: (state: { count: number; cooldown: number }) => void;
  setScore: (score: number) => void;
  selectedCharacter: Character;
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

const CharacterModel = React.forwardRef<THREE.Group, { selectedCharacter: Character; gameState: GameState; onJump?: () => boolean }>(
    ({ selectedCharacter, ...props }, ref) => {
        switch (selectedCharacter) {
            case 'girl':
                return <GirlRobot ref={ref} {...props} />;
            case 'cat':
                return <RobotCat ref={ref} {...props} />;
            case 'boy':
            default:
                return <BoyRobot ref={ref} {...props} />;
        }
    }
);
CharacterModel.displayName = "CharacterModel";


export function GameScene({ gameState, setGameState, setJumpState, setScore, selectedCharacter }: GameSceneProps) {
  const robotRef = useRef<THREE.Group>(null!);
  
  const carsRef = useRef<CarData[]>([]);
  const [iteration, setIteration] = useState(0); 

  const spawnTimer = useRef(2.5);
  const playerBox = useMemo(() => new THREE.Box3(), []);
  const elapsedTime = useRef(0);

  const roadSegment1Ref = useRef<THREE.Group>(null!);
  const roadSegment2Ref = useRef<THREE.Group>(null!);
  
  const jumpCount = useRef(2);
  const jumpCooldown = useRef(0);
  const score = useRef(0);

  useEffect(() => {
    if (gameState === 'characterSelect' || gameState === 'gameOver') {
      carsRef.current = [];
      if (robotRef.current) {
        robotRef.current.position.set(0, 1.2, 0);
      }
      if (roadSegment1Ref.current) roadSegment1Ref.current.position.z = 0;
      if (roadSegment2Ref.current) roadSegment2Ref.current.position.z = -ROAD_LENGTH;
      jumpCount.current = 2;
      jumpCooldown.current = 0;
      elapsedTime.current = 0;
      score.current = 0;
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
      setScore(score.current);
      setIteration(i => i + 1);
    }
  }, [gameState, setJumpState, setScore]);


  useFrame((state, delta) => {
    if (gameState !== 'playing') {
      if (robotRef.current) {
        const lookAtPos = new THREE.Vector3(0,2,0);
        state.camera.position.x = 0;
        state.camera.position.y = 5;
        state.camera.position.z = 10;
        state.camera.lookAt(lookAtPos);
      }
      return;
    }

    elapsedTime.current += delta;

    if (jumpCooldown.current > 0) {
      jumpCooldown.current -= delta;
      if (jumpCooldown.current < 0) { 
        jumpCount.current = 2;
        jumpCooldown.current = 0;
      }
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
    }
    
    const initialSpeed = 8;
    const speedRamp = 0.1;
    const speed = initialSpeed + elapsedTime.current * speedRamp;
    
    if(robotRef.current) {
      robotRef.current.position.z -= delta * speed;
    }
    
    // Camera logic
    if (robotRef.current) {
        state.camera.position.z = robotRef.current.position.z + 10;
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, robotRef.current.position.x, delta * 2);
        
        const lookAtTarget = new THREE.Vector3(
        robotRef.current.position.x,
        2, 
        robotRef.current.position.z
        );
        state.camera.lookAt(lookAtTarget);
    }


    if (roadSegment1Ref.current && roadSegment1Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment1Ref.current.position.z -= ROAD_LENGTH * 2;
    }
    if (roadSegment2Ref.current && roadSegment2Ref.current.position.z > state.camera.position.z + ROAD_LENGTH / 2) {
      roadSegment2Ref.current.position.z -= ROAD_LENGTH * 2;
    }

    spawnTimer.current -= delta;
    const initialSpawnRate = 2.0;
    const minSpawnRate = 0.5;
    const spawnRateRamp = 0.02;
    const currentSpawnRate = Math.max(minSpawnRate, initialSpawnRate - elapsedTime.current * spawnRateRamp);

    if (spawnTimer.current <= 0) { 
        spawnTimer.current = currentSpawnRate + (Math.random() - 0.5) * 0.8;
        const lane = Math.floor(Math.random() * NUM_LANES);
        const laneX = (lane - 1) * LANE_WIDTH;
        
        if (robotRef.current) {
          carsRef.current.push({
              id: nextCarId++,
              position: new THREE.Vector3(laneX, 0, robotRef.current.position.z - 150),
              ref: React.createRef<THREE.Group>(),
              box: new THREE.Box3(),
          });
          setIteration(i => i + 1);
        }
    }
    
    if (robotRef.current) {
        playerBox.setFromObject(robotRef.current);
    }
    

    const activeCars: CarData[] = [];
    let scoredThisFrame = false;
    for (const car of carsRef.current) {
        if(car.ref.current) {
            car.ref.current.position.z += speed * delta * 1.5; // Cars move towards player
        }

        if (car.position.z > state.camera.position.z + 10) {
            if (!scoredThisFrame) {
                score.current++;
                setScore(score.current);
                scoredThisFrame = true;
            }
            continue; 
        }

        if (car.ref.current) {
            car.box.setFromObject(car.ref.current);
            if (playerBox.intersectsBox(car.box)) {
                if(playerBox.min.y < car.box.max.y) {
                    setGameState('gameOver');
                }
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
      if (jumpCooldown.current <= 0 && jumpCount.current < 2) { // Start cooldown only if it's not already running
        jumpCooldown.current = JUMP_COOLDOWN_SECONDS;
      }
      setJumpState({ count: jumpCount.current, cooldown: jumpCooldown.current });
      return true;
    }
    return false;
  };
  
  return (
    <>
      {gameState === 'playing' && (
        <CharacterModel ref={robotRef} selectedCharacter={selectedCharacter} gameState={gameState} onJump={handleJump} />
      )}
      
      {(gameState === 'menu' || gameState === 'characterSelect') && <Garage character={selectedCharacter} />}
      
      {gameState !== 'menu' && gameState !== 'characterSelect' && (
        <>
            <RoadSegment fRef={roadSegment1Ref} position={[0,0,0]} />
            <RoadSegment fRef={roadSegment2Ref} position={[0,0,-ROAD_LENGTH]} />
        </>
      )}

      {carsRef.current.map(car => (
          <CarModel key={car.id} fRef={car.ref} position={car.position} />
      ))}
    </>
  );
}
