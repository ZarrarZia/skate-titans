'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { GameScene } from '@/components/game/game-scene';
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';

export enum Controls {
  left = 'left',
  right = 'right',
  forward = 'forward',
  backward = 'backward',
  jump = 'jump',
}

export default function PlayPage() {
    
  const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.left, keys: ['ArrowLeft', 'a', 'A'] },
    { name: Controls.right, keys: ['ArrowRight', 'd', 'D'] },
    { name: Controls.forward, keys: ['ArrowUp', 'w', 'W'] },
    { name: Controls.backward, keys: ['ArrowDown', 's', 'S'] },
    { name: Controls.jump, keys: ['Space'] },
  ];

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      <KeyboardControls map={map}>
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={1.5}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <GameScene />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
