import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import BucketListItem from '../../components/bucket/BucketListItem';
import CreateModal from '../../components/bucket/CreateModal';
import DeleteModal from '../../components/bucket/DeleteModal';
import IIDT from '../../assets/images/app_title.svg';
import backgroundImg from '../../assets/images/bucket_bg.png';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import BucketEditModal from '../../components/bucket/BucketEditModal';
import AddButtonIcon from '../../assets/icons/AddButtonIcon.svg';
import Carousel from '../../components/common/Carousel';
const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  background-attachment: fixed;
`;

const Container = styled.div`
  ${tw`flex items-center flex-col px-[24px] w-full h-[92vh] overflow-y-auto`}
  padding-bottom: 10%;
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[60px] my-[8px]`}
`;
interface Bucket {
  bucketId: number;
  title: string;
  complete: string;
  secret: boolean;
}
function Bucket() {
  const [openEditOrDeleteModal, setOpenEditOrDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openBucketEditModal, setOpenBucketEditModal] = useState(false);
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null);
  const [selectedBucketContent, setSelectedBucketContent] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  // 수정, 삭제 모달 open

  const handleEditOrDeleteModalOpen = () => {
    setOpenEditOrDeleteModal(true);
  };
  // 수정, 삭제 모달 close
  const onEditOrDeleteModalClose = () => {
    setOpenEditOrDeleteModal(false);
  };
  // 버킷 생성 모달 open
  const handleCreateModalOpen = () => {
    setOpenCreateModal(true);
  };
  // 버킷 생성 모달 close
  const onCreateModalClose = () => {
    setOpenCreateModal(false);
  };
  // 버킷 수정 모달 open
  const handleBucketEditModalOpen = () => {
    setOpenBucketEditModal(true);
  };
  // 버킷 수정 모달 close
  const onBucketEditModalClose = () => {
    setOpenBucketEditModal(false);
  };

  //삭제 모달 open
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };
  //삭제 모달 close
  const onDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  useEffect(() => {
    const get_user_bucket = async () => {
      try {
        const response = await defaultApi.get(requests.GET_USER_BUCKET(), {
          withCredentials: true,
        });
        setBuckets(response.data);
        return console.log(response.data);
      } catch (error) {
        throw error;
      }
    };
    get_user_bucket();
  }, []);
  return (
    <div className="w-full">
      {/* 수정, 삭제 모달 */}
      {openEditOrDeleteModal ? (
        <EditOrDeleteModal
          onClose={onEditOrDeleteModalClose}
          handleBucketEditModalOpen={handleBucketEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      ) : null}
      {/* 버킷 생성 모달 */}
      {openCreateModal ? (
        <CreateModal onClose={onCreateModalClose} setBuckets={setBuckets} />
      ) : null}
      {/* 버킷 수정 모달 */}
      {openBucketEditModal ? (
        <BucketEditModal
          onClose={onBucketEditModalClose}
          selectedBucketId={selectedBucketId}
          selectedBucketContent={selectedBucketContent}
          setBuckets={setBuckets}
        />
      ) : null}
      {deleteModalOpen ? (
        <DeleteModal
          onClose={onDeleteModalClose}
          selectedBucketId={selectedBucketId}
          setBuckets={setBuckets}
        />
      ) : null}
      {/* <Background> */}
      <Container>
        <LogoContainer src={IIDT} />
        {buckets &&
          buckets.map((bucket) => (
            <BucketListItem
              key={bucket.bucketId} // 고유 식별자 사용
              bucket={bucket}
              setOpenEditOrDeleteModal={setOpenEditOrDeleteModal}
              setSelectedBucketId={setSelectedBucketId}
              setSelectedBucketContent={setSelectedBucketContent}
              setBuckets={setBuckets}
            />
          ))}

        <img
          onClick={handleCreateModalOpen}
          className="fixed bottom-[78px] right-[10px] cursor-pointer"
          src={AddButtonIcon}
          alt=""
        />
      </Container>
      {/* </Background> */}
    </div>
  );
}

export default Bucket;
