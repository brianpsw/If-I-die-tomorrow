import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Canvas } from '@react-three/fiber';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Scene from '../../components/home/Scene';

function Room() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [moveUrl, setMoveUrl] = useState<string>('');
  return (
    <div>
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

      <Canvas>
        <Scene setIsModalOpen={setIsModalOpen} setMoveUrl={setMoveUrl} />
      </Canvas>
    </div>
  );
}

export default Room;
