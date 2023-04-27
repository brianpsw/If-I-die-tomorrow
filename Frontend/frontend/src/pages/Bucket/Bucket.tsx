import NavBar from '../../components/common/NavBar';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import BucketListItem from './BucketListItem';
import Logo from '../../assets/icons/logo.svg';
import IIDT from '../../assets/icons/IIDT.svg';
import EditModal from '../../components/common/EditModal';
const Container = styled.div`
  ${tw`flex items-center flex-col px-[24px] w-full h-[100vh]`}
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[60px] w-[71px] h-[44px] my-2`}
`;

function Bucket() {
  //modal controller
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModalOpen = () => {
    setOpenEditModal(true);
  };
  const onLogoutClose = () => {
    setOpenEditModal(false);
  };
  return (
    <div>
      {openEditModal ? <EditModal onClose={onLogoutClose} /> : null}
      <Container>
        <LogoContainer src={IIDT} />
        <BucketListItem setOpenEditModal={setOpenEditModal} />
        <BucketListItem setOpenEditModal={setOpenEditModal} />
        <BucketListItem setOpenEditModal={setOpenEditModal} />
      </Container>
    </div>
  );
}

export default Bucket;
