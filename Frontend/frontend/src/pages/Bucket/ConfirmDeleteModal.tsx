import React from 'react';
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

interface DeleteConfirmModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  onClose,
  onDelete,
}) => {
  const handleConfirm = () => {
    onDelete();
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ContentContainer>
          정말 삭제하시겠습니까? 삭제된 다이어리는 되돌릴 수 없습니다.
        </ContentContainer>
        <div className="flex w-full justify-center my-4">
          <Button onClick={handleConfirm} color="#B3E9EB" size="sm">
            삭제하기
          </Button>
          <Button onClick={onClose} color="#B3E9EB" size="sm">
            취소
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default DeleteConfirmModal;
