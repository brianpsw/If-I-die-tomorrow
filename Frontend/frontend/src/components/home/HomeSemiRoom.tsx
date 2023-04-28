import React, { useState, Suspense } from 'react';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function HomeSemiRoom() {
  const room3d = useGLTF('models/low_poly_room.glb', true);
  const heart = useGLTF('models/heart.glb', true);
  const meshes = [...room3d.scene.children, ...heart.scene.children];

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const clickRoom = () => {
    console.log('room click');
  };

  const clickHeart = () => {
    console.log('heart click');
  };

  // 카메라랑 마우스랑 교차되서 제일 위에 있는 물체만 선택되도록 하고 싶은데..안돼
  // const checkIntersects = () => {
  // raycaster.setFromCamera(mouse, camera);

  //   const intersects = raycaster.intersectObjects(meshes, true);
  //   console.log('inter', intersects);
  //   for (const item of intersects) {
  //     console.log(item.object.name);
  //     if (item.object.name === 'Marble_Marble_0') {
  //       clickRoom();
  //     } else if (item.object.name === 'Heart_heart_0') {
  //       clickHeart();
  //     }
  //     break;
  //   }
  // };

  const clickCanvas = (e: any) => {
    mouse.x = (e.clientX / 390) * 2 - 1;
    mouse.y = -((e.clientY / 770) * 2 - 1);

    // checkIntersects();
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
          onClick={clickHeart}
        />
        <primitive
          object={room3d.scene}
          scale={[0.6, 0.8, 0.6]}
          position={[0, -200, 0]}
          onClick={clickRoom}
        />

        {/* <OrbitControls /> */}
      </Suspense>
    </Canvas>
  );
}

export default HomeSemiRoom;
