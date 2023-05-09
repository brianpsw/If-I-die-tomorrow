import React, { Suspense, useState, useRef } from 'react';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrthographicCamera,
  useGLTF,
  useTexture,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei';

function RoomJs() {
  const foxRef = useRef();
  const { gl, scene, camera, raycaster, mouse } = useThree();
  const [pointer, setPointer] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );
  const [foxPointer, setFoxPointer] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 1, 0),
  );
  const [destinationPoint, setDestinationPoint] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );
  const [angle, setAngle] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [foxIsMoving, setFoxIsMoving] = useState<boolean>(false);
  // Texture
  const floorTexture = useTexture('images/example.png');
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
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.zoom = 20;
  camera.updateProjectionMatrix();
  scene.add(camera);

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

  const fox = useGLTF('models/fox.glb', true);
  const foxModelMesh = fox.scene.children[0];
  let mixer = new THREE.AnimationMixer(fox.scene);
  const action1 = mixer.clipAction(fox.animations[0]);
  const walk = mixer.clipAction(fox.animations[2]);
  action1.play();

  const home = useGLTF('models/low_poly_room.glb', true);

  const checkIntersects = () => {
    const meshes = [floorMesh, foxModelMesh];
    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      if (item.object.name === 'floor') {
        setDestinationPoint(
          () => new THREE.Vector3(item.point.x, 0.3, item.point.z),
        );

        foxModelMesh.lookAt(destinationPoint);

        // console.log(item.point)

        setFoxIsMoving(() => true);

        setPointer(
          () =>
            new THREE.Vector3(
              destinationPoint.x,
              pointer.y,
              destinationPoint.z,
            ),
        );
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

    if (foxModelMesh) {
      camera.lookAt(foxPointer);
    }

    if (foxModelMesh) {
      if (isPressed) {
        raycasting();
      }

      if (foxIsMoving) {
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
          setFoxIsMoving(() => false);
          console.log('멈춤');
        }

        // if (
        //     Math.abs(spotMesh.position.x - player.modelMesh.position.x) < 1.5 &&
        //     Math.abs(spotMesh.position.z - player.modelMesh.position.z) < 1.5
        // ) {
        //     if (!house.visible) {
        //         console.log('나와');
        //         house.visible = true;
        //         spotMesh.material.color.set('seagreen');
        //         gsap.to(
        //             house.modelMesh.position,
        //             {
        //                 duration: 1,
        //                 y: 1,
        //                 ease: 'Bounce.easeOut'
        //             }
        //         );
        //         gsap.to(
        //             camera.position,
        //             {
        //                 duration: 1,
        //                 y: 3
        //             }
        //         );
        //     }
        // } else if (house.visible) {
        //     console.log('들어가');
        //     house.visible = false;
        //     spotMesh.material.color.set('yellow');
        //     gsap.to(
        //         house.modelMesh.position,
        //         {
        //             duration: 0.5,
        //             y: -1.3
        //         }
        //     );
        //     gsap.to(
        //         camera.position,
        //         {
        //             duration: 1,
        //             y: 5
        //         }
        //     );
        // }
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
  window.addEventListener('touchstart', (e) => {
    setIsPressed(() => true);
    calculateMousePosition(e.touches[0]);
  });
  window.addEventListener('touchend', () => {
    setIsPressed(() => false);
  });
  window.addEventListener('touchmove', (e) => {
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
        <OrthographicCamera makeDefault far={1000} near={-1000} />
      </directionalLight>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={pointer}
      >
        <planeGeometry args={[1, 1]}></planeGeometry>
        <meshStandardMaterial color={'blue'} transparent opacity={0.5} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={[5, 0.005, 5]}
      >
        <planeGeometry args={[10, 10]}></planeGeometry>
        <meshStandardMaterial color={'pink'} transparent opacity={0.5} />
      </mesh>
      <primitive
        ref={foxRef}
        object={fox.scene}
        scale={[1, 1, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={home.scene}
        scale={[0.05, 0.05, 0.05]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[-30, 2, 0]}
        receiveShadow={true}
      />
    </Suspense>
  );
}

function CanvasRoomJs() {
  return (
    <Canvas>
      <RoomJs />
    </Canvas>
  );
}

export default CanvasRoomJs;
