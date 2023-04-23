import { useEffect, useRef, useState, ReactNode } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';

const ModalOverlay = styled.div`
  ${tw`flex items-end justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-white flex flex-col items-center absolute border-solid rounded-xl h-auto w-[342px] shadow mt-[50%] mb-[50%] font-sans`}
`;

const ContentWrapper = styled.div`
  ${tw`m-1`}
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
        <ContentWrapper>{children}</ContentWrapper>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default BottomModal;
