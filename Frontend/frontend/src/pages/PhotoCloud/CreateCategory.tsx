import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';
import PhotoInput from '../../components/PhotoCloud/PhotoInput';
import Button from '../../components/common/Button';

function CreateCategory() {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // 카테고리 생성 api 보내기
  const sendCategory = async () => {
    setIsLoading(() => true);
    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          name: customTitle,
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
        setIsLoading(() => false);
        Swal.fire({
          title: '카테고리 생성 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
        navigate(`/photo-cloud/${post_category.data.categoryId}`);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(() => false);
      Swal.fire({
        title: '카테고리 생성 실패...',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className="pb-[70px]">
      {isLoading && <Loading />}
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
                      <p className="text-center text-green_800 text-p1">
                        {rec}
                      </p>
                    </div>
                  );
                })}
            </div>
            <p className="text-white text-center my-6 text-p1">
              마음에 드는 카테고리가 없나요?
              <br /> 직접 카테고리를 만들어보세요!
            </p>

            <div className="flex justify-center">
              <input
                className="text-green_800 text-center text-p1 w-full md:max-w-[60%] sm:max-w-[80%] bg-[#f6f6f6b3] px-4 py-8 my-10 rounded-[10px]"
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
    </div>
  );
}

export default CreateCategory;
