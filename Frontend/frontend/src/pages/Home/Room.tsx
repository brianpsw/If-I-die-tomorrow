import React, { Suspense, useState, useRef, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { RGBAFormat } from 'three';

function Scene() {
  const navigate = useNavigate();
  const foxRef = useRef<THREE.Object3D>(null);
  const pointRef: RefObject<THREE.Mesh> = useRef(null);
  const { gl, scene, camera, raycaster, mouse } = useThree();
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [foxIsMoving, setFoxIsMoving] = useState<boolean>(false);
  // Texture
  const floorTexture = useTexture('images/test2.png');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.x = 1;
  floorTexture.repeat.y = 1;

  // canvas
  gl.setSize(window.innerWidth, window.innerHeight);
  gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  //Camera

  const cameraPosition = new THREE.Vector3(1, 5, 5);

  camera.zoom = 50;
  camera.updateProjectionMatrix();

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
    }),
  );
  floorMesh.name = 'floor';
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const diaryMesh = new THREE.Mesh(
    new THREE.CircleGeometry(5, 18),
    new THREE.MeshStandardMaterial({
      color: '',
      transparent: true,
      opacity: 0,
    }),
  );
  diaryMesh.position.set(-35, 0.005, -17.5);
  diaryMesh.rotation.x = -Math.PI / 2;
  diaryMesh.receiveShadow = true;
  scene.add(diaryMesh);

  const movetoMesh = new THREE.Mesh(
    new THREE.CircleGeometry(5, 5),
    new THREE.MeshStandardMaterial({
      color: 'black',
      transparent: true,
      opacity: 0.5,
    }),
  );
  movetoMesh.position.set(25, 0.005, 12);
  movetoMesh.rotation.x = -Math.PI / 2;
  movetoMesh.receiveShadow = true;
  scene.add(movetoMesh);

  const fox = useGLTF('models/fox.glb', true);
  const foxModelMesh = fox.scene.children[0];
  let mixer = new THREE.AnimationMixer(fox.scene);
  const action1 = mixer.clipAction(fox.animations[0]);
  const walk = mixer.clipAction(fox.animations[2]);
  action1.play();

  const diary = useGLTF('models/diary.glb', true);

  const checkIntersects = () => {
    const meshes = [floorMesh, foxModelMesh];
    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      if (item.object.name === 'floor') {
        if (pointRef.current) {
          pointRef.current.position.x = item.point.x;
          pointRef.current.position.z = item.point.z;
          foxModelMesh.lookAt(pointRef.current.position);
          foxModelMesh.rotateY(-Math.PI / 2);
        }

        setFoxIsMoving(() => true);
      }
      break;
    }
  };

  const raycasting = () => {
    raycaster.setFromCamera(mouse, camera);
    checkIntersects();
  };

  const calculateMousePosition = (e: any) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);

    if (foxRef.current) {
      camera.lookAt(foxRef.current.position);
    }

    if (foxModelMesh) {
      if (isPressed) {
        raycasting();
      }

      if (foxIsMoving && foxRef.current && pointRef.current) {
        let angle = Math.atan2(
          pointRef.current.position.z - foxRef.current!.position.z,
          pointRef.current.position.x - foxRef.current!.position.x,
        );

        foxRef.current.position.x += Math.cos(angle) * 0.1;
        foxRef.current.position.z += Math.sin(angle) * 0.1;

        camera.position.x = cameraPosition.x + foxRef.current.position.x;
        camera.position.z = cameraPosition.z + foxRef.current.position.z;

        action1.stop();
        walk.play();

        if (
          Math.abs(pointRef.current.position.x - foxRef.current.position.x) <
            0.5 &&
          Math.abs(pointRef.current.position.z - foxRef.current.position.z) <
            0.5
        ) {
          setFoxIsMoving(() => false);
        }

        if (
          Math.abs(diaryMesh.position.x - foxRef.current.position.x) < 5 &&
          Math.abs(diaryMesh.position.z - foxRef.current.position.z) < 5
        ) {
          diaryMesh.material.color.set('seagreen');
          gsap.to(camera.position, {
            duration: 1,
            y: 2,
          });
          gsap.to(camera, {
            duration: 1,
            zoom: 30,
            onUpdate: function () {
              camera.updateProjectionMatrix();
            },
          });
          gsap.to(camera, {
            duration: 1,
            near: -100,
            onUpdate: function () {
              camera.updateProjectionMatrix();
            },
          });
          setTimeout(() => {
            navigate('/diary');
          }, 500);
        }

        if (
          Math.abs(movetoMesh.position.x - foxRef.current.position.x) < 1 &&
          Math.abs(movetoMesh.position.z - foxRef.current.position.z) < 1
        ) {
          navigate('/photo-cloud/1');
        }
      } else {
        walk.stop();
        action1.play();
      }
    }
    gl.render(scene, camera);
  });

  // 마우스 이벤트
  gl.domElement.addEventListener('mousedown', (e) => {
    setIsPressed(() => true);
    calculateMousePosition(e);
  });
  gl.domElement.addEventListener('mouseup', () => {
    setIsPressed(() => false);
  });
  gl.domElement.addEventListener('mousemove', (e) => {
    if (isPressed) {
      calculateMousePosition(e);
    }
  });

  //   // 터치 이벤트
  gl.domElement.addEventListener('touchstart', (e) => {
    setIsPressed(() => true);
    calculateMousePosition(e.touches[0]);
  });
  gl.domElement.addEventListener('touchend', () => {
    setIsPressed(() => false);
  });
  gl.domElement.addEventListener('touchmove', (e) => {
    if (isPressed) {
      calculateMousePosition(e.touches[0]);
    }
  });

  return (
    <Suspense fallback={<div>loading...</div>}>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[1, 1, 1]}
        intensity={0.5}
        shadow-mapSize={[2048, 2048]}
        castShadow={true}
      >
        <OrthographicCamera makeDefault position={[1, 5, 5]} far={1000} />
      </directionalLight>
      <mesh
        ref={pointRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={[0, 0.05, 0]}
      >
        <circleGeometry args={[1, 16]}></circleGeometry>
        <meshStandardMaterial transparent />
      </mesh>

      <primitive
        ref={foxRef}
        object={fox.scene}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={diary.scene}
        scale={[0.3, 0.3, 0.3]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[-34, 2, -15]}
        receiveShadow={true}
      />
    </Suspense>
  );
}

function Room() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}

export default Room;
