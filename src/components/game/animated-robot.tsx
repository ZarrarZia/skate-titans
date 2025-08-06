'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/components/game/game-canvas';

const LANE_WIDTH = 3;
const NUM_LANES = 3;

export function AnimatedRobot() {
  const robotRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [waving, setWaving] = useState(false);

  const currentLane = useRef(1); // 0: left, 1: middle, 2: right
  const targetX = useRef(0);
  const moveRequest = useRef<'left' | 'right' | null>(null);

  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);

  useFrame((state, delta) => {
    if (!robotRef.current || !rightArmRef.current || !leftArmRef.current || !headRef.current) return;

    // -- Game Controls --
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
    robotRef.current.position.x = THREE.MathUtils.lerp(robotRef.current.position.x, targetX.current, delta * 10);

    // -- Animations --
    const elapsedTime = state.clock.getElapsedTime();

    // Idle arm sway
    if (!waving) {
      rightArmRef.current.rotation.x = Math.sin(elapsedTime * 2) * 0.2;
      leftArmRef.current.rotation.x = -Math.sin(elapsedTime * 2) * 0.2;
    } else {
        // Waving animation
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = Math.sin(elapsedTime * 10) * 0.5 + 0.5;
        rightArmRef.current.rotation.x = -Math.PI / 2;
    }

    // Eye blinking
    const eyeLid = headRef.current.children[2] as THREE.Mesh;
    const eyeBlink = Math.max(0, Math.sin(elapsedTime * 2 + 3) - 0.95) * 10;
    eyeLid.scale.set(1, eyeBlink, 1);
    
    // Slight body bob
    robotRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.05 + 1;

  });

  const handlePointerEnter = () => {
    setHovered(true);
    setWaving(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setWaving(false);
  };
  
  return (
    <group 
        ref={robotRef} 
        castShadow 
        position={[0, 1, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={() => setWaving(!waving)}
    >
      {/* Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color="gray" metalness={0.8} roughness={0.2} />
      </mesh>
       <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>


      {/* Head */}
      <group ref={headRef} position={[0, 1.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="aqua" emissive="blue" emissiveIntensity={hovered ? 5 : 2} />
        </mesh>
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="aqua" emissive="blue" emissiveIntensity={hovered ? 5 : 2} />
        </mesh>
      </group>

      {/* Arms */}
      <mesh ref={leftArmRef} castShadow position={[-0.6, 0.8, 0]} rotation={[0,0,0.2]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={rightArmRef} castShadow position={[0.6, 0.8, 0]} rotation={[0,0,-0.2]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      
       {/* Legs */}
      <mesh castShadow position={[-0.2, -0.6, 0]}>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0.2, -0.6, 0]}>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
