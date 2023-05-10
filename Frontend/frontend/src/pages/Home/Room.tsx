import React, { Suspense, useState, useRef, RefObject } from 'react';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

function Scene() {
  const foxRef = useRef<THREE.Object3D>(null);
  const homeRef = useRef<THREE.Object3D>(null);
  const pointRef: RefObject<THREE.Mesh> = useRef(null);
  const { gl, scene, camera, raycaster, mouse } = useThree();
  const [isHomeVisible, setIsHomeVisible] = useState<boolean>(false);
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

  camera.zoom = 50;
  camera.updateProjectionMatrix();

  // Mesh
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

  const spotMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: 'pink',
      transparent: true,
      opacity: 0.5,
    }),
  );
  // [-30, 2, 0];
  spotMesh.position.set(-25, 0.005, 12);
  spotMesh.rotation.x = -Math.PI / 2;
  spotMesh.receiveShadow = true;
  scene.add(spotMesh);

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
          console.log('멈춤');
        }

        if (
          Math.abs(spotMesh.position.x - foxRef.current.position.x) < 5 &&
          Math.abs(spotMesh.position.z - foxRef.current.position.z) < 5
        ) {
          if (!isHomeVisible) {
            console.log('나와');
            setIsHomeVisible(() => true);
            spotMesh.material.color.set('seagreen');
            if (homeRef.current) {
              gsap.to(homeRef.current.position, {
                duration: 1,
                y: 0.7,
                ease: 'Back.easeOut',
              });
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
            }
          }
        } else if (isHomeVisible) {
          console.log('들어가');
          setIsHomeVisible(() => false);

          spotMesh.material.color.set('yellow');
          if (homeRef.current) {
            gsap.to(homeRef.current.position, {
              duration: 0.5,
              y: -7.5,
            });
            gsap.to(camera.position, {
              duration: 1,
              y: 5,
            });
            gsap.to(camera, {
              duration: 1,
              zoom: 50,
              onUpdate: function () {
                camera.updateProjectionMatrix();
              },
            });
          }
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
        ref={homeRef}
        object={home.scene}
        scale={[0.03, 0.03, 0.03]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[-30, -7.5, 0]}
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
