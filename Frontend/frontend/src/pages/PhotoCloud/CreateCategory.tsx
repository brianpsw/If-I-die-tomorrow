import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';

function CreateCategory() {
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
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
    setCategoryTitle(category);
  };

  const handleCustom = () => {
    setIsCustom((prev: boolean) => !prev);
    setCustomTitle('');
    setCategoryTitle('');
  };

  const handleTitle = (e: any) => {
    const regExp = /^.{0,30}$/;
    const expspaces = /  +/g;
    if (regExp.test(e.target.value) && !expspaces.test(e.target.value)) {
      setCustomTitle(e.target.value);
    } else {
      alert('카테고리는 연속된 공백을 제외한 30자이내여야합니다.');
    }
  };

  const changeTitle = () => {
    setCategoryTitle(customTitle);
  };

  const sendCategory = async () => {
    try {
      const res = await defaultApi.post(
        requests.POST_CATEGORY(),
        {
          name: categoryTitle,
        },
        {
          withCredentials: true,
        },
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = () => {
    if (
      categoryTitle === '' ||
      categoryTitle.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/gi, '') === ''
    ) {
      alert('카테고리를 입력해주세요');
    } else {
      console.log(categoryTitle);
      sendCategory();
    }
  };

  return (
    <Background>
      <div style={{ padding: '16px 24px' }}>
        <Link to="/photo-cloud">
          <Icon
            icon="ph:x-bold"
            style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
          />
        </Link>
        <h2 className="text-h3 text-white text-center">
          사진 카테고리를 선택하세요
        </h2>
        <div className="flex flex-wrap justify-center">
          {recommendCategory?.map((rec, idx) => {
            return (
              <div
                key={idx}
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(246, 246, 246, 0.7)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  margin: '8px',
                }}
                onClick={() => handleCategory(rec)}
              >
                <p className="text-center text-gray_500" style={{}}>
                  {rec}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-white text-center">
          마음에 드는 테마가 없나요?
          <br /> 직접 테마를 만들어보세요!
        </p>
        {isCustom ? (
          <div
            className="w-full p-4 rounded-[10px]"
            style={{
              backgroundColor: 'rgba(246, 246, 246, 0.7)',
            }}
          >
            <input
              style={{
                width: '310px',
                height: '35px',
                borderRadius: '10px',
                padding: '0 16px',
              }}
              onChange={(e: any) => handleTitle(e)}
            />
            <div className="flex justify-evenly w-[310px] mt-4">
              <Button color={'#B4B4B4'} size={'sm'} onClick={handleCustom}>
                접기
              </Button>
              <Button
                color={'#36C2CC'}
                size={'sm'}
                style={{ color: '#04373B' }}
                onClick={changeTitle}
              >
                입력
              </Button>
            </div>
          </div>
        ) : (
          <Button
            color={'#36C2CC'}
            size={'sm'}
            style={{ color: '#04373B' }}
            onClick={handleCustom}
          >
            더보기
          </Button>
        )}

        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(246, 246, 246, 0.7)',
            padding: '8px 16px',
            borderRadius: '10px',
            marginTop: '16px',
            width: '342px',
            marginBottom: '32px',
          }}
        >
          <p className="text-h4 text-green_800 text-center h-[54px]">
            {categoryTitle}
          </p>
        </div>

        <Button
          color={'#36C2CC'}
          size={'lg'}
          style={{ color: '#04373B' }}
          onClick={createCategory}
        >
          테마 생성하기
        </Button>
      </div>
    </Background>
  );
}

export default CreateCategory;
