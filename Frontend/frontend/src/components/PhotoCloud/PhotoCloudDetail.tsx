import React, { useState, useEffect } from 'react';
import axios from 'axios';

import requests from '../../api/config';
import {
  PhotoWrapper,
  PhotoCardWrapper,
  Photo,
} from '../../pages/PhotoCloud/PhotoCloudEmotion';

import threeDot from '../../assets/icons/three_dot.svg';

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

  // const photoData: CategoryPhoto = {
  //   category: {
  //     categoryId: 1,
  //     name: '가장 행복했던 순간',
  //   },
  //   photos: [
  //     {
  //       photoId: 1,
  //       imageUrl: 'https://cdn.imweb.me/thumbnail/20230308/6e8091381c157.jpg',
  //       caption:
  //         '이 피자로 말할 것 같으면 내가 가장 힘들었던 순간 나의 친구 홀롤룰루가 사준 피자이다. 나는 이 피자를 먹는 순간 눈물이 너무 났다. 진한 치즈의 풍미가 예술이었기때문이다. 눈이 오던 추운 날이었는데 나에게 피자를 먹이고 싶어서 눈발을 뚫고 나를 찾아온 홀롤룰루의 마음씨와 피자의 맛이 나를 다시 일으켜 세웠다.',
  //       createdAt: '2023-04-28',
  //       updatedAt: '2023-04-28',
  //     },
  //     {
  //       photoId: 2,
  //       imageUrl:
  //         'https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/361/a0ca1bf285383d038f3521f3e19bd7f9_res.jpeg',
  //       caption:
  //         '춘식이는 나에게 전부라고 할 수 있다. 춘식이와 함께한 시간들은 모두 소중하고 행복한 시간이였다.',
  //       createdAt: '2023-04-28',
  //       updatedAt: '2023-04-28',
  //     },
  //   ],
  // };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${requests.base_url}/photo/${props.selectedCategory}`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        const { data } = response;
        setPhotoData(() => data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const name = photoData?.category.name;
  const photos = photoData?.photos;

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditOrDeleteModalOpen = (id: number) => {
    props.setOpenEditOrDeleteModal(true);
  };

  return (
    <PhotoWrapper>
      {photoData ? (
        <div>
          {name && <h3 className="text-h3 text-white text-center">{name}</h3>}
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
