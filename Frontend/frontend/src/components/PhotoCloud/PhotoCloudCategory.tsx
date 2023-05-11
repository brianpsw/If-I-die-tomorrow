import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useRecoilValue } from 'recoil';
import { exchangeCategoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface CategoryInfo {
  categoryId: number;
  name: string;
  objectId: number;
}

interface PhotoCloudProps {
  setDeleteCategory: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCategory: boolean;
  cancelEdit: () => void;
}

function PhotoCloudCategory(props: PhotoCloudProps) {
  const categoryWrapper = useRef<HTMLDivElement>(null);
  const { setDeleteCategory, deleteCategory, cancelEdit } = props;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [categoryData, setCategoryData] = useState<CategoryInfo[] | null>(null);
  const exchange = useRecoilValue(exchangeCategoryState);
  const [scroll, setScroll] = useState<
    'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit' | 'initial' | 'unset'
  >('scroll');

  const fetchData = async () => {
    try {
      const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setCategoryData(() => data);
        setDeleteCategory(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (deleteCategory) fetchData();
  }, [deleteCategory]);

  const handleCategory = (id: number) => {
    if (categoryId !== id.toString()) {
      cancelEdit?.();
    }
    navigate(`/photo-cloud/${id}`);
  };

  window.addEventListener('resize', () => {
    if (categoryWrapper.current) {
      categoryWrapper.current.clientWidth > window.innerWidth
        ? setScroll(() => 'scroll')
        : setScroll(() => 'hidden');
    }
  });

  return (
    <div
      ref={categoryWrapper}
      style={{
        display: 'flex',
        padding: '16px 24px',
        overflowX: scroll,
      }}
    >
      {categoryData
        ? categoryData.map((category: CategoryInfo) => {
            if (categoryId === category.categoryId.toString()) {
              return (
                <div
                  className="bg-pink_100"
                  style={{
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
                    backgroundPosition: `${exchange[category.objectId]}`,
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
                    backgroundSize: '500%',
                    backgroundImage: `url('https://a307.s3.ap-northeast-2.amazonaws.com/thumbnail/thumbnail_and_logo_remove.webp')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${exchange[category.objectId]}`,
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
    </div>
  );
}

export default PhotoCloudCategory;
