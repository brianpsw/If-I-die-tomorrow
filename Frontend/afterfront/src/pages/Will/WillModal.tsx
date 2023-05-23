import { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-gray-100 flex flex-col items-center border-solid rounded-xl shadow w-[90vw] `}
`;

interface ModalProps {
  onClose?: () => void;
  children?: any;
}

function WillDocModal({ onClose, children }: ModalProps) {
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
        {/* <ContentInputContainer value={content} /> */}
        {children}
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default WillDocModal;
