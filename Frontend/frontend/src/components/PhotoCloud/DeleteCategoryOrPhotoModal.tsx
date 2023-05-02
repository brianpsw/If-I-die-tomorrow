import { useEffect, useRef, useState } from 'react';
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
  ${tw`bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;

interface DeleteModalProps {
  targetId: string;
  epic: string;
  onClose?: () => void;
}

function DeleteCategoryOrPhotoModal(props: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteCategory = async (id: string) => {
    try {
      const delete_category = await defaultApi.delete(
        requests.DELETE_CATEGORY(id),
        { withCredentials: true },
      );
      console.log(delete_category);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const delete_photo = await defaultApi.delete(requests.DELETE_PHOTO(id), {
        withCredentials: true,
      });
      console.log(delete_photo);
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
          <p>삭제하시겠습니까? 삭제된 카테고리는 되돌릴 수 없습니다.</p>
        ) : (
          <p>삭제하시겠습니까? 삭제된 사진은 되돌릴 수 없습니다.</p>
        )}

        <div className="flex w-full justify-center my-4">
          <Button onClick={handleDelete} color="#B3E9EB" size="sm">
            삭제하기
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default DeleteCategoryOrPhotoModal;
