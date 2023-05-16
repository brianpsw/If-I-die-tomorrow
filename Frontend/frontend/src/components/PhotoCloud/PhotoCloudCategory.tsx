import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useRecoilValue } from 'recoil';

import { CategoryWrapper } from '../../pages/PhotoCloud/PhotoCloudEmotion';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface CategoryInfo {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface PhotoCloudProps {
  setDeleteCategory: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCategory: boolean;
  cancelEdit: () => void;
  setEditCategoryThumbnail: React.Dispatch<React.SetStateAction<boolean>>;
  editCategoryThumbnail: boolean;
  setCategoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function PhotoCloudCategory(props: PhotoCloudProps) {
  const {
    setDeleteCategory,
    deleteCategory,
    cancelEdit,
    setEditCategoryThumbnail,
    editCategoryThumbnail,
    setCategoryLoading,
  } = props;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [categoryData, setCategoryData] = useState<CategoryInfo[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setCategoryData(() => data);
        setDeleteCategory(false);
        setEditCategoryThumbnail(false);
        setCategoryLoading(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (deleteCategory || editCategoryThumbnail) fetchData();
  }, [deleteCategory, editCategoryThumbnail]);

  const handleCategory = (id: number) => {
    if (categoryId !== id.toString()) {
      cancelEdit?.();
    }
    navigate(`/photo-cloud/${id}`);
  };

  return (
    <CategoryWrapper>
      {categoryData
        ? categoryData.map((category: CategoryInfo) => {
            if (categoryId === category.categoryId.toString()) {
              return (
                <div
                  style={{
                    flex: '0 0 auto',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'white',
                    borderRadius: '30px',
                    border: 'solid 2px #111',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px',
                    backgroundSize: 'cover',
                    backgroundImage: `url(${category.imageUrl})`,
                    backgroundRepeat: 'no-repeat',
                  }}
                  key={category.categoryId}
                  onClick={() => handleCategory(category.categoryId)}
                ></div>
              );
            } else {
              return (
                <div
                  style={{
                    flex: '0 0 auto',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'white',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px',
                    backgroundSize: 'cover',
                    backgroundImage: `url(${category.imageUrl})`,
                    backgroundRepeat: 'no-repeat',
                  }}
                  key={category.categoryId}
                  onClick={() => handleCategory(category.categoryId)}
                ></div>
              );
            }
          })
        : null}
      {categoryData && categoryData!.length < 10 ? (
        <div
          style={{
            flex: '0 0 auto',
            width: '55px',
            height: '55px',
            borderRadius: '30px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
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
    </CategoryWrapper>
  );
}

export default PhotoCloudCategory;
