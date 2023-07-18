import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';

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
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getCategory: () => Promise<any>;
}

function DeleteCategoryOrPhotoModal(props: DeleteModalProps) {
  const {
    targetId,
    epic,
    onClose,
    setDeleteCategory,
    setDeleteContent,
    setIsLoading,
    getCategory,
  } = props;
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteCategory = async (id: string) => {
    onClose?.();
    setIsLoading(() => true);

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
        const res = getCategory();
        const getData = () => {
          res.then((data: any) => {
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
            style={{ color: '#04373B', marginRight: '16px' }}
          >
            삭제하기
          </Button>
          <Button
            onClick={handleClose}
            color="#eeeeee"
            size="sm"
            style={{ color: '#04373B' }}
          >
            취소
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default DeleteCategoryOrPhotoModal;
