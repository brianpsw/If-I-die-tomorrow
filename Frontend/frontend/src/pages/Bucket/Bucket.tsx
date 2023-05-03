import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import BucketListItem from './BucketListItem';
import CreateModal from '../../components/common/CreateModal';
import DeleteModal from './DeleteModal';
import IIDT from '../../assets/icons/IIDT.svg';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import BucketEditModal from './BucketEditModal';
import AddButtonIcon from '../../assets/icons/AddButtonIcon.svg';

const Container = styled.div`
  ${tw`flex items-center flex-col px-[24px] w-full h-[90vh] overflow-auto`}
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[60px] w-[71px] h-[44px] my-2`}
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
    <div className="max-w-[390px]">
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
          className="fixed bottom-[78px] left-[330px]"
          src={AddButtonIcon}
          alt=""
        />
      </Container>
    </div>
  );
}

export default Bucket;
