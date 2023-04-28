import React, { useState, useEffect } from 'react';
import axios from 'axios';

import requests from '../../api/config';

interface CategoryInfo {
  categoryId: number;
  name: string;
}

interface PhotoCloudCategoryProps {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function PhotoCloudCategory(props: PhotoCloudCategoryProps) {
  const [categoryData, setCategoryData] = useState<CategoryInfo[] | null>(null);
  // const dummyData = [
  //   {
  //     categoryId: 4,
  //     name: '첫번째',
  //     color: 'red',
  //   },
  //   {
  //     categoryId: 5,
  //     name: '두번째',
  //     color: 'purple',
  //   },
  //   {
  //     categoryId: 6,
  //     name: '세번째',
  //     color: 'pink',
  //   },
  //   {
  //     categoryId: 7,
  //     name: '네번째',
  //     color: 'black',
  //   },
  //   {
  //     categoryId: 8,
  //     name: '다섯번째',
  //     color: 'skyblue',
  //   },
  //   {
  //     categoryId: 9,
  //     name: '여섯번째',
  //     color: 'orange',
  //   },
  //   {
  //     categoryId: 10,
  //     name: '일곱번째',
  //     color: 'blue',
  //   },
  // ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`${requests.base_url}/photo/category`, {
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
    <div className="flex">
      {categoryData ? (
        categoryData.map((category: CategoryInfo) => {
          return (
            <div
              style={{
                border: '1px solid #111',
                width: '30px',
                height: '30px',
                backgroundColor: 'white',
              }}
              key={category.categoryId}
              onClick={() => handleCategory(category.categoryId)}
            >
              {category.categoryId}
            </div>
          );
        })
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export default PhotoCloudCategory;
