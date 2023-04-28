import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from '../../components/common/Button';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full pt-1 h-[33px] bg-white rounded border-black break-all my-4 px-[6px]`}
`;

interface BucketEditModalProps {
  selectedBucketId: string;
  selectedBucketContent: string;
  onClose?: () => void;
}

function BucketEditModal(props: BucketEditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contentValue, setContentValue] = useState('');
  const handleEditSubmit = () => {
    //버킷리스트 수정 api 연결
    props.onClose?.();
  };
  const handleClose = () => {
    props.onClose?.();
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
          placeholder={props.selectedBucketContent}
        />
        <div className="flex w-full justify-center my-4">
          <Button onClick={handleEditSubmit} color="#B3E9EB" size="sm">
            수정 완료
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default BucketEditModal;
