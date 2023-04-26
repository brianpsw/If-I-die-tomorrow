import React from 'react';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function HomeSemiRoom() {
  const room3d = useGLTF('models/low_poly_room.glb', true);
  return (
    <Canvas
      style={{ width: '100vw', height: '92vh' }}
      orthographic
      camera={{
        position: [500, 300, 500],
      }}
    >
      <directionalLight position={[30, 50, 100]} intensity={1.2} />
      <primitive
        object={room3d.scene}
        scale={[0.6, 0.8, 0.6]}
        position={[0, -200, 0]}
      />
      <OrbitControls />
    </Canvas>
  );
}

export default HomeSemiRoom;
