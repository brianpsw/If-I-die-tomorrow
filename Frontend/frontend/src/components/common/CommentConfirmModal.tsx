import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from './Button';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
  left:0;
  top: 0;
`;

const ModalWrapper = styled.div`
  ${tw`text-p1 bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;
const ContentContainer = styled.div`
  ${tw`flex flex-wrap w-full pt-1 h-[60px] bg-white rounded border-black my-4 px-[6px]`}
`;

interface CommentConfirmModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const CommentConfirmModal: React.FC<CommentConfirmModalProps> = ({
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
          정말 삭제하시겠습니까?
          <br />
          삭제된 댓글은 되돌릴 수 없습니다.
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

export default CommentConfirmModal;
