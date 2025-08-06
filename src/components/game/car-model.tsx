
'use client';
import * as React from 'react';
import * as THREE from 'three';

// Utility: get a random item from an array
const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Predefined car types
const carTypes = [
  {
    bodyLength: 2.5,
    bodyHeight: 0.6,
    bodyWidth: 1.2,
    type: 'sedan',
  },
  {
    bodyLength: 3.5,
    bodyHeight: 0.8,
    bodyWidth: 1.4,
    type: 'suv',
  },
  {
    bodyLength: 5,
    bodyHeight: 1.2,
    bodyWidth: 1.8,
    type: 'truck',
  },
];

// Color options
const carColors = ['#ff0000', '#0055ff', '#00cc66', '#ffff00', '#333333', '#9900cc'];

interface CarModelProps {
  fRef: React.RefObject<THREE.Group>;
  position: THREE.Vector3;
}

export function CarModel({ fRef, position }: CarModelProps) {
  const { type, color } = React.useMemo(() => ({
    type: randomFrom(carTypes),
    color: randomFrom(carColors),
  }), []);

  return (
    <group ref={fRef} position={position}>
      {/* Main Body */}
      <mesh castShadow position-y={type.bodyHeight / 2}>
        <boxGeometry args={[type.bodyWidth, type.bodyHeight, type.bodyLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cabin (for smaller cars) */}
      {type.type !== 'truck' && (
        <mesh position={[0, type.bodyHeight + type.bodyHeight / 3, -type.bodyLength * 0.1]}>
          <boxGeometry args={[type.bodyWidth * 0.9, type.bodyHeight * 0.8, type.bodyLength / 2]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      )}

      {/* Wheels */}
      {[-(type.bodyWidth / 2) - 0.1, (type.bodyWidth/2) + 0.1].map((x) =>
        [-(type.bodyLength / 2.5), (type.bodyLength/2.5)].map((z) => (
          <mesh
            key={`wheel-${x}-${z}`}
            position={[x, 0.25, z]}
            rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        ))
      )}
    </group>
  );
}
