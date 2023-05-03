import React, { useState, Suspense } from 'react';

import { useNavigate } from 'react-router';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function HomeSemiRoom() {
  const navigate = useNavigate();
  const room3d = useGLTF('models/low_poly_room.glb', true);
  const heart = useGLTF('models/heart.glb', true);
  const meshes = [...room3d.scene.children, ...heart.scene.children];

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const clickRoom = (e: any) => {
    navigate('/photo-cloud/1');
    e?.stopPropagation();
  };

  const clickHeart = (e: any) => {
    navigate('/photo-cloud/4');
    e?.stopPropagation();
  };

  return (
    <Canvas
      style={{ width: '100vw', height: '92vh' }}
      orthographic
      camera={{
        position: [500, 300, 500],
      }}
    >
      <Suspense fallback={<div>loading...</div>}>
        <directionalLight position={[30, 50, 100]} intensity={1.2} />

        <primitive
          object={heart.scene}
          scale={[0.3, 0.3, 0.3]}
          onClick={(e: any) => clickHeart(e)}
        />
        <primitive
          object={room3d.scene}
          scale={[0.6, 0.8, 0.6]}
          position={[0, -200, 0]}
          onClick={(e: any) => clickRoom(e)}
        />

        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default HomeSemiRoom;
