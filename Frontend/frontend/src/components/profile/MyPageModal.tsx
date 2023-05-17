import { useEffect, useRef, useState, ReactNode } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`text-p3 pt-16 pb-20 pl-8 pr-8 bg-white flex flex-col items-center absolute border-solid rounded-xl h-auto w-[100%] shadow mt-[50%] font-sans`}
  bottom: 0;
`;
const ContentWrapper = styled.div`
  ${tw`m-1`}
`;

const ContentTitle = styled.div`
  ${tw`text-p2 m-1 mt-12`}
  font-weight: 600
`;

const ContentText = styled.p`
  ${tw`m-1`}
  font-size: 12px;
`;

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
}

function BottomModal({ onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    onClose?.();
  };

  //모달 외부 클릭시 모달창 꺼짐
  useOutsideClick(modalRef, handleClose);

  //외부 스크롤 방지
  useEffect(() => {
    const $body = document.querySelector('body');
    const overflow = $body?.style.overflow;
    if ($body) {
      $body.style.overflow = 'hidden';
    }
    return () => {
      if ($body) {
        $body.style.overflow = overflow || '';
      }
    };
  }, []);

  return (
    <ModalOverlay>
      <ModalWrapper ref={modalRef}>
        <ContentWrapper>
          <div>
            <ContentTitle>생존 여부 알림</ContentTitle>
            <ContentText>
              If I Die Tomorrow의 사후전송 서비스는 이용자의 마지막 사이트 접속
              일자를 기준으로 3개월간 접속이 없을 시 이용자가 가입한 소설 계정
              (카카오톡, 네이버)으로 1주일 간격으로 알림을 보내며 마지막 사이트
              접속 일자를 기준으로 6개월간 접속이 없다면 등록해둔 가족, 지인에게
              사용자의 사진 클라우드, 버킷리스트, 다이어리 내용과 등록한
              유언장을 전송합니다.
            </ContentText>
          </div>
          <div>
            <ContentTitle>내 기록 받아볼 사람</ContentTitle>
            <ContentText>
              나의 생전 기록을 전달할 사람들의 정보를 입력합니다. 최대 3명까지
              입력 가능합니다.
            </ContentText>
          </div>
        </ContentWrapper>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default BottomModal;
