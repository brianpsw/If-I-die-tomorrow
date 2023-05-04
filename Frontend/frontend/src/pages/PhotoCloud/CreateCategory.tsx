import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';
import { fontSize } from '@mui/system';

function CreateCategory() {
  const navigate = useNavigate();
  const [customTitle, setCustomTitle] = useState<string>('');
  const recommendCategory: string[] = [
    '가장 사랑하는 사람',
    '맛있는 음식',
    '가장 멋졌던 여행',
    '테마가 있는 사진',
    '나의 열정이 돋보이는 사진',
    '행복한 나',
  ];

  const handleCategory = (category: string) => {
    setCustomTitle(category);
  };

  const handleTitle = (e: any) => {
    const regExp = /^.{0,30}$/;

    if (regExp.test(e.target.value)) {
      setCustomTitle(e.target.value);
    } else {
      alert('카테고리는 30자이내여야합니다.');
    }
  };

  const checkBeforeSend = () => {
    const expspaces = /  +/g;
    if (customTitle === '') {
      alert('카테고리를 입력해주세요.');
    } else if (expspaces.test(customTitle)) {
      alert('카테고리는 연속된 공백이 있으면 안됩니다.');
    } else {
      sendCategory();
    }
  };

  const sendCategory = async () => {
    try {
      const post_category = await defaultApi.post(
        requests.POST_CATEGORY(),
        {
          name: customTitle,
          // objectId: objectNumber넣어줍시다 일단 1-10으로 넣기
        },
        {
          withCredentials: true,
        },
      );
      if (post_category.status === 201) {
        navigate(`/photo-cloud/${post_category.data.categoryId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Background>
      <div style={{ padding: '16px 24px' }}>
        <Icon
          icon="ph:x-bold"
          style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
          onClick={() => {
            navigate(-1);
          }}
        />

        <p className="text-h4 text-white text-center my-6">
          사진 카테고리를 선택하세요
        </p>
        <div className="flex flex-wrap justify-center ">
          {recommendCategory &&
            recommendCategory?.map((rec, idx) => {
              return (
                <div
                  key={idx}
                  className="inline-block bg-[#f6f6f6b3] px-8 py-4 rounded-[10px] m-3"
                  onClick={() => handleCategory(rec)}
                >
                  <p className="text-center text-green_800">{rec}</p>
                </div>
              );
            })}
        </div>
        <p className="text-white text-center my-6">
          마음에 드는 카테고리가 없나요?
          <br /> 직접 카테고리를 만들어보세요!
        </p>

        <div className="flex justify-center">
          <input
            className="text-green_800 text-center w-full md:max-w-[60%] sm:max-w-[80%] bg-[#f6f6f6b3] px-4 py-8 my-10 rounded-[10px]"
            defaultValue={customTitle}
            placeholder="나만의 카테고리를 넣어주세요."
            onChange={(e: any) => handleTitle(e)}
          />
        </div>

        <Button
          color={'#36C2CC'}
          size={'lg'}
          style={{ color: '#04373B', margin: '0 auto' }}
          onClick={checkBeforeSend}
        >
          테마 생성하기
        </Button>
      </div>
    </Background>
  );
}

export default CreateCategory;
