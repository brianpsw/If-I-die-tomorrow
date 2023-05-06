import React, { useState, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';
import {
  MyProfile,
  SettingBox,
  IconWithText,
} from '../../pages/Profile/MyPageEmotion';

function UserInfo() {
  const user = useRecoilValue(userState);
  const loggedInUserName = user ? user.name : null;
  const loggedInUserEmail = user ? user.email : null;
  const loggedInUserNickname = user ? user.nickname : null;

  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  const handleConsentChange = (e: any) => {
    setConsent(e.target.checked);
  };

  const handleSubmit = () => {
    if (consent) {
      setSubmitted(true);
    } else {
      alert('개인정보 수집 및 이용에 동의해주세요.');
    }
  };

  return (
    <div>
      <MyProfile>
        <h3 className="text-h3">{loggedInUserNickname}님, 환영합니다</h3>
        <Link to="/will">
          <IconWithText>
            <Icon icon="line-md:clipboard-list" />
            <span>유언장 작성하러 가기</span>
          </IconWithText>
        </Link>
      </MyProfile>
      <SettingBox>
        <h3 className="text-h3">내 정보</h3>
        <br />
        <p className="text-p1">이름: {loggedInUserName}</p>
        <p className="text-p1">이메일: {loggedInUserEmail}</p>
        <br />
        <h3 className="text-h3">개인정보 수집 동의</h3>
        <br />
        {submitted ? (
          <>
            <p className="text-p1">전화번호: {phone}</p>
            <p className="text-p1" style={{ fontSize: '0.8rem' }}>
              개인정보 이용 및 수집에 동의하셨습니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-p1">전화번호 :</p>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="전화번호를 입력하세요."
            />
            <br />
            <input
              type="checkbox"
              checked={consent}
              onChange={handleConsentChange}
            />
            <label>개인정보 수집 및 이용에 동의합니다.</label>
            <br />
            <button onClick={handleSubmit}>저장</button>
          </>
        )}
      </SettingBox>
    </div>
  );
}

export default UserInfo;
