import React, { useState, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface CategoryInfo {
  categoryId: number;
  name: string;
  objectId: number;
}

function Scene() {
  // const [preventDragClick, setPreventDragClick] = useState<boolean>(false);
  const [category, setCategory] = useRecoilState(categoryState);
  const navigate = useNavigate();
  const [objectIds, setObjectIds] = useState<number[]>([]);
  const { gl, mouse } = useThree();
  // 기본 구성
  const roomFrame = useGLTF('models/room_frame.glb', true);
  const fox = useGLTF('models/fox.glb', true);
  const bed = useGLTF('models/bed.glb', true); // 1
  const coffeetable = useGLTF('models/coffeetable.glb', true); // 2
  const bookShelf = useGLTF('models/bookshelf.glb', true); // 3
  const deskChair = useGLTF('models/desk_chair.glb', true); // 4
  // 추가 구성
  const board = useGLTF('models/board.glb', true);
  const carpet = useGLTF('models/carpet.glb', true);
  const pc = useGLTF('models/pc.glb', true);
  const sofa = useGLTF('models/sofa.glb', true);
  const wallShelf = useGLTF('models/wallshelf.glb', true);
  const cat = useGLTF('models/cat.glb', true);

  let mixer = new THREE.AnimationMixer(fox.scene);
  let preventDragClick: boolean = false;
  const default1 = mixer.clipAction(fox.animations[0]);
  default1.play();

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  const fetchData = async () => {
    try {
      const get_all_category = await defaultApi.get(
        requests.GET_ALL_CATEGORY(),
        {
          withCredentials: true,
        },
      );
      if (get_all_category.status === 200) {
        setCategory(get_all_category.data);
        const arr: number[] = [];
        category?.forEach((category: CategoryInfo) => {
          arr.push(category.objectId);
        });
        setObjectIds([...arr]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clickRoom = (e: any) => {
    if (!preventDragClick) navigate('/room');

    e?.stopPropagation();
  };

  const clickFox = (e: any) => {
    const earMove = mixer.clipAction(fox.animations[1]);
    default1.stop();
    earMove.loop = THREE.LoopOnce;
    earMove.play();
    setTimeout(() => {
      earMove.stop();
      default1.play();
    }, 1200);
    e?.stopPropagation();
  };

  const calculateMousePosition = (e: any) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  let clickStartTime: any;

  // 마우스 이벤트

  gl.domElement.addEventListener('mousedown', (e) => {
    calculateMousePosition(e);
    clickStartTime = Date.now();
  });

  gl.domElement.addEventListener('mouseup', (e) => {
    const nowX = (e.clientX / window.innerWidth) * 2 - 1;
    const nowY = -((e.clientY / window.innerHeight) * 2 - 1);
    const xGap = nowX - mouse.x;
    const yGap = nowY - mouse.y;

    const timeGap = Date.now() - clickStartTime;

    if (xGap > 5 || yGap > 5 || timeGap > 100) {
      preventDragClick = true;
    } else {
      preventDragClick = false;
    }
  });

  return (
    <Suspense fallback={<div>loading...</div>}>
      <directionalLight position={[200, 50, 100]} intensity={1.2} />
      <ambientLight intensity={0.6} />

      <primitive
        object={roomFrame.scene}
        scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
        position={[0, -30, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e: any) => clickRoom(e)}
      />
      {objectIds?.includes(1) && (
        <primitive
          object={bed.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(2) && (
        <primitive
          object={coffeetable.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[-10, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(3) && (
        <primitive
          object={bookShelf.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(4) && (
        <primitive
          object={deskChair.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(5) && (
        <primitive
          object={board.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(6) && (
        <primitive
          object={carpet.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[-10, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(7) && (
        <primitive
          object={pc.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(8) && (
        <primitive
          object={sofa.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(9) && (
        <primitive
          object={wallShelf.scene}
          scale={window.innerWidth > 640 ? [10, 10, 10] : [6, 6, 6]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(10) && (
        <primitive
          object={cat.scene}
          scale={window.innerWidth > 640 ? [3.5, 3.5, 3.5] : [1, 1, 1]}
          position={[30, -27.5, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}

      <primitive
        object={fox.scene}
        scale={window.innerWidth > 640 ? [8, 8, 8] : [6, 6, 6]}
        position={window.innerWidth > 640 ? [20, -19.5, 20] : [15, -22, 15]}
        rotation={[0, -Math.PI / 4, 0]}
        onClick={(e: any) => clickFox(e)}
      />

      <OrbitControls />
    </Suspense>
  );
}

function HomeSemiRoom() {
  return (
    <Canvas
      style={{ width: '100vw', height: '94vh' }}
      orthographic
      camera={{
        position: [10, 5, 10],
        near: -1000,
        far: 1000,
        zoom: 5,
      }}
    >
      <Scene />
    </Canvas>
  );
}

export default HomeSemiRoom;
