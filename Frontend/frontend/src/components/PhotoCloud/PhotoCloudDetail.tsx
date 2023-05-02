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

interface PhotoCloudModalProps {
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPhotoId: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  // 사진 정보 가져오기
}

function PhotoCloudDetail(props: PhotoCloudModalProps) {
  const [photoData, setPhotoData] = useState<CategoryPhoto | null>(null);

  // photo 데이터 받아오는 함수
  const fetchData = async () => {
    try {
      const response = await defaultApi.get(
        requests.GET_PHOTO(props.selectedCategory),
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        const { data } = response;
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
  }, [props.selectedCategory]);

  const handleEditOrDeleteModalOpen = (id: number) => {
    props.setOpenEditOrDeleteModal(true);
  };

  return (
    <PhotoWrapper>
      {photoData ? (
        <div>
          <div className="flex justify-evenly">
            {name && <h3 className="text-h3 text-white text-center">{name}</h3>}
            <img
              src={whiteThreeDot}
              alt="three dot button"
              onClick={() => handleEditOrDeleteModalOpen(categoryId!)}
            />
          </div>

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
                      onClick={() => handleEditOrDeleteModalOpen(photo.photoId)}
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
