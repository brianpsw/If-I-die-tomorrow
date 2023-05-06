import React, { useState, Suspense, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface PreventDragClick {
  preventDragClick: boolean;
  setPreventDragClick: React.Dispatch<React.SetStateAction<boolean>>;
}

function Scene(props: PreventDragClick) {
  const navigate = useNavigate();
  const roomFrame = useGLTF('models/room_frame.glb', true);
  const heart = useGLTF('models/heart.glb', true);

  const clickRoom = (e: any) => {
    if (props.preventDragClick) navigate('/room');
    e?.stopPropagation();
  };

  const clickHeart = (e: any) => {
    if (props.preventDragClick) navigate('/photo-cloud/4');
    e?.stopPropagation();
  };

  return (
    <Suspense fallback={<div>loading...</div>}>
      {/* <directionalLight position={[30, 50, 100]} intensity={1.2} /> */}
      <ambientLight></ambientLight>
      <primitive
        object={heart.scene}
        scale={[0.3, 0.3, 0.3]}
        onClick={(e: any) => clickHeart(e)}
      />
      <primitive
        object={roomFrame.scene}
        scale={[50, 50, 50]}
        position={[50, -200, -50]}
        onClick={(e: any) => clickRoom(e)}
      />

      <OrbitControls />
    </Suspense>
  );
}

function HomeSemiRoom() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [preventDragClick, setPreventDragClick] = useState<boolean>(false);

  useEffect(() => {
    console.log('home에서 prevent', preventDragClick);
    let nowCanvas = canvas.current;
    let clickStartX: number;
    let clickStartY: number;
    let clickStartTime: number;

    nowCanvas?.addEventListener('mousedown', (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });

    nowCanvas?.addEventListener('mouseup', (e) => {
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;

      if (xGap > 1 || yGap > 1 || timeGap > 100) {
        setPreventDragClick(() => true);
      } else {
        setPreventDragClick(() => false);
      }
    });
  });

  return (
    <Canvas
      ref={canvas}
      style={{ width: '100vw', height: '92vh' }}
      orthographic
      camera={{
        position: [500, 300, 500],
      }}
    >
      <Scene
        preventDragClick={preventDragClick}
        setPreventDragClick={setPreventDragClick}
      />
    </Canvas>
  );
}

export default HomeSemiRoom;
