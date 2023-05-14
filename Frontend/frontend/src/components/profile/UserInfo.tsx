import React, { useState, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import ServiceAgreeModal from './ServiceAgreeModal';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import {
  MyProfile,
  SettingBox,
  IconWithText,
} from '../../pages/Profile/MyPageEmotion';

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
      setIsLoggedIn(null);
      localStorage.removeItem('recoil-persist');
      alert('로그아웃 성공!');
    } catch (err) {
      console.error(err);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <MyProfile>
        <h4 className="text-h4">{loggedInUserNickname}님, 환영합니다</h4>
        <Link to="/will">
          <IconWithText>
            <Icon icon="line-md:clipboard-list" />
            <span>유언장 작성하러 가기</span>
          </IconWithText>
        </Link>
        <Link to="/after" target="_self" reloadDocument={true} replace={true}>
          <IconWithText>
            <Icon icon="line-md:clipboard-list" />
            <span>사후 페이지 보러가기</span>
          </IconWithText>
        </Link>
      </MyProfile>
      <SettingBox>
        <h4 className="text-h4">내 정보</h4>
        <br />
        <p className="text-p1">이름: {loggedInUserName}</p>
        <p className="text-p1">이메일: {loggedInUserEmail}</p>
        <br />
        <button onClick={handleLogout}>로그아웃</button>
      </SettingBox>
    </div>
  );
}

export default UserInfo;
