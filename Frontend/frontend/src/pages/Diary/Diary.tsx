import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const Container = styled.div`
  ${tw`flex items-center justify-between border-b w-full `}
`;
function Diary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openBottomModal = () => {
    setIsBottomModalOpen(true);
  };
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  const onLogoutClose = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsBottomModalOpen(false);
  };
  return (
    <div>
      <div>
        <h2>diary</h2>
        <Container onClick={openModal}>일반 모달</Container>
        <Container onClick={openBottomModal}>바텀 모달</Container>
        <Container onClick={openEditModal}>수정 모달</Container>
      </div>
    </div>
  );
}

export default Diary;
