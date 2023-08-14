import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Swal from 'sweetalert2';
import {
  CategoryWrapper,
  CategoryContainer,
} from '../../pages/PhotoCloud/PhotoCloudEmotion';
import { useRecoilValue } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import { EditOrDeleteEpic } from '../../pages/PhotoCloud/PhotoCloud';
import PhotoInput from './PhotoInput';
import threeDot from '../../assets/icons/white_three_dot.svg';
import Button from '../../components/common/Button';

interface CategoryInfo {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface PhotoCloudProps {
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCategory: boolean;
  cancelEdit: () => void;
  setEpic: React.Dispatch<React.SetStateAction<string>>;
  setEditOrDeleteModalEpic: React.Dispatch<
    React.SetStateAction<EditOrDeleteEpic>
  >;
  editOrDeleteModalEpic: EditOrDeleteEpic;
  setEditCategoryThumbnail: React.Dispatch<React.SetStateAction<boolean>>;
  editCategoryThumbnail: boolean;
  getCategory: () => Promise<any>;
  checkEmptyBeforeSend: (targetContent: string, sendFunc: () => void) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function PhotoCloudCategory(props: PhotoCloudProps) {
  const {
    setOpenEditOrDeleteModal,
    deleteCategory,
    cancelEdit,
    setEpic,
    setEditOrDeleteModalEpic,
    editOrDeleteModalEpic,
    setEditCategoryThumbnail,
    editCategoryThumbnail,
    getCategory,
    checkEmptyBeforeSend,
    setIsLoading,
  } = props;
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const categoryData = useRecoilValue(categoryState);
  const [categoryName, setCategoryName] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentImg, setCurrentImg] = useState<string>('');

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
      const selectedCategoryArr = categoryData.filter((category) => {
        return category.categoryId.toString() === categoryId;
      });
      setCategoryName(() => selectedCategoryArr[0]?.name);
      setEditTitle(() => selectedCategoryArr[0]?.name);
      setCurrentImg(() => selectedCategoryArr[0]?.imageUrl);
      setImgUrl(() => selectedCategoryArr[0]?.imageUrl);
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

  // 카테고리 조건 만족하는지 체크
  const handleEditTitle = (e: any) => {
    const regExp = /^.{0,30}$/;

    if (regExp.test(e.target.value)) {
      setEditTitle(e.target.value);
    } else {
      alert('카테고리는 30자이내여야합니다.');
    }
  };

  // 카테고리 수정 api
  let isModifyCategory = '';
  let isModifyThumbnail = '';
  const changeCategory = async () => {
    setIsLoading(() => true);
    try {
      const patch_category = await defaultApi.patch(
        requests.PATCH_CATEGORY(),
        { categoryId, name: editTitle },
        { withCredentials: true },
      );
      if (patch_category.status === 200) {
        setEditTitle(patch_category.data.name);
        getCategory();
        setEditOrDeleteModalEpic({
          titleEdit: false,
          contentEdit: false,
        });
        isModifyCategory = '성공';
      }
    } catch (err) {
      console.error(err);
      isModifyCategory = '실패';
    }

    if (currentImg !== imgUrl) {
      try {
        const formData = new FormData();
        formData.append(
          'data',
          JSON.stringify({
            categoryId: categoryId,
          }),
        );

        if (photoFile) {
          formData.append('image', photoFile);
        }

        const patch_thumbnail = await defaultApi.patch(
          requests.PATCH_THUMBNAIL(),
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (patch_thumbnail.status === 200) {
          setEditCategoryThumbnail(() => true);
          isModifyThumbnail = '성공';
        }
      } catch (err) {
        console.error(err);
        isModifyThumbnail = '실패';
      }
    }

    setIsLoading(() => false);

    if (
      (isModifyCategory === '성공' && isModifyThumbnail === '') ||
      (isModifyCategory === '성공' && isModifyThumbnail === '성공')
    ) {
      Swal.fire({
        title: '카테고리 수정 성공!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
    } else if (isModifyCategory === '실패' || isModifyThumbnail === '실패') {
      Swal.fire({
        title: '카테고리 수정 실패...',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }

    isModifyCategory = '';
    isModifyThumbnail = '';
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
      {editOrDeleteModalEpic.titleEdit ? (
        <div className="flex flex-col items-center">
          <input
            className="w-5/6 px-4 py-2 mb-6 rounded-[10px] text-p1"
            defaultValue={categoryName}
            maxLength={30}
            onChange={(e: any) => handleEditTitle(e)}
          />
          <PhotoInput
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
            photoFile={photoFile}
            setPhotoFile={setPhotoFile}
            uploadType={'thumb'}
          />
          <div className="w-full flex justify-center">
            <Button
              color="#36C2CC"
              size="sm"
              style={{ color: '#04373B', marginRight: '16px' }}
              onClick={() => checkEmptyBeforeSend(editTitle, changeCategory)}
            >
              입력
            </Button>
            <Button
              color="#eeeeee"
              size="sm"
              style={{ color: '#04373B' }}
              onClick={() => cancelEdit?.()}
            >
              취소
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-5/6 m-auto relative">
          {categoryName && (
            <h4 className="text-h4 text-white text-center">{categoryName}</h4>
          )}

          <img
            className="absolute cursor-pointer"
            style={{ top: '35%', right: '-5%' }}
            src={threeDot}
            alt="three dot button"
            onClick={() => {
              setOpenEditOrDeleteModal(true);
              setEpic('제목');
            }}
          />
        </div>
      )}
    </CategoryWrapper>
  );
}

export default PhotoCloudCategory;
