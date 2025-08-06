'use client';

import { AnimatedRobot } from '@/components/game/animated-robot';

function Ground() {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export function GameScene() {
  return (
    <>
      <AnimatedRobot />
      <Ground />
    </>
  );
}
