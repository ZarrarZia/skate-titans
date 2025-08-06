'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, KeyboardControls, type KeyboardControlsEntry, OrbitControls } from '@react-three/drei';
import { GameScene } from '@/components/game/game-scene';
import { Color } from 'three';

export enum Controls {
  left = 'left',
  right = 'right',
  forward = 'forward',
  backward = 'backward',
  jump = 'jump',
}

export function GameCanvas() {
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
      }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={60} />
          <ambientLight intensity={0.7} />
          <directionalLight
            castShadow
            position={[5, 10, 7]}
            intensity={2.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
           <pointLight position={[-5, 5, -5]} intensity={1} color="lightblue" />
          <GameScene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
