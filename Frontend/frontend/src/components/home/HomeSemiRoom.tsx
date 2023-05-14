import React, { useState, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture } from '@react-three/drei';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface CategoryInfo {
  categoryId: number;
  name: string;
  userId: number;
  imageUrl: string;
}

function Scene() {
  const [category, setCategory] = useRecoilState(categoryState);
  const navigate = useNavigate();
  const { gl, mouse, scene } = useThree();
  // 기본 구성
  const fox = useGLTF('models/fox.glb', true);
  const rose = useGLTF('models/low_poly_rose_in_glass_jar.glb', true);
  const moonTexture = useTexture('images/squre_moon.png');
  const createTexture = useTexture('images/category_create.png');

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clickStar = (e: any, id: number) => {
    if (!preventDragClick) navigate(`/photo-cloud/${id}`);
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

  const spherePosition = [
    [25, 3, -10],
    [10, 20, -10],
    [10, 20, -30],
    [-10, -10, -20],
    [-25, 3, -10],
    [5, 0, 30],
    [-10, 3, 30],
    [-10, 25, 20],
    [40, 0, 20],
    [3, -15, 50],
  ];

  return (
    <Suspense fallback={<div>loading...</div>}>
      <directionalLight position={[200, 50, 100]} intensity={1.2} />
      <ambientLight intensity={0.6} />
      <mesh rotation={[0, 0, 0]} position={[10, -78, 10]}>
        <sphereGeometry args={[50, 16]}></sphereGeometry>
        <meshStandardMaterial color="yellow" map={moonTexture} />
      </mesh>
      {category && category.length > 0 ? (
        <>
          {category.map((cat, idx) => {
            const position = new THREE.Vector3(...spherePosition[idx]);
            const texture = new THREE.TextureLoader().load(cat.imageUrl);
            return (
              <mesh
                rotation={[0, 0, 0]}
                position={position}
                onClick={(e) => clickStar(e, cat.categoryId)}
              >
                <sphereGeometry args={[5, 16]}></sphereGeometry>
                <meshStandardMaterial map={texture} />
              </mesh>
            );
          })}
        </>
      ) : (
        <mesh
          rotation={[0, Math.PI / 4, 0]}
          position={[0, 0, 0]}
          onClick={() => navigate('/photo-cloud/create-category')}
        >
          <planeGeometry args={[50, 9, 1]}></planeGeometry>
          <meshStandardMaterial side={THREE.DoubleSide} map={createTexture} />
        </mesh>
      )}

      <primitive
        object={fox.scene}
        scale={window.innerWidth > 640 ? [8, 8, 8] : [6, 6, 6]}
        position={window.innerWidth > 640 ? [20, -19.5, 20] : [15, -22, 15]}
        rotation={[0, -Math.PI / 4, 0]}
        onClick={(e: any) => clickFox(e)}
      />

      <primitive
        object={rose.scene}
        scale={window.innerWidth > 640 ? [120, 120, 120] : [90, 90, 90]}
        position={window.innerWidth > 640 ? [1, -30, 23] : [1, -30, 23]}
        rotation={[Math.PI / 10, -Math.PI / 4, 0]}
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
