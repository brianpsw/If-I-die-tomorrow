import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import DeleteCategoryOrPhotoModal from '../../components/PhotoCloud/DeleteCategoryOrPhotoModal';

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

function PhotoCloud() {
  const [category, setCategory] = useRecoilState(categoryState);
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
  const [editCategoryThumbnail, setEditCategoryThumbnail] =
    useState<boolean>(false);
  const [deleteContent, setDeleteContent] = useState<boolean>(false);

  const params = useParams();

  useEffect(() => {
    setSelectedCategory(params.categoryId!);
  }, [params.categoryId]);

  const fetchData = async () => {
    try {
      const get_all_category = await defaultApi.get(
        requests.GET_ALL_CATEGORY(),
        {
          withCredentials: true,
        },
      );
      if (get_all_category.status === 200) {
        setCategory(get_all_category.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div>
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
        setEditCategoryThumbnail={setEditCategoryThumbnail}
        editCategoryThumbnail={editCategoryThumbnail}
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
          setEditCategoryThumbnail={setEditCategoryThumbnail}
        ></PhotoCloudDetail>
      )}
    </div>
  );
}

export default PhotoCloud;
