import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import { defaultApi } from '../../api/axios';
import requests from '../../api/config';
import { useNavigate } from 'react-router-dom';

function Withdrawal() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(userState);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleWithdrawal = async () => {
    if (!user) return;

    try {
      await defaultApi.delete(requests.DELETE_USER(), {
        data: { userId: user.userId },
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('recoil-persist');
      alert('회원탈퇴 성공!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>회원탈퇴</button>
      {showModal && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
          }}
        >
          <p>정말로 회원탈퇴를 하시겠습니까?</p>
          <button onClick={handleWithdrawal}>확인</button>
          <button onClick={() => setShowModal(false)}>취소</button>
        </div>
      )}
    </div>
  );
}

export default Withdrawal;
