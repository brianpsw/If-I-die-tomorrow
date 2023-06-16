import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import Swal from 'sweetalert2';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Button from '../common/Button';
import Loading from '../common/Loading';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-gray-100 flex flex-col w-full mx-[16px] px-[16px] items-center border-solid rounded-xl shadow `}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full pt-[4px] h-[33px] text-p2 bg-white rounded border-black break-all my-[16px] px-[6px]`}
`;
interface Bucket {
  bucketId: number;
  title: string;
  complete: string;
  secret: boolean;
}
interface ModalProps {
  setBuckets: React.Dispatch<React.SetStateAction<Bucket[]>>;
  onClose?: () => void;
  setNoticeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateModal({ onClose, setBuckets, setNoticeOpen }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contentValue, setContentValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(e.currentTarget.value);
    setIsValid(e.currentTarget.value.length > 0);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    //버킷리스트 추가 api 연결
    const get_user_bucket = async () => {
      try {
        const response = await defaultApi.get(requests.GET_USER_BUCKET(), {
          withCredentials: true,
        });
        setBuckets(response.data);
        if (response.data.length > 0) {
          setNoticeOpen(() => false);
        } else {
          setNoticeOpen(() => true);
        }
      } catch (error) {
        throw error;
      }
    };
    const post_bucket = async () => {
      try {
        await defaultApi.post(
          requests.POST_BUCKET(),
          {
            title: contentValue,
          },
          {
            withCredentials: true,
          },
        );

        await get_user_bucket();
        Swal.fire({
          title: '버킷 생성 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: '버킷 생성 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    await post_bucket();
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
      {isLoading ? (
        <Loading /> // 로딩 상태가 true일 경우 Loading 컴포넌트를 렌더링합니다.
      ) : (
        <ModalWrapper ref={modalRef}>
          <ContentInputContainer
            onChange={handleContentChange}
            value={contentValue}
            placeholder="버킷리스트 내용을 작성해주세요."
          />
          {!isValid ? (
            <span className="text-yellow-500 text-p2">
              버킷리스트 내용을 입력해주세요.
            </span>
          ) : (
            ''
          )}
          <div className="flex w-full justify-center my-[16px]">
            <Button
              onClick={handleSubmit}
              color={isValid ? '#0E848A' : '#B3E9EB'}
              size="sm"
              disabled={isValid ? false : true}
            >
              작성 완료
            </Button>
          </div>
        </ModalWrapper>
      )}
    </ModalOverlay>
  );
}

export default CreateModal;
