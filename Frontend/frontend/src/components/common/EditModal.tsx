import React from 'react';
import BottomModal from './BottomModal';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import tw from 'twin.macro';
import DeleteIcon from '../../assets/icons/deleteIcon.svg';
import EditIcon from '../../assets/icons/editIcon.svg';
import { useState } from 'react';
import { useEffect } from 'react';

const ContentContainer = styled.div`
  ${tw`m-4 flex space-x-2`}
`;

interface ModalProps {
  onClose?: () => void;
}
function EditModal({ onClose }: ModalProps) {
  return (
    <BottomModal onClose={onClose}>
      <ContentContainer>
        <img src={EditIcon} alt="edit_icon" />
        <span>수정</span>
      </ContentContainer>
      <ContentContainer>
        <img src={DeleteIcon} alt="delete_icon" />
        <span>삭제</span>
      </ContentContainer>

      <hr />
    </BottomModal>
  );
}

export default EditModal;
