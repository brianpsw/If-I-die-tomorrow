import React, { useState, Suspense, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface PreventDragClick {
  preventDragClick: boolean;
}

function Scene(props: PreventDragClick) {
  const navigate = useNavigate();
  const roomFrame = useGLTF('models/room_frame.glb', true);
  const heart = useGLTF('models/heart.glb', true);

  const clickRoom = (e: any) => {
    if (!props.preventDragClick) navigate('/room');
    e?.stopPropagation();
  };

  const clickHeart = (e: any) => {
    if (!props.preventDragClick) navigate('/photo-cloud/4');
    e?.stopPropagation();
  };

  return (
    <Suspense fallback={<div>loading...</div>}>
      <directionalLight position={[30, 50, 100]} intensity={1.2} />

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
    let nowCanvas = canvas.current;
    let clickStartX: number;
    let clickStartY: number;
    let clickStartTime: number;

    nowCanvas?.addEventListener('mousemove', (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });

    nowCanvas?.addEventListener('mouseup', (e) => {
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;

      if (xGap > 5 || yGap > 5 || timeGap > 300) {
        setPreventDragClick(true);
      } else {
        setPreventDragClick(false);
      }
    });
  }, []);

  return (
    <Canvas
      ref={canvas}
      style={{ width: '100vw', height: '92vh' }}
      orthographic
      camera={{
        position: [500, 300, 500],
      }}
    >
      <Scene preventDragClick={preventDragClick} />
    </Canvas>
  );
}

export default HomeSemiRoom;
