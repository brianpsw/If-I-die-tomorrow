import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Loading from '../../components/common/Loading';
import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import DeleteCategoryOrPhotoModal from '../../components/PhotoCloud/DeleteCategoryOrPhotoModal';
import TopBar from '../../components/common/TopBar';

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

export interface Category {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

export interface PhotoInfo {
  photoId: number;
  imageUrl: string;
  caption: string;
  imageType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPhoto {
  category: Category;
  photos: PhotoInfo[];
}

function PhotoCloud() {
  const [category, setCategory] = useRecoilState(categoryState);
  const [photo, setPhoto] = useState<CategoryPhoto | null>(null);
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

  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    setSelectedCategory(params.categoryId!);
  }, [params.categoryId]);

  // 전체 카테고리 api 가져오는 함수
  const get_all_category = async () => {
    setIsCloudLoading(() => true);
    try {
      const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setCategory(data);
        setDeleteCategory(false);
        setEditCategoryThumbnail(false);
      }
    } catch (err) {
      console.error(err);
    }
    setIsCloudLoading(() => false);
  };

  const get_photo = async () => {
    try {
      const response = await defaultApi.get(
        requests.GET_PHOTO(selectedCategory),
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        const { data } = response;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 처음 렌더시 카테고리와 해당 카테고리의 사진 가져오기
  useEffect(() => {
    get_all_category();
    get_photo();
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
    <div className="min-h-[100vh]">
      {isDeleteLoading && <Loading />}
      {isCloudLoading && <Loading />}
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
            setIsLoading={setIsDeleteLoading}
          />
        ) : null}
        <TopBar title="포토 클라우드" />
        <PhotoCloudCategory
          deleteCategory={deleteCategory}
          cancelEdit={cancelEdit}
          editCategoryThumbnail={editCategoryThumbnail}
          getCategory={get_all_category}
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
    </div>
  );
}

export default PhotoCloud;
