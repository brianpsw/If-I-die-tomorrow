import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import {
  PhotoStyle,
  PhotoCardWrapper,
  PhotoWrapper,
  Container,
} from './PhotoEmotion';
import { Navigation } from '../../components/common/Navigation';
import AuthWrapper from '../../api/AuthWrapper';

// 인터페이스 선언 (나중에 공통으로 빼서 import 해오는 방식으로 바꾸면 좋을듯?)
interface Category {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
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
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '10px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  marginBottom: '16px',
};

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
      <Container>
        <div className="categories flex flex-wrap flex-col fixed">
          {userData.photos.map((photoCategory: PhotoCategory) =>
            photoCategory.category.categoryId ===
            selectedCategory.categoryId ? (
              <div
                key={photoCategory.category.categoryId}
                className="border-[3px]"
                style={{
                  ...categoryStyle,
                  backgroundImage: `url(${photoCategory.category.imageUrl})`,
                }}
                onClick={() => handleCategory(photoCategory.category)}
              ></div>
            ) : (
              <div
                key={photoCategory.category.categoryId}
                style={{
                  ...categoryStyle,
                  backgroundImage: `url(${photoCategory.category.imageUrl})`,
                }}
                onClick={() => handleCategory(photoCategory.category)}
              />
            ),
          )}
        </div>
        {selectedCategory && (
          <PhotoWrapper>
            <h3 className="text-h3 text-center">{selectedCategory.name}</h3>
            <div
              className="flex-row"
              style={{ display: 'flex', flexWrap: 'wrap' }}
            >
              {getPhotosByCategory(selectedCategory.categoryId).map(
                (photo: Photo) => (
                  <PhotoCardWrapper key={photo.photoId}>
                    <PhotoStyle src={photo.imageUrl} alt={photo.caption} />
                    <p className="text-p3 text-green_800 mb-[20px]">
                      {photo.caption}
                    </p>
                  </PhotoCardWrapper>
                ),
              )}
            </div>
          </PhotoWrapper>
        )}
      </Container>
    </AuthWrapper>
  );
};

export default PhotoPage;
