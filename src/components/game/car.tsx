import * as React from 'react';
import * as THREE from 'three';

interface CarProps {
  carRef: React.RefObject<THREE.Group>;
  position: THREE.Vector3;
  color: string;
}

export function Car({ carRef, position, color }: CarProps) {
  return (
    <group ref={carRef} position={position}>
      {/* Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[0, 1.1, -0.5]}>
        <boxGeometry args={[1.8, 0.6, 2]} />
        <meshStandardMaterial color="lightblue" transparent opacity={0.6} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-1, 0.2, 1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[1, 0.2, 1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-1, 0.2, -1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[1, 0.2, -1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
