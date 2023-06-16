import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Scene from '../../components/home/Scene';
import { Icon } from '@iconify/react';
import Map from '../../assets/images/minimap.png';
import BgMusic from '../../assets/audio/the_first_star.mp3';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';

function Room() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveUrl, setMoveUrl] = useState<string>('');
  const [isMapShow, setIsMapShow] = useState<boolean>(false);
  const [topPosition, setTopPosition] = useState<string>('48%');
  const [leftPosition, setLeftPosition] = useState<string>('48%');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playModal, setPlayModal] = useState<boolean>(true);
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
    setTopPosition(() => tmpTop);
    setLeftPosition(() => tmpLeft);
  }, [tmpTop, tmpLeft]);

  // 음악 컨트롤 하는 변수 및 함수
  let bgMusic = new Audio(BgMusic);

  const handleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying((prev) => !prev);
    } else {
      audioRef.current?.play();
      setIsPlaying((prev) => !prev);
    }
  };

  // 음악 재생을 위한 허용여부를 묻는 모달
  const handlePlayModal = (check: boolean) => {
    if (check) {
      handleMusic();
    }

    setPlayModal(false);
  };

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
      {playModal ? (
        <Modal>
          <div className="flex flex-col text-center">
            <p className="text-p1 mt-6">배경음악을 허용하시겠습니까?</p>
            <p className="text-p2 mt-2">
              (우측상단 아이콘을 통해 조절이 가능합니다.)
            </p>
            <div className="flex justify-evenly my-6">
              <Button
                color="#36C2CC"
                size="sm"
                onClick={() => handlePlayModal(true)}
              >
                예
              </Button>
              <Button
                style={{ color: '#9E9E9E' }}
                color="#F6F6F6"
                size="sm"
                onClick={() => handlePlayModal(false)}
              >
                아니오
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
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

      <div className="fixed z-10 top-0 w-full h-[80px] flex justify-between items-center px-6">
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
          <div className="fixed mt-[80px] w-[200px] h-[200px] border-2 border-black top-0 left-[24px]">
            <img src={Map} alt="미니맵" className="relative" />
            <div
              className="bg-red w-2 h-2 absolute rounded-[10px]"
              style={{ top: topPosition, left: leftPosition }}
            ></div>
          </div>
        )}
        {userData && userData.preview ? (
          <div
            className="min-w-[150px] w-[20vw] py-2 bg-black rounded-[10vw] flex justify-center items-center cursor-pointer"
            onClick={() => downloadWill()}
          >
            <Icon
              icon="material-symbols:download-rounded"
              style={{ fontSize: '30px', color: 'white' }}
            />
            <p className="text-p2 text-white text-center ml-2">
              오프라인 다운로드
            </p>
          </div>
        ) : null}
        <div>
          <audio ref={audioRef} src={BgMusic} />
          {isPlaying ? (
            <Icon
              icon="mdi:music"
              style={{ fontSize: '30px', color: '#111111', cursor: 'pointer' }}
              onClick={() => handleMusic()}
            />
          ) : (
            <Icon
              icon="mdi:music-off"
              style={{ fontSize: '30px', color: '#111111', cursor: 'pointer' }}
              onClick={() => handleMusic()}
            />
          )}
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
