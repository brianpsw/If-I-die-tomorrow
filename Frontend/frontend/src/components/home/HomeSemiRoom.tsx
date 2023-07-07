import React, { MutableRefObject, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useTexture } from '@react-three/drei';

function HomeScene() {
  const category = useRecoilValue(categoryState);
  const navigate = useNavigate();
  const { gl, mouse } = useThree();
  // 기본 구성
  const fox = useGLTF('models/fox_2.glb');
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
  // 썸네일 구를 눌렀을 때 해당 카테고리 url로 이동하는 이벤트
  const clickStar = (e: any, id: number) => {
    if (!preventDragClick) navigate(`/photo-cloud/${id}`);
    e?.stopPropagation();
  };
  // 여우의 배를 눌렀을 때 애니메이션이 발동하는 이벤트
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
  // 여우의 왼쪽 장미를 눌렀을 때 애니메이션이 발동하는 이벤트
  const clickRose = (e: any) => {
    const tailMove = mixer.clipAction(fox.animations[3]);
    default1.stop();
    tailMove.loop = THREE.LoopOnce;
    tailMove.play();
    setTimeout(() => {
      tailMove.stop();
      default1.play();
    }, 2400);
    e?.stopPropagation();
  };
  // 현재 마우스의 위치를 파악하는 함수
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

  // 카테고리 썸네일 구의 위치
  const spherePosition = [
    [-60, -10, -20],
    [5, 32, -10],
    [10, 22, -30],
    [-10, -10, -20],
    [-15, 5, -10],
    [5, 0, -30],
    [-55, -30, -30],
    [-40, 15, -20],
    [10, -20, -20],
    [-50, -40, -10],
  ];

  return (
    <Suspense>
      <directionalLight position={[200, 50, 100]} intensity={1.2} />
      <ambientLight intensity={0.6} />
      <mesh rotation={[0, 0, 0]} position={[10, -78, 10]}>
        <sphereGeometry args={[50, 16]} />
        <meshStandardMaterial color="yellow" map={moonTexture} />
      </mesh>
      {category && typeof category === 'object' && category.length > 0 ? (
        <>
          {category.map((cat, idx) => {
            const position = new THREE.Vector3(...spherePosition[idx]);
            const texture = new THREE.TextureLoader().load(cat.imageUrl);

            return (
              <group key={cat.categoryId}>
                <mesh
                  rotation={[0, Math.PI / 4, 0]}
                  position={position}
                  onClick={(e) => clickStar(e, cat.categoryId)}
                >
                  <boxGeometry args={[12, 12, 12]} />
                  <meshStandardMaterial opacity={0} transparent={true} />
                </mesh>

                <mesh rotation={[0, -Math.PI / 4, 0]} position={position}>
                  <sphereGeometry args={[5, 16]} />
                  <meshStandardMaterial map={texture} />
                </mesh>
              </group>
            );
          })}
        </>
      ) : (
        <mesh
          rotation={[0, Math.PI / 4, 0]}
          position={[0, 0, 0]}
          onClick={() => navigate('/photo-cloud/create-category')}
        >
          <planeGeometry args={[50, 9, 1]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={createTexture} />
        </mesh>
      )}

      <primitive
        object={fox.scene}
        scale={window.innerWidth > 640 ? [8, 8, 8] : [6, 6, 6]}
        position={window.innerWidth > 640 ? [20, -19.5, 20] : [15, -21, 15]}
        rotation={[0, -Math.PI / 4, 0]}
        onClick={(e: any) => clickFox(e)}
      />

      <primitive
        object={rose.scene}
        scale={window.innerWidth > 640 ? [120, 120, 120] : [90, 90, 90]}
        position={[1, -30, 23]}
        rotation={[Math.PI / 10, -Math.PI / 4, 0]}
        onClick={(e: any) => clickRose(e)}
      />

      <OrbitControls />
    </Suspense>
  );
}

function HomeSemiRoom() {
  return (
    <Canvas
      style={{ height: 'calc(100vh + 20px)' }}
      orthographic
      camera={{
        position: [10, 5, 10],
        near: -1000,
        far: 1000,
        zoom: 5,
      }}
    >
      <HomeScene />
    </Canvas>
  );
}

export default HomeSemiRoom;
