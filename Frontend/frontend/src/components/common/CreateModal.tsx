import { useEffect, useRef, useState, ReactNode } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from './Button';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full pt-1 h-[33px] bg-white rounded border-black break-all my-4 px-[6px]`}
`;

interface ModalProps {
  onClose?: () => void;
}

function CreateModal({ onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contentValue, setContentValue] = useState('');
  const handleSubmit = () => {
    //버킷리스트 추가 api 연결
    onClose?.();
  };
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
        <ContentInputContainer
          onChange={(e) => setContentValue(e.target.value)}
          value={contentValue}
          placeholder="버킷리스트 내용을 작성해주세요."
        />
        <div className="flex w-full justify-center my-4">
          <Button onClick={handleSubmit} color="#B3E9EB" size="sm">
            작성 완료
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default CreateModal;
