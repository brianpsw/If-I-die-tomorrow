import { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import DeleteIcon from '../../assets/icons/deleteIcon.svg';
import EditIcon from '../../assets/icons/editIcon.svg';
const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
  left:0;
  top: 0;
`;

const slideUp = keyframes`
from {
    bottom: -125px;
}
to {
  bottom: 0;
}
`;

const ModalWrapper = styled.div`
  ${tw`bg-white flex flex-col items-center absolute border-solid rounded-xl h-auto w-full shadow font-sans`}
  bottom: 0;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
  animation-name: ${slideUp};
  animation-fill-mode: forwards;
`;

const ContentContainer = styled.div`
  ${tw`m-8 flex w-full justify-center space-x-2 cursor-pointer`}
`;

interface EditOrDeleteModalProps {
  handleBucketEditModalOpen: () => void;
  handleDeleteModalOpen: () => void;
  onClose?: () => void;
}
function EditOrDeleteModal({
  handleBucketEditModalOpen,
  handleDeleteModalOpen,
  onClose,
}: EditOrDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleEditClick = () => {
    handleBucketEditModalOpen();
    onClose?.();
  };
  const handleDeleteClick = () => {
    handleDeleteModalOpen();
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
        <ContentContainer onClick={handleEditClick}>
          <img src={EditIcon} alt="edit_icon" />
          <span className="text-p2">수정</span>
        </ContentContainer>
        <ContentContainer onClick={handleDeleteClick}>
          <img src={DeleteIcon} alt="delete_icon" />
          <span className="text-p2">삭제</span>
        </ContentContainer>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default EditOrDeleteModal;
