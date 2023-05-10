import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import DeleteCategoryOrPhotoModal from '../../components/PhotoCloud/DeleteCategoryOrPhotoModal';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

function PhotoCloud() {
  const [openEditOrDeleteModal, setOpenEditOrDeleteModal] =
    useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [selectedPhotoCaption, setSelectedPhotoCaption] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryOwner, setCategoryOwner] = useState<number | null>(null);
  const [epic, setEpic] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [editOrDeleteModalEpic, setEditOrDeleteModalEpic] =
    useState<EditOrDeleteEpic>({
      titleEdit: false,
      contentEdit: false,
    });
  const [deleteCategory, setDeleteCategory] = useState<boolean>(false);
  const [deleteContent, setDeleteContent] = useState<boolean>(false);

  const params = useParams();

  useEffect(() => {
    setSelectedCategory(params.categoryId!);
  }, [params.categoryId]);

  // 수정, 삭제 모달 close
  const onEditOrDeleteModalClose = () => {
    setOpenEditOrDeleteModal(false);
  };

  // 수정으로가기
  const handleEdit = () => {
    if (epic === '제목') {
      setEditOrDeleteModalEpic({
        titleEdit: true,
        contentEdit: false,
      });
    } else if (epic === '내용') {
      setEditOrDeleteModalEpic({
        titleEdit: false,
        contentEdit: true,
      });
    }
  };

  // 수정 취소

  const cancelEdit = () => {
    if (epic === '제목') {
      setEditOrDeleteModalEpic({
        titleEdit: false,
        contentEdit: false,
      });
    } else if (epic === '내용') {
      setEditOrDeleteModalEpic({
        titleEdit: false,
        contentEdit: false,
      });
    }
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
          handleBucketEditModalOpen={handleEdit}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      ) : null}
      {deleteModalOpen ? (
        <DeleteCategoryOrPhotoModal
          onClose={onDeleteModalClose}
          targetId={targetId}
          epic={epic}
          setDeleteCategory={setDeleteCategory}
          setDeleteContent={setDeleteContent}
          categoryOwner={categoryOwner!}
        />
      ) : null}
      <PhotoCloudCategory
        setDeleteCategory={setDeleteCategory}
        deleteCategory={deleteCategory}
        cancelEdit={cancelEdit}
      ></PhotoCloudCategory>
      {selectedCategory && (
        <PhotoCloudDetail
          setOpenEditOrDeleteModal={setOpenEditOrDeleteModal}
          setSelectedPhotoId={setSelectedPhotoId}
          selectedPhotoId={selectedPhotoId}
          selectedCategory={selectedCategory}
          setEpic={setEpic}
          epic={epic}
          setEditOrDeleteModalEpic={setEditOrDeleteModalEpic}
          editOrDeleteModalEpic={editOrDeleteModalEpic}
          setDeleteContent={setDeleteContent}
          deleteContent={deleteContent}
          setSelectedPhotoCaption={setSelectedPhotoCaption}
          selectedPhotoCaption={selectedPhotoCaption}
          cancelEdit={cancelEdit}
          setCategoryOwner={setCategoryOwner}
        ></PhotoCloudDetail>
      )}
    </Background>
  );
}

export default PhotoCloud;
