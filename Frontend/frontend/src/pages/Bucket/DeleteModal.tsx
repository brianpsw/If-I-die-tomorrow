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
const ContentContainer = styled.div`
  ${tw`flex flex-wrap w-full pt-1 h-[60px] bg-white rounded border-black my-4 px-[6px]`}
`;
interface DeleteModalProps {
  selectedBucketId: string;
  onClose?: () => void;
}

function DeleteModal(props: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleDelete = () => {
    //버킷리스트 삭제 api 연결
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
        <ContentContainer>
          정말 삭제하시겠습니까? 삭제된 버킷은 되돌릴 수 없습니다.
        </ContentContainer>
        <div className="flex w-full justify-center my-4">
          <Button onClick={handleDelete} color="#B3E9EB" size="sm">
            삭제하기
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default DeleteModal;
