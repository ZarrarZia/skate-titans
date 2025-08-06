
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, KeyboardControls, type KeyboardControlsEntry } from '@react-three/drei';
import { GameScene } from '@/components/game/game-scene';
import { Color } from 'three';
import * as THREE from 'three';
import type { GameState, Character } from '@/app/play/page';

export enum Controls {
  left = 'left',
  right = 'right',
  forward = 'forward',
  backward = 'backward',
  jump = 'jump',
}

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (score: number) => void;
  setJumpState: (state: { count: number; cooldown: number }) => void;
  setScore: (score: number) => void;
  selectedCharacter: Character;
}

export function GameCanvas({ gameState, setGameState, setJumpState, setScore, selectedCharacter }: GameCanvasProps) {
  const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.left, keys: ['ArrowLeft', 'a', 'A'] },
    { name: Controls.right, keys: ['ArrowRight', 'd', 'D'] },
    { name: Controls.forward, keys: ['ArrowUp', 'w', 'W'] },
    { name: Controls.backward, keys: ['ArrowDown', 's', 'S'] },
    { name: Controls.jump, keys: ['Space'] },
  ];

  return (
    <KeyboardControls map={map}>
      <Canvas shadows onCreated={({ scene }) => {
        scene.background = new Color('#111');
        scene.fog = new THREE.Fog('black', 10, 50);
      }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
          <ambientLight intensity={0.8} />
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            intensity={2.0}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
           <pointLight position={[-10, 5, -10]} intensity={1} color="white" />
          <GameScene 
            gameState={gameState} 
            setGameState={setGameState} 
            setJumpState={setJumpState} 
            setScore={setScore} 
            selectedCharacter={selectedCharacter}
          />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
