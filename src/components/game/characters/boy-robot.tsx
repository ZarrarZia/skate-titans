
'use client';

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/components/game/game-canvas';
import type { GameState } from '@/app/play/page';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const JUMP_HEIGHT = 4;
const GRAVITY = -15;

interface RobotProps {
  gameState: GameState;
  onJump?: () => boolean;
}

export const BoyRobot = forwardRef<THREE.Group, RobotProps>(({ gameState, onJump }, ref) => {
  const internalRobotRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => internalRobotRef.current);

  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const [waving, setWaving] = useState(false);
  
  const [isJumping, setIsJumping] = useState(false);
  const yVelocity = useRef(0);

  const currentLane = useRef(1); // 0: left, 1: middle, 2: right
  const targetX = useRef(0);
  const moveRequest = useRef<'left' | 'right' | null>(null);

  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);

  const elapsedTime = useRef(0);


  useFrame((state, delta) => {
    if (!internalRobotRef.current || !rightArmRef.current || !leftArmRef.current || !headRef.current) return;
    
    elapsedTime.current = state.clock.getElapsedTime();
    const groundPosition = 1.2;

    if (gameState === 'gameOver') {
        return;
    }

    if (gameState === 'playing') {
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
      
      if (jumpPressed && !isJumping) {
        if (onJump && onJump()) {
            yVelocity.current = Math.sqrt(-2 * GRAVITY * JUMP_HEIGHT);
            setIsJumping(true);
        }
      }
      
      if (isJumping) {
        yVelocity.current += GRAVITY * delta;
        internalRobotRef.current.position.y += yVelocity.current * delta;
        
        if (internalRobotRef.current.position.y <= groundPosition) {
            internalRobotRef.current.position.y = groundPosition;
            setIsJumping(false);
        }
      }

    } else {
        currentLane.current = 1;
        targetX.current = 0;
        internalRobotRef.current.position.y = groundPosition;
        if (isJumping) {
             internalRobotRef.current.position.y = groundPosition;
            setIsJumping(false);
        }
    }
    
    internalRobotRef.current.position.x = THREE.MathUtils.lerp(internalRobotRef.current.position.x, targetX.current, delta * 10);
    
    // Animations
    if (gameState === 'playing' && !isJumping) {
        const runCycle = Math.sin(elapsedTime.current * 10);
        rightArmRef.current.rotation.x = runCycle * 0.8;
        leftArmRef.current.rotation.x = -runCycle * 0.8;
        internalRobotRef.current.position.y = Math.abs(runCycle) * 0.1 + groundPosition;
    } else if (isJumping) {
        rightArmRef.current.rotation.x = -Math.PI / 4;
        leftArmRef.current.rotation.x = Math.PI / 4;
    } else { // Idle / Character Select
        if (!waving) {
          rightArmRef.current.rotation.x = Math.sin(elapsedTime.current * 2) * 0.2;
          leftArmRef.current.rotation.x = -Math.sin(elapsedTime.current * 2) * 0.2;
        } else {
            leftArmRef.current.rotation.x = 0;
            rightArmRef.current.rotation.z = Math.sin(elapsedTime.current * 10) * 0.5 + 0.5;
            rightArmRef.current.rotation.x = -Math.PI / 2;
        }
        internalRobotRef.current.position.y = Math.sin(elapsedTime.current * 1.5) * 0.05 + groundPosition;
    }

    const leftEye = headRef.current.children[1] as THREE.Mesh;
    const rightEye = headRef.current.children[2] as THREE.Mesh;
    const eyeBlink = Math.abs(Math.sin(elapsedTime.current * 2));
    if (leftEye && rightEye) {
        (leftEye.material as THREE.MeshStandardMaterial).emissiveIntensity = eyeBlink * 4 + (hovered ? 2 : 0);
        (rightEye.material as THREE.MeshStandardMaterial).emissiveIntensity = eyeBlink * 4 + (hovered ? 2 : 0);
    }
  });

  const handlePointerEnter = () => {
    if (gameState !== 'characterSelect') return;
    setHovered(true);
  };

  const handlePointerLeave = () => {
    if (gameState !== 'characterSelect') return;
    setHovered(false);
  };
  
  const handleClick = () => {
    if (gameState !== 'characterSelect') return;
    setWaving(!waving);
  }
  
  const bodyMaterial = <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.3} />;
  const highlightMaterial = <meshStandardMaterial color="#0077ff" emissive="#0077ff" emissiveIntensity={2} toneMapped={false}/>

  return (
    <group 
        ref={internalRobotRef} 
        castShadow 
        position={[0, 0, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
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
          {highlightMaterial}
        </mesh>
        <mesh position={[0.15, 0.1, 0.35]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          {highlightMaterial}
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
         <mesh castShadow position={[0, -1.05, 0.1]}>
            <boxGeometry args={[0.35, 0.1, 0.6]} />
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
         <mesh castShadow position={[0, -1.05, 0.1]}>
            <boxGeometry args={[0.35, 0.1, 0.6]} />
            {bodyMaterial}
        </mesh>
      </group>
    </group>
  );
});
BoyRobot.displayName = "BoyRobot";
