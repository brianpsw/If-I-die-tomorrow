import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Scene from '../../components/home/Scene';
import { Icon } from '@iconify/react';
import Map from '../../assets/images/test2.png';

function Room() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveUrl, setMoveUrl] = useState<string>('');
  const [isMapShow, setIsMapShow] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );

  console.log(currentPosition);
  return (
    <div className="relative">
      {isModalOpen ? (
        <Modal>
          <div className="flex flex-col">
            <p className="text-p1 mt-6">해당 페이지로 이동하시겠습니까?</p>
            <div className="flex justify-evenly my-6">
              <Button
                color="#36C2CC"
                size="sm"
                onClick={() => navigate(moveUrl)}
              >
                예
              </Button>
              <Button
                style={{ color: '#9E9E9E' }}
                color="#F6F6F6"
                size="sm"
                onClick={() => setIsModalOpen(() => false)}
              >
                취소
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
      <div
        className="fixed top-6 left-6 z-10 cursor-pointer"
        onClick={() => {
          setIsMapShow((prev) => !prev);
        }}
      >
        <Icon
          icon="ic:round-map"
          style={{ fontSize: '30px', color: '#111111' }}
        />
      </div>
      {isMapShow && (
        <div className="fixed top-[60px] left-6 z-20 w-[100px] h-[100px] border-2 border-black">
          <img src={Map} alt="미니맵" className="relative" />
          <div className="bg-red w-2 h-2 absolute top-[47%] left-[47%]"></div>
        </div>
      )}
      <div className="fixed top-6 right-6 z-10">
        <Icon
          icon="ic:round-volume-up"
          style={{ fontSize: '30px', color: '#111111' }}
        />
      </div>

      <Canvas>
        <Scene
          setIsModalOpen={setIsModalOpen}
          setMoveUrl={setMoveUrl}
          setCurrentPosition={setCurrentPosition}
        />
      </Canvas>
    </div>
  );
}

export default Room;
