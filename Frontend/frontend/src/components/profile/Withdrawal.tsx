import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import { defaultApi } from '../../api/axios';
import requests from '../../api/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

      // 로그아웃 API 호출
      await defaultApi.get(requests.POST_LOGOUT(), { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
      setIsLoggedIn(null);
      localStorage.removeItem('recoil-persist');
      Swal.fire({
        title: '회원탈퇴 성공!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: '회원탈퇴에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10%',
        marginBottom: '10%',
      }}
    >
      <button onClick={() => setShowModal(true)} style={{ color: 'white' }}>
        회원탈퇴
      </button>
      {showModal && (
        <div
          style={{
            position: 'absolute',
            width: '90%',
            borderRadius: '10px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p>
            회원님의 기록들은 한 달 동안 보관되며,
            <br />그 이후 삭제됩니다.
            <br />한 달이 되기 전 다시 로그인 하시면
            <br />
            모든 기록이 복원됩니다.
            <br />
            <br />
            정말로 회원탈퇴를 하시겠습니까?
            <br />
            <br />
          </p>
          <div>
            <button
              onClick={handleWithdrawal}
              style={{
                marginRight: '2%',
                borderRadius: '10px',
                border: '1px solid',
                padding: '2%',
              }}
            >
              확인
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginRight: '2%',
                borderRadius: '10px',
                border: '1px solid',
                padding: '2%',
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdrawal;
