import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Loading from '../../components/common/Loading';
import PhotoCloudCategory from '../../components/PhotoCloud/PhotoCloudCategory';
import PhotoCloudDetail from '../../components/PhotoCloud/PhotoCloudDetail';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import DeleteCategoryOrPhotoModal from '../../components/PhotoCloud/DeleteCategoryOrPhotoModal';
import TopBar from '../../components/common/TopBar';

export interface EditOrDeleteEpic {
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
  const setCategory = useSetRecoilState(categoryState);
  const [photo, setPhoto] = useState<CategoryPhoto | null>(null);
  const { categoryId } = useParams();

  const [openEditOrDeleteModal, setOpenEditOrDeleteModal] =
    useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [selectedPhotoCaption, setSelectedPhotoCaption] = useState<string>('');
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 전체 카테고리 api 호출 함수
  const get_all_category = async () => {
    setIsLoading(() => true);
    try {
      const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setCategory(data);
        setDeleteCategory(false);
        setEditCategoryThumbnail(false);
        // 카테고리 삭제 api 호출해서 결과를 받아올 때는 promise로 오기 때문에 return 값으로 data를 처리해줘야함.
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(() => false);
    return [];
  };

  // 해당 카테고리의 사진 api 호출 함수
  const get_photo = async () => {
    setIsLoading(() => true);
    try {
      const response = await defaultApi.get(requests.GET_PHOTO(categoryId), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setPhoto(data);
        setDeleteContent(false);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(() => false);
  };

  // 처음 렌더시 카테고리와 해당 카테고리의 사진 가져오기
  useEffect(() => {
    get_all_category();
    get_photo();
  }, []);

  // 카테고리 클릭시 해당 카테고리 사진 api 호출
  useEffect(() => {
    get_photo();
  }, [categoryId]);

  // 수정, 삭제 모달 close
  const closeEditOrDeleteModal = () => {
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
    setEditOrDeleteModalEpic({
      titleEdit: false,
      contentEdit: false,
    });
  };

  //삭제 모달 open
  const openDeleteModal = () => {
    if (epic === '제목') {
      setTargetId(categoryId!);
    } else if (epic === '내용') {
      setTargetId(selectedPhotoId);
    }
    setDeleteModalOpen(true);
  };

  //삭제 모달 close
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // 수정 api 호출 전 빈 값 체크하는 함수
  const checkEmptyBeforeSend = (
    targetContent: string,
    sendFunc: () => void,
  ) => {
    const expspaces = /  +/g;
    if (targetContent === '') {
      alert('내용을 입력해주세요');
    } else if (expspaces.test(targetContent)) {
      alert('연속된 공백이 있으면 안됩니다.');
    } else {
      sendFunc();
    }
  };

  const commonProps = {
    setOpenEditOrDeleteModal,
    setIsLoading,
    setEpic,
    editOrDeleteModalEpic,
    setEditOrDeleteModalEpic,
    cancelEdit,
    checkEmptyBeforeSend,
  };

  return (
    <div className="min-h-[100vh]">
      {isLoading && <Loading />}
      <div>
        {openEditOrDeleteModal ? (
          <EditOrDeleteModal
            onClose={closeEditOrDeleteModal}
            handleBucketEditModalOpen={handleEdit}
            handleDeleteModalOpen={openDeleteModal}
          />
        ) : null}
        {deleteModalOpen ? (
          <DeleteCategoryOrPhotoModal
            onClose={closeDeleteModal}
            targetId={targetId}
            epic={epic}
            setDeleteCategory={setDeleteCategory}
            setDeleteContent={setDeleteContent}
            setIsLoading={setIsLoading}
            getCategory={get_all_category}
          />
        ) : null}
        <TopBar title="포토 클라우드" />
        <PhotoCloudCategory
          deleteCategory={deleteCategory}
          setEditCategoryThumbnail={setEditCategoryThumbnail}
          editCategoryThumbnail={editCategoryThumbnail}
          getCategory={get_all_category}
          {...commonProps}
        />
        {categoryId && (
          <PhotoCloudDetail
            setSelectedPhotoId={setSelectedPhotoId}
            selectedPhotoId={selectedPhotoId}
            deleteContent={deleteContent}
            setSelectedPhotoCaption={setSelectedPhotoCaption}
            selectedPhotoCaption={selectedPhotoCaption}
            photoData={photo}
            getPhoto={get_photo}
            {...commonProps}
          />
        )}
      </div>
    </div>
  );
}

export default PhotoCloud;
