import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from '../common/Button';

interface SubmitConfirmModalProps {
  onClose: (serviceConsent: boolean) => void;
  onSubmit: (submittedData: { phone: string; serviceConsent: boolean }) => void;
}

const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^010\d{8}$/;
  return phoneRegex.test(phone);
};

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

  const handleClose = () => {
    onClose(serviceConsent);
  };

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  const handleConsentChange = (e: any) => {
    setServiceConsent(e.target.checked);
  };

  const handleSubmit = () => {
    if (!isValidPhoneNumber(phone)) {
      alert(
        '전화번호 형식이 올바르지 않습니다. 010으로 시작하는 11자리 숫자를 입력해주세요.',
      );
      return;
    }

    if (serviceConsent) {
      setSubmitted(true);
      onSubmit({ phone, serviceConsent });
      handleClose();
    } else {
      alert('개인정보 수집 및 이용에 동의해주세요.');
    }
  };
  return (
    <ModalOverlay>
      <ModalWrapper>
        <p className="text-p1" style={{ marginBottom: '5%', marginTop: '5%' }}>
          개인정보 수집 및 이용 동의
        </p>
        <p className="text-smT" style={{ marginBottom: '8%' }}>
          If I Die Tomorrow의 사후전송 서비스는 이용자의 마지막 사이트 접속
          일자를 기준으로 3개월간 접속이 없을 시 이용자가 가입한 소설 계정
          (카카오톡, 네이버)으로 1주일 간격으로 알림을 보내며 마지막 사이트 접속
          일자를 기준으로 6개월간 접속이 없다면 등록해둔 가족, 지인에게 사용자의
          사진 클라우드, 버킷리스트, 다이어리 내용과 등록한 유언장을 전송합니다.
        </p>
        {submitted ? (
          <div>
            <p className="text-p1">전화번호: {phone}</p>
            <p className="text-p1" style={{ fontSize: '0.8rem' }}>
              개인정보 이용 및 수집에 동의하셨습니다.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', marginBottom: '2%' }}>
              <p className="text-p2" style={{ marginRight: '3%' }}>
                내 번호 :
              </p>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="전화번호를 입력하세요."
                style={{
                  width: '170px',
                  height: '30px',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}
              />
            </div>
            <span> " - " 을 제외하고 입력해주세요.</span>

            <div style={{ marginRight: '3%', marginTop: '8%' }}>
              <input
                type="checkbox"
                checked={serviceConsent}
                onChange={handleConsentChange}
                style={{ marginRight: '3%' }}
              />
              <label className="text-smT">
                개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>
            <div
              style={{
                marginTop: '5%',
                marginBottom: '5%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button onClick={handleSubmit} style={{ marginRight: '5%' }}>
                저장
              </button>
              <button onClick={handleClose}>취소</button>
            </div>
          </div>
        )}
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default SubmitConfirmModal;
