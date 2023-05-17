import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Scene from '../../components/home/Scene';
import { Icon } from '@iconify/react';
import Map from '../../assets/images/test2.png';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';

function Room() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveUrl, setMoveUrl] = useState<string>('');
  const [isMapShow, setIsMapShow] = useState<boolean>(false);
  const [topPosition, setTopPosition] = useState<string>('48%');
  const [leftPosition, setLeftPosition] = useState<string>('48%');
  const userData = useRecoilValue(userDataState);

  let tmpTop = '48%';
  let tmpLeft = '48%';

  const updatePosition = (position: THREE.Vector3) => {
    tmpTop = (48 + position.z).toString() + '%';
    tmpLeft = (48 + position.x).toString() + '%';
    setTopPosition(() => tmpTop);
    setLeftPosition(() => tmpLeft);
  };

  useEffect(() => {
    console.log(topPosition + ' ' + leftPosition);
    setTopPosition(() => tmpTop);
    setLeftPosition(() => tmpLeft);
  }, [tmpTop, tmpLeft]);

  const downloadWill = async () => {
    try {
      const response = await fetch(
        'https://ifidietomorrow.duckdns.org/api/after/download',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          credentials: 'include',
        },
      );
      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'IIDT.zip';
      downloadLink.click();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <div className="relative">
      {isModalOpen ? (
        <Modal>
          <div className="flex flex-col">
            <p className="text-p1 mt-6">해당 페이지로 이동하시겠습니까??</p>
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

      <div className="fixed z-10 top-0 w-full h-[80px] flex justify-around items-center">
        <div
          className="cursor-pointer"
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
          <div className="fixed mt-[60px] w-[200px] h-[200px] border-2 border-black top-0 left-[24px]">
            <img src={Map} alt="미니맵" className="relative" />
            <div
              className="bg-red w-2 h-2 absolute rounded-[10px]"
              style={{ top: topPosition, left: leftPosition }}
            ></div>
          </div>
        )}
        {userData && userData.preview ? (
          <div
            className="min-w-[120px] w-[20vw] py-2 bg-black rounded-[10vw] flex justify-center cursor-pointer"
            onClick={() => downloadWill()}
          >
            <Icon
              icon="material-symbols:download-rounded"
              style={{ fontSize: '30px', color: 'white' }}
            />
            <p className="text-p2 text-white text-center ml-2">
              {' '}
              오프라인 다운로드
            </p>
          </div>
        ) : null}

        <div className="">
          <Icon
            icon="ic:round-volume-up"
            style={{ fontSize: '30px', color: '#111111' }}
          />
        </div>
      </div>

      <Canvas>
        <Scene
          setIsModalOpen={setIsModalOpen}
          setMoveUrl={setMoveUrl}
          updatePosition={updatePosition}
        />
      </Canvas>
    </div>
  );
}

export default Room;
