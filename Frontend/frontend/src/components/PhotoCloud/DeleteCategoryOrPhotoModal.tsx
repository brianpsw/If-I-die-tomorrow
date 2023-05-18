import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';

import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';
import { useRecoilState } from 'recoil';
import { categoryState } from '../../states/CategoryState';

import Swal from 'sweetalert2';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Button from '../common/Button';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-gray-100 flex flex-col w-full mx-4 p-[16px] items-center border-solid rounded-xl shadow `}
`;

interface DeleteModalProps {
  targetId: string;
  epic: string;
  onClose?: () => void;
  setDeleteCategory: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteContent: React.Dispatch<React.SetStateAction<boolean>>;
  categoryOwner: number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteCategoryOrPhotoModal(props: DeleteModalProps) {
  const {
    targetId,
    epic,
    onClose,
    setDeleteCategory,
    setDeleteContent,
    categoryOwner,
    setIsLoading,
  } = props;
  const [category, setCategory] = useRecoilState(categoryState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setIsLoading(() => true);
    try {
      const get_all_category = await defaultApi.get(
        requests.GET_ALL_CATEGORY(),
        {
          withCredentials: true,
        },
      );
      if (get_all_category.status === 200) {
        setIsLoading(() => false);
        setCategory(() => get_all_category.data);
        return get_all_category.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    onClose?.();
    setIsLoading(() => true);
    if (categoryOwner === user!.userId) {
      try {
        const delete_category = await defaultApi.delete(
          requests.DELETE_CATEGORY(id),
          { withCredentials: true },
        );
        if (delete_category.status === 204) {
          setDeleteCategory(true);
          setIsLoading(() => false);
          Swal.fire({
            title: '카테고리 삭제 성공!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
          const res = fetchData();
          const getData = () => {
            res.then((data) => {
              if (data.length > 0) {
                navigate(`/photo-cloud/${data[0].categoryId}`, {
                  replace: true,
                });
              } else {
                navigate('/');
              }
            });
          };
          getData();
        }
      } catch (err) {
        console.error(err);
        setIsLoading(() => false);
        Swal.fire({
          title: '카테고리 삭제 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    } else {
      alert('본인의 카테고리만 삭제할 수 있습니다.');
    }
  };

  const deletePhoto = async (id: string) => {
    onClose?.();
    setIsLoading(() => true);
    try {
      const delete_photo = await defaultApi.delete(requests.DELETE_PHOTO(id), {
        withCredentials: true,
      });
      if (delete_photo.status === 204) {
        setDeleteContent(true);
        setIsLoading(() => false);
        Swal.fire({
          title: '사진 삭제 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      setIsLoading(() => false);
      Swal.fire({
        title: '사진 삭제 실패...',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleDelete = () => {
    // epic에 따라 카테고리 또는 사진을 삭제
    if (epic === '제목') {
      deleteCategory(targetId);
    } else if (epic === '내용') {
      deletePhoto(targetId);
    }
  };
  const handleClose = () => {
    onClose?.();
  };

  //모달 외부 클릭시 모달창 꺼짐
  useOutsideClick(modalRef, handleClose);

  //외부 스크롤 방지
  useEffect(() => {
    const $body = document.querySelector('body');
    const overflow = $body?.style.overflow;
    if ($body) {
      $body.style.overflow = 'hidden';
    }
    return () => {
      if ($body) {
        $body.style.overflow = overflow || '';
      }
    };
  }, []);

  return (
    <ModalOverlay>
      <ModalWrapper ref={modalRef}>
        {epic === '제목' ? (
          <p className="text-p2 text-center">
            삭제하시겠습니까? <br />
            삭제된 카테고리는 되돌릴 수 없습니다.
          </p>
        ) : (
          <p className="text-p2 text-center">
            삭제하시겠습니까? <br />
            삭제된 사진은 되돌릴 수 없습니다.
          </p>
        )}

        <div className="flex w-full justify-center my-4">
          <Button
            onClick={handleDelete}
            color="#B3E9EB"
            size="sm"
            style={{ color: '#04373B' }}
          >
            삭제하기
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default DeleteCategoryOrPhotoModal;
