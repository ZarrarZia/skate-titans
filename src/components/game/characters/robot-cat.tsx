
'use client';

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/components/game/game-canvas';
import type { GameState } from '@/app/play/page';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const JUMP_HEIGHT = 5;
const GRAVITY = -20;

interface RobotProps {
  gameState: GameState;
  onJump?: () => boolean;
}

export const RobotCat = forwardRef<THREE.Group, RobotProps>(({ gameState, onJump }, ref) => {
  const internalRobotRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => internalRobotRef.current);
  
  const tailRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const frontLeftLeg = useRef<THREE.Group>(null);
  const frontRightLeg = useRef<THREE.Group>(null);
  const backLeftLeg = useRef<THREE.Group>(null);
  const backRightLeg = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const yVelocity = useRef(0);

  const currentLane = useRef(1);
  const targetX = useRef(0);
  const moveRequest = useRef<'left' | 'right' | null>(null);

  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);

  const elapsedTime = useRef(0);

  useFrame((state, delta) => {
    if (!internalRobotRef.current || !tailRef.current || !headRef.current || !frontLeftLeg.current || !frontRightLeg.current || !backLeftLeg.current || !backRightLeg.current) return;
    
    elapsedTime.current = state.clock.getElapsedTime();
    const groundPosition = 0.6;

    if (gameState === 'gameOver') return;

    if (gameState === 'playing') {
      if (rightPressed && moveRequest.current !== 'right') moveRequest.current = 'right';
      else if (leftPressed && moveRequest.current !== 'left') moveRequest.current = 'left';

      if (!rightPressed && !leftPressed && moveRequest.current) {
        if (moveRequest.current === 'right' && currentLane.current < NUM_LANES - 1) currentLane.current++;
        if (moveRequest.current === 'left' && currentLane.current > 0) currentLane.current--;
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
        if (isJumping) setIsJumping(false);
    }
    
    internalRobotRef.current.position.x = THREE.MathUtils.lerp(internalRobotRef.current.position.x, targetX.current, delta * 15);
    
    // Animations
    tailRef.current.rotation.x = Math.sin(elapsedTime.current * 5) * 0.5 + 0.5;
    
    if (gameState === 'playing' && !isJumping) {
        const runCycle = Math.sin(elapsedTime.current * 15);
        frontLeftLeg.current.rotation.x = runCycle * 1.2;
        backRightLeg.current.rotation.x = runCycle * 1.2;
        frontRightLeg.current.rotation.x = -runCycle * 1.2;
        backLeftLeg.current.rotation.x = -runCycle * 1.2;
        internalRobotRef.current.position.y = Math.abs(runCycle) * 0.05 + groundPosition;
    } else if (isJumping) {
        frontLeftLeg.current.rotation.x = -Math.PI / 4;
        backRightLeg.current.rotation.x = -Math.PI / 4;
        frontRightLeg.current.rotation.x = Math.PI / 4;
        backLeftLeg.current.rotation.x = Math.PI / 4;
    } else { // Idle
        headRef.current.rotation.y = Math.sin(elapsedTime.current * 0.7) * 0.3;
        internalRobotRef.current.position.y = Math.sin(elapsedTime.current * 2) * 0.02 + groundPosition;
    }
  });

  const bodyMaterial = <meshStandardMaterial color="#DDDDDD" metalness={1.0} roughness={0.2} />;
  const highlightMaterial = <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={4} toneMapped={false} />;

  return (
    <group 
        ref={internalRobotRef} 
        castShadow 
        position={[0, 0, 0]}
        scale={0.9}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
    >
      {/* Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.6, 1.5]} />
        {bodyMaterial}
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.6, -0.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
          {bodyMaterial}
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.1, 0.25]}>
          <boxGeometry args={[0.1, 0.2, 0.05]} />
          {highlightMaterial}
        </mesh>
        <mesh position={[0.15, 0.1, 0.25]}>
          <boxGeometry args={[0.1, 0.2, 0.05]} />
          {highlightMaterial}
        </mesh>
        {/* Ears */}
         <mesh position={[-0.25, 0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.2, 0.3, 3]} />
            {bodyMaterial}
        </mesh>
         <mesh position={[0.25, 0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.2, 0.3, 3]} />
            {bodyMaterial}
        </mesh>
      </group>

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.6, 0.8]}>
         <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.8]} />
            {bodyMaterial}
        </mesh>
         <mesh castShadow position={[0, 0, 0.4]}>
            <sphereGeometry args={[0.1]} />
            {highlightMaterial}
        </mesh>
      </group>
      
      {/* Legs */}
      <group ref={frontLeftLeg} position={[-0.3, -0.1, -0.5]}>
        <mesh castShadow position-y={0}><boxGeometry args={[0.2, 0.8, 0.2]} />{bodyMaterial}</mesh>
      </group>
      <group ref={frontRightLeg} position={[0.3, -0.1, -0.5]}>
        <mesh castShadow position-y={0}><boxGeometry args={[0.2, 0.8, 0.2]} />{bodyMaterial}</mesh>
      </group>
      <group ref={backLeftLeg} position={[-0.3, -0.1, 0.5]}>
        <mesh castShadow position-y={0}><boxGeometry args={[0.2, 0.8, 0.2]} />{bodyMaterial}</mesh>
      </group>
      <group ref={backRightLeg} position={[0.3, -0.1, 0.5]}>
        <mesh castShadow position-y={0}><boxGeometry args={[0.2, 0.8, 0.2]} />{bodyMaterial}</mesh>
      </group>
    </group>
  );
});

RobotCat.displayName = "RobotCat";
