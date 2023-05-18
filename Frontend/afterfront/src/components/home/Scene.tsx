import React, { Suspense, useRef, RefObject } from 'react';

import * as THREE from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { OrthographicCamera, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

import Loading from '../common/Loading';

interface roomProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMoveUrl: React.Dispatch<React.SetStateAction<string>>;
  updatePosition: (position: THREE.Vector3) => void;
}

extend({ TextGeometry });

function Scene(props: roomProps) {
  const { setIsModalOpen, setMoveUrl, updatePosition } = props;
  const foxRef = useRef<THREE.Object3D>(null);
  const pointRef: RefObject<THREE.Mesh> = useRef(null);
  const { gl, scene, camera, raycaster, mouse } = useThree();
  let foxIsMoving = false;
  // Texture
  const floorTexture = useTexture('images/map2.png');

  // canvas
  gl.setSize(window.innerWidth, window.innerHeight);
  gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  //Camera
  const cameraPosition = new THREE.Vector3(1, 5, 5);

  camera.zoom = 17;

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
    new THREE.CircleGeometry(2.5, 18),
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
    }),
  );
  diaryMesh.position.set(-35, 0.005, -17.5);
  diaryMesh.rotation.x = -Math.PI / 2;
  diaryMesh.receiveShadow = true;
  scene.add(diaryMesh);

  const photoMesh = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 18),
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 1,
    }),
  );
  photoMesh.position.set(35, 0.005, 30);
  photoMesh.rotation.x = -Math.PI / 2;
  photoMesh.receiveShadow = true;
  scene.add(photoMesh);

  const willMesh = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 18),
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
    }),
  );
  willMesh.position.set(-21, 0.005, 39);
  willMesh.rotation.x = -Math.PI / 2;
  willMesh.receiveShadow = true;
  scene.add(willMesh);

  const bucketMesh = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 18),
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
    }),
  );
  bucketMesh.position.set(24, 0.005, -38);
  bucketMesh.rotation.x = -Math.PI / 2;
  bucketMesh.receiveShadow = true;
  scene.add(bucketMesh);

  const fox = useGLTF('models/fox_2.glb', true);
  const foxModelMesh = fox.scene.children[0];
  let mixer = new THREE.AnimationMixer(fox.scene);
  const action1 = mixer.clipAction(fox.animations[0]);
  const run = mixer.clipAction(fox.animations[2]);
  action1.play();

  // router object들
  const diary = useGLTF('models/diary.glb', true);
  const photo = useGLTF('models/photoroom.glb', true);
  const bucket = useGLTF('models/bucket.glb', true);
  const will = useGLTF('models/letter2.glb', true);

  // 팀원들 오브젝트

  const honey = useGLTF('models/honey.glb');
  const bicycle = useGLTF('models/bicycle.glb');
  const blueberry = useGLTF('models/blueberry.glb');
  const cooking = useGLTF('models/cooking.glb');
  const ethereum = useGLTF('models/ethereum.glb');
  const racket = useGLTF('models/racket.glb');
  const ball = useGLTF('models/tennis_ball.glb');

  // 꾸미는 오브젝트
  const cake = useGLTF('models/cake.glb');
  const cloud2 = useGLTF('models/cloud2.glb');
  const cloud3 = useGLTF('models/cloud3.glb');
  const cloud4 = useGLTF('models/cloud4.glb');
  const cloud4_1 = useGLTF('models/cloud4_1.glb');
  const ladder = useGLTF('models/ladder.glb');
  const star = useGLTF('models/star.glb');
  const star1 = useGLTF('models/star1.glb');
  const star2 = useGLTF('models/star2.glb');
  const ship = useGLTF('models/paper_ship.glb');

  //3d text
  const loader = new FontLoader();

  loader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function (font: any) {
      let materialFront = new THREE.MeshBasicMaterial({ color: 0x36c2cc });
      let materialSide = new THREE.MeshBasicMaterial({ color: 0x04373b });
      let materialArray = [materialFront, materialSide];
      const geometry1 = new TextGeometry('Welcome!', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.3,
        bevelOffset: 0.1,
        bevelSegments: 3,
      });

      const welcome = new THREE.Mesh(geometry1, materialArray);
      welcome.rotation.x = -Math.PI / 6;
      welcome.position.set(-5.5, 0, -3);

      let materialFront1 = new THREE.MeshBasicMaterial({ color: 0xf0c5ff });
      let materialSide1 = new THREE.MeshBasicMaterial({ color: 0x4a1e76 });
      let materialArray1 = [materialFront1, materialSide1];
      const geometry2 = new TextGeometry('Photo Album', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.3,
        bevelOffset: 0.1,
        bevelSegments: 3,
      });
      const geometry3 = new TextGeometry('Will', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.3,
        bevelOffset: 0.1,
        bevelSegments: 3,
      });

      const geometry4 = new TextGeometry('Diary', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.3,
        bevelOffset: 0.1,
        bevelSegments: 3,
      });

      const geometry5 = new TextGeometry('Bucket', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.3,
        bevelOffset: 0.1,
        bevelSegments: 3,
      });

      const photoAlbum = new THREE.Mesh(geometry2, materialArray1);
      photoAlbum.rotation.x = -Math.PI / 6;
      photoAlbum.position.set(25, 0, 20);

      const will = new THREE.Mesh(geometry3, materialArray1);
      will.rotation.x = -Math.PI / 6;
      will.position.set(-23, 0, 28);

      const diary = new THREE.Mesh(geometry4, materialArray1);
      diary.rotation.x = -Math.PI / 6;
      diary.position.set(-30, 0, -8);

      const bucket = new THREE.Mesh(geometry5, materialArray1);
      bucket.rotation.x = -Math.PI / 6;
      bucket.position.set(12, 0, -26);

      scene.add(welcome);
      scene.add(photoAlbum);
      scene.add(will);
      scene.add(diary);
      scene.add(bucket);
    },
  );

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

        foxIsMoving = true;
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
        run.play();

        if (
          Math.abs(pointRef.current.position.x - foxRef.current.position.x) <
            0.5 &&
          Math.abs(pointRef.current.position.z - foxRef.current.position.z) <
            0.5
        ) {
          foxIsMoving = false;
          updatePosition(foxRef.current!.position);
        }

        if (
          Math.abs(diaryMesh.position.x - foxRef.current.position.x) < 7 &&
          Math.abs(diaryMesh.position.z - foxRef.current.position.z) < 7
        ) {
          gsap.to(diary.scene.rotation, {
            duration: 1,
            y: Math.PI * 2 - Math.PI / 1.5,
          });

          if (
            Math.abs(diaryMesh.position.x - foxRef.current.position.x) < 3 &&
            Math.abs(diaryMesh.position.z - foxRef.current.position.z) < 3
          ) {
            setMoveUrl(() => '/diary');
            setIsModalOpen(() => true);
          }
        }

        if (
          Math.abs(photoMesh.position.x - foxRef.current.position.x) < 7 &&
          Math.abs(photoMesh.position.z - foxRef.current.position.z) < 7
        ) {
          gsap.to(photo.scene.rotation, {
            duration: 1,
            y: Math.PI * 2 - Math.PI / 1.5,
          });

          if (
            Math.abs(photoMesh.position.x - foxRef.current.position.x) < 3 &&
            Math.abs(photoMesh.position.z - foxRef.current.position.z) < 3
          ) {
            setMoveUrl(() => '/photo-cloud');
            setIsModalOpen(() => true);
          }
        }

        if (
          Math.abs(willMesh.position.x - foxRef.current.position.x) < 7 &&
          Math.abs(willMesh.position.z - foxRef.current.position.z) < 7
        ) {
          gsap.to(will.scene.rotation, {
            duration: 1,
            y: Math.PI * 2 - Math.PI / 1.5,
          });

          if (
            Math.abs(willMesh.position.x - foxRef.current.position.x) < 3 &&
            Math.abs(willMesh.position.z - foxRef.current.position.z) < 3
          ) {
            setMoveUrl(() => '/will');
            setIsModalOpen(() => true);
          }
        }

        if (
          Math.abs(bucketMesh.position.x - foxRef.current.position.x) < 7 &&
          Math.abs(bucketMesh.position.z - foxRef.current.position.z) < 7
        ) {
          gsap.to(bucket.scene.rotation, {
            duration: 1,
            y: Math.PI * 2 - Math.PI / 1.5,
          });

          if (
            Math.abs(bucketMesh.position.x - foxRef.current.position.x) < 3 &&
            Math.abs(bucketMesh.position.z - foxRef.current.position.z) < 3
          ) {
            setMoveUrl(() => '/bucket');
            setIsModalOpen(() => true);
          }
        }
      } else {
        run.stop();
        action1.play();
      }
    }
  });

  // 마우스 이벤트
  gl.domElement.addEventListener('mousedown', (e) => {
    calculateMousePosition(e);
    raycasting();
  });

  // 터치 이벤트
  gl.domElement.addEventListener('touchstart', (e) => {
    calculateMousePosition(e.touches[0]);
    raycasting();
  });

  return (
    <Suspense fallback={<Loading />}>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[1, 5, 1]}
        intensity={0.7}
        shadow-mapSize={[2048, 2048]}
        castShadow={true}
      >
        <OrthographicCamera
          makeDefault
          castShadow={true}
          position={[1, 5, 5]}
          far={2000}
          near={-100}
          left={-10}
          right={10}
          top={10}
          bottom={-10}
        />
      </directionalLight>
      <mesh
        ref={pointRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={true}
        position={[0, 0.05, 0]}
      >
        <circleGeometry args={[1, 16]} />
        <meshStandardMaterial transparent />
      </mesh>

      <primitive
        object={bicycle.scene}
        scale={[0.01, 0.01, 0.01]}
        position={[-25, 5, 10]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={blueberry.scene}
        scale={[0.2, 0.2, 0.2]}
        position={[-5, 0, -10]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cake.scene}
        scale={[50, 50, 50]}
        position={[30, 0, 5]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cloud2.scene}
        scale={[2.5, 2.5, 2.5]}
        position={[-40, 10, 15]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cloud3.scene}
        scale={[1.5, 1.5, 1.5]}
        position={[40, 10, -5]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={ladder.scene}
        scale={[4, 4, 4]}
        position={[36, 3, 4]}
        rotation={[-Math.PI / 6, Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cloud4.scene}
        scale={[0.5, 0.5, 0.5]}
        position={[-40, 10, -10]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cloud4_1.scene}
        scale={[0.3, 0.3, 0.3]}
        position={[-10, 10, 60]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={ship.scene}
        scale={[1, 1, 1]}
        position={[-10, 0, -30]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={star.scene}
        scale={[5, 5, 5]}
        position={[0, 10, -30]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={star1.scene}
        scale={[3, 3, 3]}
        position={[5, 10, -30]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={star2.scene}
        scale={[5, 5, 5]}
        position={[5, 15, -30]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={cooking.scene}
        scale={[1, 1, 1]}
        position={[35, 0, -20]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={ethereum.scene}
        scale={[1, 1, 1]}
        position={[5, 2, 20]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={honey.scene}
        scale={[2, 2, 2]}
        position={[20, 0, 40]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        object={racket.scene}
        scale={[1, 1, 1]}
        position={[-35, 5, 40]}
        rotation={[0, 0, 0]}
      />
      <primitive
        object={ball.scene}
        scale={[0.4, 0.4, 0.4]}
        position={[-35, 5.5, 40]}
        rotation={[0, 0, 0]}
        receiveShadow={true}
      />
      <primitive
        ref={foxRef}
        object={fox.scene}
        scale={[1, 1, 1]}
        position={[0, 1.3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={true}
      />
      <primitive
        object={diary.scene}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[-34, 2, -15]}
        receiveShadow={true}
      />
      <primitive
        object={photo.scene}
        scale={[0.8, 0.8, 0.8]}
        rotation={[0, -Math.PI / 1.5, 0]}
        position={[35.5, 0, 31]}
        receiveShadow={true}
      />
      <primitive
        object={bucket.scene}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[21, 0.005, -36]}
        receiveShadow={true}
      />
      <primitive
        object={will.scene}
        scale={[0.005, 0.005, 0.005]}
        rotation={[0, -Math.PI / 3, 0]}
        position={[-21, 0.005, 39]}
        receiveShadow={true}
      />
    </Suspense>
  );
}

export default Scene;
