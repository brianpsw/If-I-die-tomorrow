import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  categoryId: number;
  name: string;
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

interface PhotoCloudModalProps {
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPhotoId: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setEpic: React.Dispatch<React.SetStateAction<string>>;
  setEditOrDeleteModalEpic: React.Dispatch<
    React.SetStateAction<EditOrDeleteEpic>
  >;
  editOrDeleteModalEpic: EditOrDeleteEpic;
  // 사진 정보 가져오기
}

function PhotoCloudDetail(props: PhotoCloudModalProps) {
  const [photoData, setPhotoData] = useState<CategoryPhoto | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  // photo 데이터 받아오는 함수
  const fetchData = async () => {
    try {
      const get_photo = await defaultApi.get(
        requests.GET_PHOTO(props.selectedCategory),
        {
          withCredentials: true,
        },
      );
      if (get_photo.status === 200) {
        const { data } = get_photo;
        setPhotoData(() => data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const categoryId = photoData?.category.categoryId;
  const name = photoData?.category.name;
  const photos = photoData?.photos;

  useEffect(() => {
    fetchData();
    setEditTitle(name!);
  }, [props.selectedCategory]);

  const handleEditOrDeleteModalOpen = () => {
    props.setOpenEditOrDeleteModal(true);
  };

  const handleEditTitle = (e: any) => {
    const regExp = /^.{0,30}$/;
    const expspaces = /  +/g;
    if (regExp.test(e.target.value) && !expspaces.test(e.target.value)) {
      setEditTitle(e.target.value);
    } else {
      alert('카테고리는 연속된 공백을 제외한 30자이내여야합니다.');
    }
  };

  const changeCategory = async () => {
    try {
      const patch_category = await defaultApi.patch(
        requests.PATCH_CATEGORY(),
        { categoryId, name: editTitle },
        { withCredentials: true },
      );
      console.log(patch_category);
      // status 200이면
      // props.setEditOrDeleteModalEpic({ titleEdit: false, contentEdit: false });
    } catch (err) {
      console.error(err);
    }
  };

  const sendResCategoryTitle = () => {
    if (editTitle === '' || editTitle === ' ') {
      alert('카테고리를 입력해주세요');
    } else {
      console.log(editTitle);
      changeCategory();
    }
  };

  return (
    <PhotoWrapper>
      {photoData ? (
        <div>
          {props.editOrDeleteModalEpic.titleEdit ? (
            <div className="flex flex-col items-center">
              <input
                style={{
                  width: '342px',
                  padding: '8px 16px',
                  marginBottom: '24px',
                  borderRadius: '10px',
                }}
                defaultValue={name}
                onChange={(e: any) => handleEditTitle(e)}
              />
              <Button
                color="#36C2CC"
                size="sm"
                style={{ color: '#04373B' }}
                onClick={sendResCategoryTitle}
              >
                입력
              </Button>
            </div>
          ) : (
            <div className="flex justify-evenly">
              {name && (
                <h3 className="text-h3 text-white text-center">{name}</h3>
              )}
              <img
                src={whiteThreeDot}
                alt="three dot button"
                onClick={() => {
                  handleEditOrDeleteModalOpen();
                  props.setEpic('제목');
                }}
              />
            </div>
          )}

          <div>
            {photos!.length > 0 ? (
              photos!.map((photo: PhotoInfo) => {
                return (
                  <PhotoCardWrapper key={photo.photoId}>
                    <Photo src={photo.imageUrl} alt="추억이 담긴 사진" />
                    <p className="text-p3 text-green_800 mb-6">
                      {photo.caption}
                    </p>
                    <img
                      src={threeDot}
                      alt="three dot button"
                      onClick={() => {
                        handleEditOrDeleteModalOpen();
                        props.setEpic('내용');
                      }}
                    />
                  </PhotoCardWrapper>
                );
              })
            ) : (
              <p>사진이 없습니다.</p>
            )}
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </PhotoWrapper>
  );
}

export default PhotoCloudDetail;
