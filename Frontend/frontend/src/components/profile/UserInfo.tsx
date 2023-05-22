import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Swal from 'sweetalert2';
import Lottie from 'react-lottie-player';
import WillAnimation3 from '../../../src/assets/animation/many-papers.json';
import WillAnimation4 from '../../../src/assets/animation/preview-animation.json';
import Myprofile from '../../assets/icons/myprofile.svg';
import {
  MyProfile,
  SettingBox,
  WillServiceWrap,
  WillContent,
  FillingText,
} from '../../pages/Profile/MyPageEmotion';

interface User {
  userId: number;
  name: string;
  email: string;
  age: number;
  nickname: string;
  sendAgree: boolean;
  personalPage: string | null;
  personalityId: number | null;
  newCheck: boolean;
  deleted: boolean;
  providerType: string;
}

function UserInfo() {
  const user = useRecoilValue(userState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(userState);
  const loggedInUserName = user ? user.name : null;
  const loggedInUserEmail = user ? user.email : null;
  const loggedInUserNickname = user ? user.nickname : null;
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [serviceConsent, setServiceConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmitFromModal = (submittedData: {
    phone: string;
    serviceConsent: boolean;
  }) => {
    setPhone(submittedData.phone);
    setServiceConsent(submittedData.serviceConsent);
    setSubmitted(true);
  };

  const handleLogout = async () => {
    try {
      await defaultApi.get(requests.POST_LOGOUT(), { withCredentials: true });
      localStorage.removeItem('user');
      setIsLoggedIn({} as User);
      localStorage.removeItem('recoil-persist');
      Swal.fire({
        title: '로그아웃 성공!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: '로그아웃에 실패했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  const handlePwaInstall = async () => {
    if (!deferredPrompt) {
      alert('이미 앱이 설치되어있거나 지원되지 않는 환경입니다.');
      return;
    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    deferredPrompt = null;
  };

  return (
    <div>
      <MyProfile>
        <FillingText className="text-h4">{loggedInUserNickname}</FillingText>
        <SettingBox>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <img
              src={Myprofile}
              alt="myprofile-icon"
              style={{ marginRight: '3%' }}
            /> */}
            <h4 className="text-h4">내 정보</h4>
          </div>
          <br />
          <p className="text-p1">이름: {loggedInUserName}</p>
          <p className="text-p1">이메일: {loggedInUserEmail}</p>
          <br />
          <button onClick={handleLogout}>로그아웃</button>
          <br />
          <button onClick={handlePwaInstall}> 앱 설치하기 </button>
        </SettingBox>
        <WillServiceWrap>
          <Link to="/will">
            <WillContent>
              <Lottie
                animationData={WillAnimation3}
                play
                loop
                style={{ width: 120, height: 120, margin: '0 auto' }}
              />
              <p className="text-p2">유언장 작성하러 가기</p>
            </WillContent>
          </Link>
          <Link
            to="/after/"
            target="_self"
            reloadDocument={true}
            replace={true}
          >
            <WillContent>
              <Lottie
                animationData={WillAnimation4}
                play
                loop
                style={{ width: 120, height: 120, margin: '0 auto' }}
              />
              <p className="text-p2">사후 페이지 미리보기</p>
            </WillContent>
          </Link>
        </WillServiceWrap>
      </MyProfile>
    </div>
  );
}

export default UserInfo;
