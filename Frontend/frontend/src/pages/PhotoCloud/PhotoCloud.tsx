import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';

import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';

function PhotoCloud() {
  const [openEditOrDeleteModal, setOpenEditOrDeleteModal] = useState(false);
  const [openCaptionEditModal, setOpenCaptionEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('4');

  const handleEditOrDeleteModalOpen = () => {
    setOpenEditOrDeleteModal(true);
  };
  // 수정, 삭제 모달 close
  const onEditOrDeleteModalClose = () => {
    setOpenEditOrDeleteModal(false);
  };

  // 버킷 수정 모달 open
  const handleCaptionEditModalOpen = () => {
    setOpenCaptionEditModal(true);
  };
  // 버킷 수정 모달 close
  const onCaptionEditModalClose = () => {
    setOpenCaptionEditModal(false);
  };

  //삭제 모달 open
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };
  //삭제 모달 close
  const onDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  return (
    <Background>
      {openEditOrDeleteModal ? (
        <EditOrDeleteModal
          onClose={onEditOrDeleteModalClose}
          handleBucketEditModalOpen={handleCaptionEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      ) : null}
      <PhotoCloudCategory
        setSelectedCategory={setSelectedCategory}
      ></PhotoCloudCategory>
      <PhotoCloudDetail
        setOpenEditOrDeleteModal={setOpenEditOrDeleteModal}
        setSelectedPhotoId={setSelectedPhotoId}
        selectedCategory={selectedCategory}
      ></PhotoCloudDetail>
    </Background>
  );
}

export default PhotoCloud;
