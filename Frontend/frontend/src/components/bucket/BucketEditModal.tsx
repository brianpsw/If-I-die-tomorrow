import { useEffect, useRef, useState } from 'react';
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
  ${tw`bg-gray-100 flex flex-col w-full mx-[16px] px-[16px] items-center border-solid rounded-xl shadow `}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full text-p2 pt-[4px] h-[33px] bg-white rounded border-black break-all my-[16px] px-[6px]`}
`;
interface Bucket {
  bucketId: number;
  title: string;
  complete: string;
  secret: boolean;
}
interface BucketEditModalProps {
  selectedBucketId: number | null;
  selectedBucketContent: string;
  setBuckets: React.Dispatch<React.SetStateAction<Bucket[]>>;
  onClose?: () => void;
}

function BucketEditModal({
  selectedBucketId,
  selectedBucketContent,
  setBuckets,
  onClose,
}: BucketEditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contentValue, setContentValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(e.currentTarget.value);
    setIsValid(e.currentTarget.value.length > 0);
  };
  useEffect(() => {
    setContentValue(selectedBucketContent);
  }, [selectedBucketContent]);
  const handleEditSubmit = () => {
    //버킷리스트 수정 api 연결
    const get_user_bucket = async () => {
      try {
        const response = await defaultApi.get(requests.GET_USER_BUCKET(), {
          withCredentials: true,
        });
        setBuckets(response.data);
      } catch (error) {
        throw error;
      }
    };
    const patch_bucket = async () => {
      try {
        await defaultApi.patch(
          requests.PATCH_BUCKET(),
          {
            bucketId: selectedBucketId,
            title: contentValue,
          },

          {
            withCredentials: true,
          },
        );
        get_user_bucket();
        Swal.fire({
          title: '버킷 수정 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: '버킷 수정 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      }
    };
    patch_bucket();
    onClose?.();
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
        <ContentInputContainer
          onChange={handleContentChange}
          value={contentValue}
          placeholder={selectedBucketContent}
        />
        <div className="flex w-full justify-center my-4">
          <Button
            onClick={handleEditSubmit}
            color={isValid ? '#0E848A' : '#B3E9EB'}
            size="sm"
            disabled={isValid ? false : true}
          >
            수정 완료
          </Button>
        </div>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default BucketEditModal;
