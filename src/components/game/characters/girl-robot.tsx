
'use client';

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/components/game/game-canvas';
import type { GameState } from '@/app/play/page';

const LANE_WIDTH = 3;
const NUM_LANES = 3;
const JUMP_HEIGHT = 4.5;
const GRAVITY = -15;

interface RobotProps {
  gameState: GameState;
  onJump?: () => boolean;
}

export const GirlRobot = forwardRef<THREE.Group, RobotProps>(({ gameState, onJump }, ref) => {
  const internalRobotRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => internalRobotRef.current);
  
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

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
    if (!internalRobotRef.current || !headRef.current || !leftLegRef.current || !rightLegRef.current) return;
    
    elapsedTime.current = state.clock.getElapsedTime();
    const groundPosition = 1.1;

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
        if (isJumping) setIsJumping(false);
    }
    
    internalRobotRef.current.position.x = THREE.MathUtils.lerp(internalRobotRef.current.position.x, targetX.current, delta * 12); // Faster lane change
    
    // Animations
    if (gameState === 'playing' && !isJumping) {
        const runCycle = Math.sin(elapsedTime.current * 12);
        leftLegRef.current.rotation.x = runCycle * 0.8;
        rightLegRef.current.rotation.x = -runCycle * 0.8;
        internalRobotRef.current.position.y = Math.abs(runCycle) * 0.1 + groundPosition;
    } else if (isJumping) {
        leftLegRef.current.rotation.x = -Math.PI / 4;
        rightLegRef.current.rotation.x = Math.PI / 4;
    } else { // Idle
        const sway = Math.sin(elapsedTime.current * 1.5) * 0.1;
        internalRobotRef.current.rotation.y = sway * 0.2;
        headRef.current.rotation.y = -sway * 0.4;
        internalRobotRef.current.position.y = Math.sin(elapsedTime.current) * 0.05 + groundPosition;
    }

    const eye = headRef.current.getObjectByName("eye") as THREE.Mesh;
    if(eye) {
        const eyeBlink = Math.sin(elapsedTime.current * 3) > 0.95 ? 0 : 1;
        (eye.material as THREE.MeshStandardMaterial).emissiveIntensity = eyeBlink * 5 + (hovered ? 2 : 0);
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
  
  const bodyMaterial = <meshStandardMaterial color="#B0C4DE" metalness={0.9} roughness={0.4} />;
  const highlightMaterial = <meshStandardMaterial color="#BE29EC" emissive="#BE29EC" emissiveIntensity={3} toneMapped={false}/>

  return (
    <group 
        ref={internalRobotRef} 
        castShadow 
        position={[0, 0, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={1.1}
    >
      {/* Torso */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.0, 0.5]} />
        {bodyMaterial}
      </mesh>
       <mesh castShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 32]} />
        {bodyMaterial}
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          {bodyMaterial}
        </mesh>
        {/* Eye */}
        <mesh name="eye" position={[0, 0.05, 0.3]}>
          <planeGeometry args={[0.4, 0.15]} />
          {highlightMaterial}
        </mesh>
        {/* Antenna */}
        <mesh position={[0.2, 0.3, 0]} rotation-z={-0.2}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            {bodyMaterial}
        </mesh>
        <mesh position={[0.28, 0.68, 0]}>
            <sphereGeometry args={[0.05]} />
            {highlightMaterial}
        </mesh>
      </group>

      {/* Arms */}
      <mesh castShadow position={[-0.55, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        {bodyMaterial}
      </mesh>
      <mesh castShadow position={[0.55, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        {bodyMaterial}
      </mesh>
      
      {/* Legs */}
      <group ref={leftLegRef} position={[-0.2, -0.8, 0]}>
        <mesh castShadow position-y={0}>
            <boxGeometry args={[0.3, 1.2, 0.3]} />
            {bodyMaterial}
        </mesh>
         <mesh castShadow position={[0, -0.6, 0.15]}>
            <boxGeometry args={[0.3, 0.2, 0.6]} />
            {bodyMaterial}
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.2, -0.8, 0]}>
        <mesh castShadow position-y={0}>
            <boxGeometry args={[0.3, 1.2, 0.3]} />
            {bodyMaterial}
        </mesh>
         <mesh castShadow position={[0, -0.6, 0.15]}>
            <boxGeometry args={[0.3, 0.2, 0.6]} />
            {bodyMaterial}
        </mesh>
      </group>
    </group>
  );
});

GirlRobot.displayName = "GirlRobot";
