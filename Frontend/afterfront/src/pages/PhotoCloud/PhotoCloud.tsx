import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import {
  Background,
  PhotoStyle,
  PhotoCardWrapper,
  PhotoWrapper,
} from './PhotoEmotion';
import { Navigation } from '../../components/common/Navigation';
import AuthWrapper from '../../api/AuthWrapper';

// 인터페이스 선언 (나중에 공통으로 빼서 import 해오는 방식으로 바꾸면 좋을듯?)
interface Category {
  userId: number;
  categoryId: number;
  name: string;
  objectId: number;
}

interface Photo {
  photoId: number;
  imageUrl: string;
  caption: string;
  created: string;
  updated: string;
}

interface PhotoCategory {
  category: Category;
  photos: Photo[];
}

const categoryStyle = {
  flex: '0 0 auto',
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '10px',
  backgroundSize: '500%',
  backgroundImage: `url('https://a307.s3.ap-northeast-2.amazonaws.com/thumbnail/thumbnail_and_logo_remove.webp')`,
  backgroundRepeat: 'no-repeat',
};

const exchange = [
  '0 0',
  '-60px 0',
  '-120px 0',
  '-180px 0',
  '-240px 0',
  '0 -60px',
  '-60px -60px',
  '-120px -60px',
  '-180px -60px',
  '-240px -60px',
];
const PhotoPage = () => {
  const userData = useRecoilValue(userDataState);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    {} as Category,
  );
  if (Object.keys(userData).length === 0) {
    return <AuthWrapper></AuthWrapper>;
  }

  //   카테고리 선택 / 초기화
  const handleCategory = (category: Category): void => {
    if (
      selectedCategory &&
      selectedCategory.categoryId === category.categoryId
    ) {
      return;
    } else {
      console.log(category.objectId);
      setSelectedCategory(category);
    }
  };

  //   해당 카테고리의 이미지 가져오기
  const getPhotosByCategory = (categoryId: number): Photo[] => {
    const photoCategory = userData.photos.find(
      (photoCategory: PhotoCategory) =>
        photoCategory.category.categoryId === categoryId,
    );

    return photoCategory ? photoCategory.photos : [];
  };

  return (
    <AuthWrapper>
      <Navigation />
      <Background>
        <div
          className="categories"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
          }}
        >
          {userData.photos.map((photoCategory: PhotoCategory) =>
            photoCategory.category.categoryId ===
            selectedCategory.categoryId ? (
              <div
                key={photoCategory.category.categoryId}
                className="bg-pink_100"
                style={{
                  ...categoryStyle,
                  backgroundPosition: `${
                    exchange[photoCategory.category.objectId - 1]
                  }`,
                }}
                onClick={() => handleCategory(photoCategory.category)}
              ></div>
            ) : (
              <div
                key={photoCategory.category.categoryId}
                className="bg-white"
                style={{
                  ...categoryStyle,
                  backgroundPosition: `${
                    exchange[photoCategory.category.objectId - 1]
                  }`,
                }}
                onClick={() => handleCategory(photoCategory.category)}
              />
            ),
          )}
        </div>
        {selectedCategory && (
          <PhotoWrapper>
            <h2>Photos of {selectedCategory.name}</h2>
            <div
              className="flex-row"
              style={{ display: 'flex', flexWrap: 'wrap' }}
            >
              {getPhotosByCategory(selectedCategory.categoryId).map(
                (photo: Photo) => (
                  <PhotoCardWrapper key={photo.photoId}>
                    <PhotoStyle src={photo.imageUrl} alt={photo.caption} />
                  </PhotoCardWrapper>
                ),
              )}
            </div>
          </PhotoWrapper>
        )}
      </Background>
    </AuthWrapper>
  );
};

export default PhotoPage;
