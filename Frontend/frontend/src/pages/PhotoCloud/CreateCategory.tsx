import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useRecoilValue } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import PhotoInput from '../../components/PhotoCloud/PhotoInput';
import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';
import { LeakAdd } from '@mui/icons-material';

function CreateCategory() {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [thumbColor, setThumbColor] = useState<string | null>('');
  const category = useRecoilValue(categoryState);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const recommendCategory: string[] = [
    '테마가 있는 사진',
    '나의 열정이 돋보이는 사진',
    '행복한 나',
    '나의 스트레스 해소 방법',
    '가장 찬란했던 순간',
    '내가 만든 요리',
    '내가 가장 오래 사용한 물건',
  ];

  // 카테고리명 확정짓는 함수
  const handleCategory = (category: string) => {
    setCustomTitle(category);
  };

  // 카테고리명 유효성 검사
  const handleTitle = (e: any) => {
    const regExp = /^.{0,30}$/;

    if (regExp.test(e.target.value)) {
      setCustomTitle(e.target.value);
    } else {
      alert('카테고리는 30자이내여야합니다.');
    }
  };

  // 다음단계로 넘어가기 전 카테고리명 존재 검사
  const handleNextStep = () => {
    const expspaces = /  +/g;
    if (customTitle === '') {
      alert('카테고리를 입력해주세요.');
    } else if (expspaces.test(customTitle)) {
      alert('카테고리는 연속된 공백이 있으면 안됩니다.');
    } else {
      setIsFirst(() => false);
    }
  };

  // 카테고리 생성 api 보내기 전 사진 유효성 검사
  const checkBeforeSend = () => {
    if (photoFile) {
      sendCategory();
    } else {
      alert('사진을 넣어주세요.');
    }
  };

  const changeColor = (e: any) => {
    setThumbColor(() => e.target.value);
  };

  // 카테고리 생성 api 보내기
  const sendCategory = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          name: customTitle,
          color: thumbColor,
        }),
      );

      if (photoFile) {
        formData.append('image', photoFile);
      }

      const post_category = await defaultApi.post(
        requests.POST_CATEGORY(),
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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

        <h4 className="text-h4 text-white text-center my-6">
          사진 카테고리를 만들어보세요.
        </h4>
        {isFirst ? (
          <div>
            <div className="flex flex-wrap justify-center ">
              {recommendCategory &&
                recommendCategory?.map((rec, idx) => {
                  return (
                    <div
                      key={idx}
                      className="inline-block bg-[#f6f6f6b3] px-8 py-4 rounded-[10px] m-3 cursor-pointer"
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
              onClick={handleNextStep}
            >
              다음 단계로 가기
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-p1 text-white text-center mb-6">
              카테고리 썸네일을 추가해주세요.
            </p>
            <div className="flex flex-col justify-center items-center mb-6">
              <PhotoInput
                imgUrl={imgUrl}
                setImgUrl={setImgUrl}
                photoFile={photoFile}
                setPhotoFile={setPhotoFile}
              />
              <label
                htmlFor="colorPicker"
                className="cursor-pointer text-p2 text-white mb-4"
              >
                썸네일 배경색을 추가해보세요! (기본값은 흰색입니다.)
              </label>
              <input
                type="color"
                defaultValue="#FFFFFF"
                className="cursor-pointer md:w-[40%] sm:w-[60%] w-[100%] h-[60px] bg-transparent"
                id="colorPicker"
                onChange={(e) => changeColor(e)}
              ></input>
            </div>
            <Button
              color={'#36C2CC'}
              size={'lg'}
              style={{ color: '#04373B', margin: '0 auto' }}
              onClick={checkBeforeSend}
            >
              카테고리 생성하기
            </Button>
          </div>
        )}
      </div>
    </Background>
  );
}

export default CreateCategory;
