import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

interface CategoryInfo {
  categoryId: number;
  name: string;
}

interface PhotoCloudCategoryProps {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function PhotoCloudCategory(props: PhotoCloudCategoryProps) {
  const [categoryData, setCategoryData] = useState<CategoryInfo[] | null>(null);

  const fetchData = async () => {
    try {
      const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response;
        setCategoryData(() => data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategory = (id: number) => {
    props.setSelectedCategory(id.toString());
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'scroll',
        padding: '16px 24px',
      }}
    >
      {categoryData ? (
        categoryData.map((category: CategoryInfo) => {
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
              }}
              key={category.categoryId}
              onClick={() => handleCategory(category.categoryId)}
            >
              <p className="text-h3">{category.categoryId}</p>
            </div>
          );
        })
      ) : (
        <p>null</p>
      )}
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
    </div>
  );
}

export default PhotoCloudCategory;
