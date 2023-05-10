import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';

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
}

function DeleteCategoryOrPhotoModal(props: DeleteModalProps) {
  const {
    targetId,
    epic,
    onClose,
    setDeleteCategory,
    setDeleteContent,
    categoryOwner,
  } = props;
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteCategory = async (id: string) => {
    if (user?.userId === categoryOwner) {
      try {
        const delete_category = await defaultApi.delete(
          requests.DELETE_CATEGORY(id),
          { withCredentials: true },
        );
        if (delete_category.status === 204) {
          navigate(`/photo-cloud/1`);
          setDeleteCategory(true);
          onClose?.();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('기본 카테고리는 삭제할 수 없습니다.');
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const delete_photo = await defaultApi.delete(requests.DELETE_PHOTO(id), {
        withCredentials: true,
      });
      if (delete_photo.status === 204) {
        setDeleteContent(true);
        onClose?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    // epic에 따라 카테고리 또는 사진을 삭제
    if (epic === '제목') {
      deleteCategory(targetId);
    } else if (epic === '내용') {
      deletePhoto(targetId);
    }
    // props.onClose?.();
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
