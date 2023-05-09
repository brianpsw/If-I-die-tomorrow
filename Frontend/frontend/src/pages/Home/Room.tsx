import React, { useState, Suspense, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, OrthographicCamera } from '@react-three/drei';
import gsap from 'gsap';
import shadows from '@mui/material/styles/shadows';

function RoomScene() {
  const [foxPointer, setFoxPointer] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 10, 0),
  );
  const [foxMoving, setFoxMoving] = useState<boolean>(false);
  const [pointer, setPointer] = useState<THREE.Vector3>(new THREE.Vector3());
  const [destinationPoint, setDestinationPoint] = useState<THREE.Vector3>(
    new THREE.Vector3(),
  );
  const [angle, setAngle] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false); // 마우스를 누르고 있는 상태
  const { gl, scene, camera, raycaster, mouse } = useThree();

  // 캔버스 설정
  gl.setSize(window.innerWidth, window.innerHeight * 0.94);
  gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFShadowMap;

  // 카메라 설정
  const cameraPosition = new THREE.Vector3(5, 20, 30);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.zoom = 2;
  camera.rotation.x = -Math.PI / 4;
  camera.updateProjectionMatrix();
  scene.add(camera);

  const floorTexture = useTexture('images/example.png');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.x = 1;
  floorTexture.repeat.y = 1;

  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
    }),
  );
  floorMesh.name = 'floor';
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const fox = useGLTF('models/fox.glb', true);
  const foxModelMesh = fox.scene.children[0];
  let mixer = new THREE.AnimationMixer(fox.scene);

  const action1 = mixer.clipAction(fox.animations[0]);
  const walk = mixer.clipAction(fox.animations[2]);
  // action1.play();

  const checkIntersects = () => {
    const meshes = [floorMesh, foxModelMesh];
    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      if (item.object.name === 'floor') {
        setDestinationPoint(
          () => new THREE.Vector3(item.point.x, 0.3, item.point.z),
        );
        foxModelMesh.lookAt(destinationPoint);

        setFoxMoving(() => true);
        setPointer(
          () => new THREE.Vector3(destinationPoint.x, 0.1, destinationPoint.z),
        );
      }
      break;
    }
  };

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);

    if (foxModelMesh) {
      // camera.lookAt(foxPointer);

      if (isPressed) raycasting();

      if (foxMoving) {
        setAngle(() =>
          Math.atan2(
            destinationPoint.z - foxPointer.z,
            destinationPoint.x - foxPointer.x,
          ),
        );
        setFoxPointer(
          () =>
            new THREE.Vector3(
              foxPointer.x + Math.cos(angle) * 1,
              foxPointer.y,
              foxPointer.z + Math.sin(angle) * 1,
            ),
        );

        camera.position.x = cameraPosition.x + foxPointer.x;
        camera.position.z = cameraPosition.z + foxPointer.z;

        action1.stop();
        walk.play();

        if (
          Math.abs(destinationPoint.x - foxPointer.x) < 0.5 &&
          Math.abs(destinationPoint.z - foxPointer.z) < 0.5
        ) {
          setFoxMoving(() => false);
          console.log('멈춤');
        }
        //   if (
        //     Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
        //     Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5
        //   ) {
        //     if (!house.visible) {
        //       console.log('나와');
        //       house.visible = true;
        //       spotMesh.material.color.set('seagreen');
        //       gsap.to(house.modelMesh.position, {
        //         duration: 1,
        //         y: 1,
        //         ease: 'Bounce.easeOut',
        //       });
        //       gsap.to(camera.position, {
        //         duration: 1,
        //         y: 3,
        //       });
        //     }
        //   } else if (house.visible) {
        //     console.log('들어가');
        //     house.visible = false;
        //     spotMesh.material.color.set('yellow');
        //     gsap.to(house.modelMesh.position, {
        //       duration: 0.5,
        //       y: -1.3,
        //     });
        //     gsap.to(camera.position, {
        //       duration: 1,
        //       y: 5,
        //     });
        //   }
      } else {
        // 서 있는 상태
        walk.stop();
        action1.play();
        // action1.stop();
        // walk.play();
      }
    }
  });

  const calculateMousePosition = (e: any) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  const raycasting = () => {
    raycaster.setFromCamera(mouse, camera);
    checkIntersects();
  };

  window.addEventListener('mousedown', (e) => {
    setIsPressed(() => true);
    calculateMousePosition(e);
  });

  window.addEventListener('mouseup', (e) => {
    setIsPressed(() => false);
  });

  window.addEventListener('mousemove', (e) => {
    if (isPressed) {
      calculateMousePosition(e);
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
        <OrthographicCamera
          makeDefault
          position={[0, 0, 0]}
          far={1000}
          near={-1000}
        />
      </directionalLight>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={pointer}
      >
        <planeGeometry args={[30, 30]}></planeGeometry>
        <meshStandardMaterial color={'green'} transparent opacity={0.5} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={[5, 0.005, 5]}
      >
        <planeGeometry args={[100, 100]}></planeGeometry>
        <meshStandardMaterial color={'yellow'} transparent opacity={0.5} />
      </mesh>
      <primitive
        object={fox.scene}
        scale={[8, 8, 8]}
        position={foxPointer}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={true}
      />
    </Suspense>
  );
}

function Room() {
  return (
    <Canvas>
      <RoomScene />
    </Canvas>
  );
}

export default Room;
