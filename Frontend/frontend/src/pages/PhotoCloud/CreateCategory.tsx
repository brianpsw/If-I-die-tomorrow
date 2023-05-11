import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useRecoilValue } from 'recoil';
import {
  categoryState,
  exchangeCategoryState,
} from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';

function CreateCategory() {
  const navigate = useNavigate();
  const category = useRecoilValue(categoryState);
  const exchange = useRecoilValue(exchangeCategoryState);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [usedObjects, setUsedObjects] = useState<number[]>([]);
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

  useEffect(() => {
    const arr: number[] = [];
    category?.forEach((cat) => {
      arr.push(cat.objectId);
    });
    setUsedObjects(() => [...arr]);
  }, []);

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

  const checkBeforeSend = () => {
    if (selectedObject) {
      sendCategory();
    } else {
      alert('오브젝트를 선택해주세요.');
    }
  };

  const handleClickObject = (id: number) => {
    if (selectedObject === id) {
      setSelectedObject(() => null);
    } else {
      setSelectedObject(() => id);
    }
  };

  const sendCategory = async () => {
    try {
      const post_category = await defaultApi.post(
        requests.POST_CATEGORY(),
        {
          name: customTitle,
          objectId: selectedObject,
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
          사진 카테고리를 만들어보세요.
        </p>
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
            <div className="flex flex-wrap justify-center">
              {Object.keys(exchange)?.map((ex: string) => {
                if (!usedObjects.includes(parseInt(ex, 10))) {
                  if (parseInt(ex, 10) === selectedObject) {
                    return (
                      <div
                        key={ex}
                        className="w-2/6 h-20 min-h-[60px] bg-pink_100 rounded-[10px] mr-6 mb-6 flex justify-center items-center cursor-pointer"
                        onClick={() => handleClickObject(parseInt(ex))}
                      >
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundSize: '500%',
                            backgroundImage: `url('https://a307.s3.ap-northeast-2.amazonaws.com/thumbnail/thumbnail_and_logo_remove.webp')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: `${exchange[ex]}`,
                          }}
                        ></div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={ex}
                        className="w-2/6 h-20 min-h-[60px] bg-white rounded-[10px] mr-6 mb-6 flex justify-center items-center cursor-pointer"
                        onClick={() => setSelectedObject(parseInt(ex))}
                      >
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundSize: '500%',
                            backgroundImage: `url('https://a307.s3.ap-northeast-2.amazonaws.com/thumbnail/thumbnail_and_logo_remove.webp')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: `${exchange[ex]}`,
                          }}
                        ></div>
                      </div>
                    );
                  }
                }
              })}
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
