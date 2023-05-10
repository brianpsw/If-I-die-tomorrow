import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface PreventDragClick {
  preventDragClick: boolean;
  setPreventDragClick: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CategoryInfo {
  categoryId: number;
  name: string;
  objectId: number;
}

function Scene(props: PreventDragClick) {
  const { preventDragClick } = props;
  const [category, setCategory] = useRecoilState(categoryState);
  const navigate = useNavigate();
  const [objectIds, setObjectIds] = useState<number[]>([]);
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
    if (preventDragClick) navigate('/room');
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
      {objectIds?.includes(1) && (
        <primitive
          object={bed.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(2) && (
        <primitive
          object={coffeetable.scene}
          scale={[10, 10, 10]}
          position={[-10, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(3) && (
        <primitive
          object={bookShelf.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(4) && (
        <primitive
          object={deskChair.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(5) && (
        <primitive
          object={board.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(6) && (
        <primitive
          object={carpet.scene}
          scale={[10, 10, 10]}
          position={[-10, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(7) && (
        <primitive
          object={pc.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(8) && (
        <primitive
          object={sofa.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(9) && (
        <primitive
          object={wallShelf.scene}
          scale={[10, 10, 10]}
          position={[0, -30, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}
      {objectIds?.includes(10) && (
        <primitive
          object={cat.scene}
          scale={[3.5, 3.5, 3.5]}
          position={[30, -27.5, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      )}

      <primitive
        object={fox.scene}
        scale={[8, 8, 8]}
        position={[20, -19.5, 20]}
        rotation={[0, -Math.PI / 4, 0]}
        onClick={(e: any) => clickFox(e)}
      />

      <OrbitControls />
    </Suspense>
  );
}

function HomeSemiRoom() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [preventDragClick, setPreventDragClick] = useState<boolean>(false);

  useEffect(() => {
    // console.log('home에서 prevent', preventDragClick);
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
