import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '@iconify/react';

import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import DeleteCategoryOrPhotoModal from '../../components/PhotoCloud/DeleteCategoryOrPhotoModal';

import Button from '../../components/common/Button';
import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

function PhotoCloud() {
  const [openEditOrDeleteModal, setOpenEditOrDeleteModal] =
    useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  const [epic, setEpic] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [editOrDeleteModalEpic, setEditOrDeleteModalEpic] =
    useState<EditOrDeleteEpic>({
      titleEdit: false,
      contentEdit: false,
    });

  const handleEditOrDeleteModalOpen = () => {
    setOpenEditOrDeleteModal(true);
  };
  // 수정, 삭제 모달 close
  const onEditOrDeleteModalClose = () => {
    setOpenEditOrDeleteModal(false);
  };

  // 수정 모달 open
  const handleEditModalOpen = () => {
    if (epic === '제목') {
      setEditOrDeleteModalEpic({
        titleEdit: true,
        contentEdit: false,
      });
    } else if (epic === '내용') {
      setEditOrDeleteModalEpic({
        titleEdit: true,
        contentEdit: false,
      });
    }
  };
  // 수정 모달 close
  const onEditModalClose = () => {
    setOpenEditModal(false);
  };

  //삭제 모달 open
  const handleDeleteModalOpen = () => {
    if (epic === '제목') {
      setTargetId(selectedCategory);
    } else if (epic === '내용') {
      setTargetId(selectedPhotoId);
    }
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
          handleBucketEditModalOpen={handleEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      ) : null}
      {deleteModalOpen ? (
        <DeleteCategoryOrPhotoModal
          onClose={onDeleteModalClose}
          targetId={targetId}
          epic={epic}
        />
      ) : null}
      <PhotoCloudCategory
        setSelectedCategory={setSelectedCategory}
      ></PhotoCloudCategory>
      <PhotoCloudDetail
        setOpenEditOrDeleteModal={setOpenEditOrDeleteModal}
        setSelectedPhotoId={setSelectedPhotoId}
        selectedCategory={selectedCategory}
        setEpic={setEpic}
        setEditOrDeleteModalEpic={setEditOrDeleteModalEpic}
        editOrDeleteModalEpic={editOrDeleteModalEpic}
      ></PhotoCloudDetail>
    </Background>
  );
}

export default PhotoCloud;
