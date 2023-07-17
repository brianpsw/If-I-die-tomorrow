import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import {
  CategoryWrapper,
  CategoryContainer,
} from '../../pages/PhotoCloud/PhotoCloudEmotion';
import { useRecoilValue } from 'recoil';
import { categoryState } from '../../states/CategoryState';

interface CategoryInfo {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface PhotoCloudProps {
  deleteCategory: boolean;
  cancelEdit: () => void;
  editCategoryThumbnail: boolean;
  getCategory: () => void;
}

function PhotoCloudCategory(props: PhotoCloudProps) {
  const { deleteCategory, cancelEdit, editCategoryThumbnail, getCategory } =
    props;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const categoryData = useRecoilValue(categoryState);
  const [categoryName, setCategoryName] = useState<String>('');

  // 원 모양의 카테고리 버튼 스타일 코드
  const categoryStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    cursor: 'pointer',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
    backgroundSize: 'cover',
    backgroundColor: 'white',
    backgroundRepeat: 'no-repeat',
  };
  // 카테고리 제목 가져오기
  useEffect(() => {
    if (categoryData) {
      const selectedCategory = categoryData.filter((category) => {
        return category.categoryId.toString() === categoryId;
      });
      setCategoryName(() => selectedCategory[0].name);
    }
  }, [categoryData, categoryId]);

  // 카테고리가 삭제되거나 편집되었을 때 카테고리를 다시 불러오기
  useEffect(() => {
    if (deleteCategory || editCategoryThumbnail) getCategory();
  }, [deleteCategory, editCategoryThumbnail]);

  // 현재 페이지와 편집하고있던 카테고리가 달라질 경우 편집하던 것 취소하고 이동하기
  const handleCategory = (id: number) => {
    if (categoryId !== id.toString()) {
      cancelEdit?.();
    }
    navigate(`/photo-cloud/${id}`);
  };

  return (
    <CategoryWrapper>
      <CategoryContainer>
        {categoryData
          ? categoryData.map((category: CategoryInfo) => {
              if (categoryId === category.categoryId.toString()) {
                // 선택된 카테고리일 경우 border에 스타일링을 더해줌
                return (
                  <div
                    style={{
                      ...categoryStyle,
                      border: 'solid 2px #111',
                      backgroundImage: `url(${category.imageUrl})`,
                    }}
                    key={category.categoryId}
                    onClick={() => handleCategory(category.categoryId)}
                  ></div>
                );
              } else {
                return (
                  // 선택되지 않는 카테고리는 border 스타일링 없이 렌더링
                  <div
                    style={{
                      ...categoryStyle,
                      backgroundImage: `url(${category.imageUrl})`,
                    }}
                    key={category.categoryId}
                    onClick={() => handleCategory(category.categoryId)}
                  ></div>
                );
              }
            })
          : null}
        {categoryData && categoryData!.length < 10 ? (
          // 생성된 카테고리가 10개 미만일 때만 카테고리 생성 버튼 렌더링
          <div
            className="flex w-[55px] h-[55px] rounded-[30px] cursor-pointer justify-center items-center mr-[10px]"
            style={{
              flex: '0 0 auto',
            }}
          >
            <Link to="/photo-cloud/create-category">
              <Icon
                icon="ph:plus-circle"
                style={{ width: '40px', height: '40px' }}
                className="text-pink_100"
              />
            </Link>
          </div>
        ) : null}
      </CategoryContainer>
      <h4 className="text-h4 text-white text-center">{categoryName}</h4>
    </CategoryWrapper>
  );
}

export default PhotoCloudCategory;
