import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import axios from 'axios';

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
}

function DeleteCategoryOrPhotoModal(props: DeleteModalProps) {
  const params = useParams();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteCategory = async (id: string) => {
    try {
      const delete_category = await defaultApi.delete(
        requests.DELETE_CATEGORY(id),
        { withCredentials: true },
      );
      if (delete_category.status === 204) {
        navigate(`/photo-cloud/1`);
        props.setDeleteCategory(true);
        props.onClose?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const delete_photo = await defaultApi.delete(requests.DELETE_PHOTO(id), {
        withCredentials: true,
      });
      if (delete_photo.status === 204) {
        props.setDeleteContent(true);
        props.onClose?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    // epic에 따라 카테고리 또는 사진을 삭제
    if (props.epic === '제목') {
      deleteCategory(props.targetId);
    } else if (props.epic === '내용') {
      deletePhoto(props.targetId);
    }
    // props.onClose?.();
  };
  const handleClose = () => {
    props.onClose?.();
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
        {props.epic === '제목' ? (
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
