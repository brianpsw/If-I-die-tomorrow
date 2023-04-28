import React from 'react';
import BottomModal from './BottomModal';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import DeleteIcon from '../../assets/icons/deleteIcon.svg';
import EditIcon from '../../assets/icons/editIcon.svg';

const ContentContainer = styled.div`
  ${tw`m-4 flex space-x-2`}
`;

interface EditOrDeleteModalProps {
  handleBucketEditModalOpen: () => void;
  handleDeleteModalOpen: () => void;
  onClose?: () => void;
}
function EditOrDeleteModal(props: EditOrDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleEditClick = () => {
    props.handleBucketEditModalOpen();
    props.onClose?.();
  };
  const handleDeleteClick = () => {
    props.handleDeleteModalOpen();
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
    <BottomModal onClose={props.onClose}>
      <ContentContainer onClick={handleEditClick}>
        <img src={EditIcon} alt="edit_icon" />
        <span>수정</span>
      </ContentContainer>
      <ContentContainer onClick={handleDeleteClick}>
        <img src={DeleteIcon} alt="delete_icon" />
        <span>삭제</span>
      </ContentContainer>

      <hr />
    </BottomModal>
  );
}

export default EditOrDeleteModal;
