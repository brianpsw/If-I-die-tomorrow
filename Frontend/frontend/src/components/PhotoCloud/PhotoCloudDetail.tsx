import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import {
  PhotoWrapper,
  PhotoCardWrapper,
  Photo,
} from '../../pages/PhotoCloud/PhotoCloudEmotion';

import threeDot from '../../assets/icons/three_dot.svg';
import whiteThreeDot from '../../assets/icons/white_three_dot.svg';
import Button from '../../components/common/Button';

interface Category {
  userId: number;
  categoryId: number;
  name: string;
  objectId: number;
}

interface PhotoInfo {
  photoId: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryPhoto {
  category: Category;
  photos: PhotoInfo[];
}

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

interface PhotoCloudProps {
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPhotoId: React.Dispatch<React.SetStateAction<string>>;
  selectedPhotoId: string;
  selectedCategory: string;
  setEpic: React.Dispatch<React.SetStateAction<string>>;
  epic: string;
  setEditOrDeleteModalEpic: React.Dispatch<
    React.SetStateAction<EditOrDeleteEpic>
  >;
  editOrDeleteModalEpic: EditOrDeleteEpic;
  setDeleteContent: React.Dispatch<React.SetStateAction<boolean>>;
  deleteContent: boolean;
  setSelectedPhotoCaption: React.Dispatch<React.SetStateAction<string>>;
  selectedPhotoCaption: string;
  cancelEdit: () => void;
  setCategoryOwner: React.Dispatch<React.SetStateAction<number | null>>;
}

function PhotoCloudDetail(props: PhotoCloudProps) {
  const {
    setOpenEditOrDeleteModal,
    setSelectedPhotoId,
    selectedPhotoId,
    selectedCategory,
    setEpic,
    epic,
    setEditOrDeleteModalEpic,
    editOrDeleteModalEpic,
    setDeleteContent,
    deleteContent,
    setSelectedPhotoCaption,
    selectedPhotoCaption,
    cancelEdit,
    setCategoryOwner,
  } = props;
  const [photoData, setPhotoData] = useState<CategoryPhoto | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');

  // photo 데이터 받아오는 함수
  const fetchData = async () => {
    try {
      const get_photo = await defaultApi.get(
        requests.GET_PHOTO(selectedCategory),
        {
          withCredentials: true,
        },
      );
      if (get_photo.status === 200) {
        const { data } = get_photo;
        setPhotoData(() => data);
        setDeleteContent(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const categoryId = photoData?.category.categoryId;
  const categoryUser = photoData?.category.userId;
  const name = photoData?.category.name;
  const photos = photoData?.photos;

  useEffect(() => {
    fetchData();
    setEditTitle(name!);
  }, [selectedCategory]);

  useEffect(() => {
    setEditContent(selectedPhotoCaption);
  }, [selectedPhotoId]);

  useEffect(() => {
    if (deleteContent) fetchData();
  }, [deleteContent]);

  const handleEditOrDeleteModalOpen = () => {
    setOpenEditOrDeleteModal(true);
  };

  const handleEditTitle = (e: any) => {
    const regExp = /^.{0,30}$/;

    if (regExp.test(e.target.value)) {
      setEditTitle(e.target.value);
    } else {
      alert('카테고리는 30자이내여야합니다.');
    }
  };

  const handleEditContent = (e: any) => {
    const regExp = /^.{0,300}$/;

    if (regExp.test(e.target.value)) {
      setEditContent(e.target.value);
    } else {
      alert('내용은 300자이내여야합니다.');
    }
  };

  const changeCategory = async () => {
    try {
      const patch_category = await defaultApi.patch(
        requests.PATCH_CATEGORY(),
        { categoryId, name: editTitle },
        { withCredentials: true },
      );
      if (patch_category.status === 200) {
        setEditTitle(patch_category.data.name);
        fetchData();
        setEditOrDeleteModalEpic({
          titleEdit: false,
          contentEdit: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeContent = async () => {
    try {
      const patch_photo = await defaultApi.patch(
        requests.PATCH_PHOTO(),
        { photoId: selectedPhotoId, caption: editContent },
        { withCredentials: true },
      );
      if (patch_photo.status === 200) {
        fetchData();
        setEditOrDeleteModalEpic({
          titleEdit: false,
          contentEdit: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkBeforeSend = (targetContent: string) => {
    const expspaces = /  +/g;
    if (targetContent === '') {
      alert('내용을 입력해주세요');
    } else if (expspaces.test(targetContent)) {
      alert('연속된 공백이 있으면 안됩니다.');
    } else {
      if (epic === '제목') {
        changeCategory();
      } else {
        changeContent();
      }
    }
  };

  const handleCancelEdit = () => {
    cancelEdit?.();
  };

  return (
    <PhotoWrapper>
      {photoData ? (
        <div>
          {editOrDeleteModalEpic.titleEdit ? (
            <div className="flex flex-col items-center">
              <input
                className="w-5/6 px-4 py-2 mb-6 rounded-[10px] text-p1"
                defaultValue={name}
                maxLength={30}
                onChange={(e: any) => handleEditTitle(e)}
              />
              <div className="w-full flex justify-center">
                <Button
                  color="#36C2CC"
                  size="sm"
                  style={{ color: '#04373B', marginRight: '16px' }}
                  onClick={() => checkBeforeSend(editTitle)}
                >
                  입력
                </Button>
                <Button
                  color="#eeeeee"
                  size="sm"
                  style={{ color: '#04373B' }}
                  onClick={() => handleCancelEdit()}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-5/6 m-auto relative">
              {name && (
                <h4 className="text-h4 text-white text-center">{name}</h4>
              )}
              {categoryId === 1 ||
              categoryId === 2 ||
              categoryId === 3 ||
              categoryId === 4 ? null : (
                <img
                  className="absolute"
                  style={{ top: '35%', right: '-5%' }}
                  src={whiteThreeDot}
                  alt="three dot button"
                  onClick={() => {
                    handleEditOrDeleteModalOpen();
                    setEpic('제목');
                    setCategoryOwner(categoryUser ? categoryUser : null);
                  }}
                />
              )}
            </div>
          )}
          <div>
            {photos!.length > 0 ? (
              photos!.map((photo: PhotoInfo) => {
                return (
                  <PhotoCardWrapper key={photo.photoId}>
                    <Photo src={photo.imageUrl} alt="추억이 담긴 사진" />
                    {editOrDeleteModalEpic.contentEdit === true &&
                    selectedPhotoId === photo.photoId.toString() ? (
                      <div>
                        <textarea
                          defaultValue={photo.caption}
                          className="w-full min-h-[180px] rounded-[10px] p-4 text-p1"
                          onChange={(e: any) => handleEditContent(e)}
                        ></textarea>
                        <div className="w-full flex justify-center mt-4">
                          <Button
                            color="#36C2CC"
                            size="sm"
                            style={{ color: '#04373B', marginRight: '16px' }}
                            onClick={() => checkBeforeSend(editContent)}
                          >
                            입력
                          </Button>
                          <Button
                            color="#eeeeee"
                            size="sm"
                            style={{ color: '#04373B' }}
                            onClick={() => handleCancelEdit()}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-p3 text-green_800 mb-[20px]">
                          {photo.caption}
                        </p>
                        <img
                          className="absolute bottom-6 right-6"
                          src={threeDot}
                          alt="three dot button"
                          onClick={() => {
                            handleEditOrDeleteModalOpen();
                            setEpic('내용');
                            setSelectedPhotoId(photo.photoId.toString());
                            setSelectedPhotoCaption(photo.caption);
                          }}
                        />
                      </div>
                    )}
                  </PhotoCardWrapper>
                );
              })
            ) : (
              <p className="text-h3 text-white text-center mt-12">
                사진이 없습니다.
              </p>
            )}
            {photos!.length < 3 ? (
              <Link to={`/photo-cloud/upload-photo/${categoryId}`}>
                <Icon
                  icon="ph:plus-circle"
                  className="text-pink_100 w-[55px] h-[55px] mx-auto mt-4"
                />
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </PhotoWrapper>
  );
}

export default PhotoCloudDetail;
