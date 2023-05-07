import React, { useState, Suspense, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface PreventDragClick {
  preventDragClick: boolean;
  setPreventDragClick: React.Dispatch<React.SetStateAction<boolean>>;
}

function Scene(props: PreventDragClick) {
  const navigate = useNavigate();
  const roomFrame = useGLTF('models/room_frame.glb', true);
  const bed = useGLTF('models/bed.glb', true);
  const board = useGLTF('models/board.glb', true);
  const bookShelf = useGLTF('models/bookshelf.glb', true);
  const carpet = useGLTF('models/carpet.glb', true);
  const coffeetable = useGLTF('models/coffeetable.glb', true);
  const deskChair = useGLTF('models/desk_chair.glb', true);
  const pc = useGLTF('models/pc.glb', true);
  const sofa = useGLTF('models/sofa.glb', true);
  const wallShelf = useGLTF('models/wallshelf.glb', true);
  // const cat = useGLTF('models/cat.gltf', true);

  const fox = useGLTF('models/fox_ani.glb', true);

  let mixer = new THREE.AnimationMixer(fox.scene);

  const action = mixer.clipAction(fox.animations[0]);
  action.play();

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  const clickRoom = (e: any) => {
    if (props.preventDragClick) navigate('/room');
    e?.stopPropagation();
  };

  return (
    <Suspense fallback={<div>loading...</div>}>
      <directionalLight position={[200, 50, 100]} intensity={1.2} />
      <ambientLight intensity={0.6} />

      <primitive
        object={roomFrame.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e: any) => clickRoom(e)}
      />
      <primitive
        object={bed.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={board.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={bookShelf.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={carpet.scene}
        scale={[10, 10, 10]}
        position={[-10, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={coffeetable.scene}
        scale={[10, 10, 10]}
        position={[-10, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={deskChair.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={pc.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={sofa.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={wallShelf.scene}
        scale={[10, 10, 10]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <primitive
        object={fox.scene}
        scale={[8, 8, 8]}
        position={[20, -19.5, 20]}
        rotation={[0, -Math.PI / 4, 0]}
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
      style={{ width: '100vw', height: '94vh' }}
      orthographic
      camera={{
        position: [10, 5, 10],
        near: -1000,
        far: 1000,
        zoom: 5,
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
