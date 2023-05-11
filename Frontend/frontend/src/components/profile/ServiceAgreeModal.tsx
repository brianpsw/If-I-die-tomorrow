import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from '../common/Button';
import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';

interface SubmitConfirmModalProps {
  onClose: () => void;
  onSubmit: (submittedData: { phone: string; serviceConsent: boolean }) => void;
}

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
  top:0;
  left: 0;
`;

const ModalWrapper = styled.div`
  ${tw`text-p1 bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;

const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [phone, setPhone] = useState('');
  const [serviceConsent, setServiceConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = useRecoilValue(userState);
  const [userId, setUserId] = useState<number | null>(null);
  const sendAgree = user?.sendAgree;

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  const handleConsentChange = (e: any) => {
    setServiceConsent(e.target.checked);
  };

  const handleSubmit = () => {
    if (serviceConsent) {
      setSubmitted(true);
      onSubmit({ phone, serviceConsent });
      onClose();
    } else {
      alert('개인정보 수집 및 이용에 동의해주세요.');
    }
  };

  return (
    <ModalOverlay>
      <ModalWrapper>
        <h2>서비스 이용 및 개인정보 수집 및 이용 동의</h2>
        {submitted ? (
          <div>
            <p className="text-p1">전화번호: {phone}</p>
            <p className="text-p1" style={{ fontSize: '0.8rem' }}>
              개인정보 이용 및 수집에 동의하셨습니다.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-p2">전화번호 :</p>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="전화번호를 입력하세요."
            />
            <br />
            <input
              type="checkbox"
              checked={serviceConsent}
              onChange={handleConsentChange}
            />
            <label>개인정보 수집 및 이용에 동의합니다.</label>
            <br />
            <button onClick={handleSubmit}>저장</button>
            <button onClick={onClose}>취소</button>
          </div>
        )}
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default SubmitConfirmModal;
