import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import {
  Background,
  PhotoStyle,
  PhotoCardWrapper,
  PhotoWrapper,
} from './PhotoEmotion';

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

const PhotoPage = () => {
  const userData = useRecoilValue(userDataState);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    {} as Category,
  );

  //   카테고리 선택 / 초기화
  const handleCategory = (category: Category): void => {
    if (
      selectedCategory &&
      selectedCategory.categoryId === category.categoryId
    ) {
      return;
    } else {
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

  //   오브젝트의 이미지 가져오기
  const getObjectById = (objectId: number): string => {
    // object image url을 가져오는 로직

    const ObjectImageUrl: string = 'i am a string';

    return ObjectImageUrl;
  };

  return (
    <Background>
      <h1>Categories</h1>
      <div className="categories" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {userData.photos.map((photoCategory: PhotoCategory) => (
          <div
            key={photoCategory.category.categoryId}
            className="category"
            style={{ width: '18rem', marginBottom: '1rem', cursor: 'pointer' }}
            onClick={() => handleCategory(photoCategory.category)}
          >
            <img
              src={getObjectById(photoCategory.category.objectId)}
              alt={photoCategory.category.name}
              style={{ width: '100%' }}
            />
            <h2>{photoCategory.category.name}</h2>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <PhotoWrapper>
          <h2>Photos of {selectedCategory.name}</h2>
          <div className="photos" style={{ display: 'flex', flexWrap: 'wrap' }}>
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
  );
};

export default PhotoPage;
