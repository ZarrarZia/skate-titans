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
  const headRef = useRef<THREE.Group>(null);

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
    const leftEye = headRef.current.children[1] as THREE.Mesh;
    const rightEye = headRef.current.children[2] as THREE.Mesh;
    const eyeBlink = Math.abs(Math.sin(elapsedTime * 2));
    if (leftEye && rightEye) {
        (leftEye.material as THREE.MeshStandardMaterial).emissiveIntensity = eyeBlink * 4 + (hovered ? 2 : 0);
        (rightEye.material as THREE.MeshStandardMaterial).emissiveIntensity = eyeBlink * 4 + (hovered ? 2 : 0);
    }
    
    // Slight body bob
    robotRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.05 + 1.2;
  });

  const handlePointerEnter = () => {
    setHovered(true);
    setWaving(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setWaving(false);
  };
  
  const bodyMaterial = <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />;

  return (
    <group 
        ref={robotRef} 
        castShadow 
        position={[0, 1.2, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={() => setWaving(!waving)}
        scale={1.2}
    >
      {/* Torso */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 1, 0.6]} />
        {bodyMaterial}
      </mesh>
      {/* Abdomen */}
      <mesh castShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.5]} />
        {bodyMaterial}
      </mesh>
       {/* Hips */}
       <mesh castShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.55]} />
        {bodyMaterial}
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          {bodyMaterial}
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="aqua" emissive="aqua" emissiveIntensity={3} toneMapped={false}/>
        </mesh>
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="aqua" emissive="aqua" emissiveIntensity={3} toneMapped={false}/>
        </mesh>
      </group>

      {/* Shoulders */}
       <mesh castShadow position={[-0.6, 0.75, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        {bodyMaterial}
      </mesh>
       <mesh castShadow position={[0.6, 0.75, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        {bodyMaterial}
      </mesh>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.6, 0.2, 0]}>
         <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            {bodyMaterial}
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
            <boxGeometry args={[0.25, 0.5, 0.25]} />
            {bodyMaterial}
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[0.6, 0.2, 0]}>
         <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            {bodyMaterial}
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
            <boxGeometry args={[0.25, 0.5, 0.25]} />
            {bodyMaterial}
        </mesh>
      </group>
      
       {/* Legs */}
      <group position={[-0.25, -0.8, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            {bodyMaterial}
        </mesh>
        <mesh castShadow position={[0, -0.65, 0]}>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            {bodyMaterial}
        </mesh>
      </group>
      <group position={[0.25, -0.8, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            {bodyMaterial}
        </mesh>
        <mesh castShadow position={[0, -0.65, 0]}>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            {bodyMaterial}
        </mesh>
      </group>
    </group>
  );
}
