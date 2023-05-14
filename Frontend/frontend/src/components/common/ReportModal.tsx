import { useEffect, useRef, useState } from 'react';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import useOutsideClick from '../../hooks/useOutsideClick';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from './Button';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
  left:0;
  top: 0;
`;

const ModalWrapper = styled.div`
  ${tw`bg-white flex flex-col items-center absolute border-solid rounded-xl h-auto w-full shadow mt-[50%] font-sans`}
  bottom: 0;
`;

const ContentContainer = styled.div`
  ${tw`m-8 flex space-x-2`}
`;

const ReportOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
  left:0;
  top: 0;
`;

const ReportWrap = styled.div`
  ${tw`text-p1 bg-gray-100 flex flex-col w-full mx-4 px-[16px] items-center border-solid rounded-xl shadow `}
`;

const ReportContainer = styled.div`
  ${tw`flex flex-wrap w-full pt-4 h-[60px] bg-white rounded border-black my-4 px-[6px]`}
`;

interface ReportModalProps {
  handleReportModalOpen: () => void;
  onClose?: () => void;
  typeId: number;
}

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onConfirm, onCancel }) => (
  <ReportOverlay>
    <ReportWrap>
      <ReportContainer>
        <p style={{ margin: '0 auto', textAlign: 'center' }}>
          정말 신고하시겠습니까?
        </p>
      </ReportContainer>
      <div className="flex w-full justify-evenly my-4">
        <Button
          onClick={onConfirm}
          color="#B3E9EB"
          size="sm"
          style={{ color: '#04373B' }}
        >
          신고하기
        </Button>

        <Button
          onClick={onCancel}
          color="#B3E9EB"
          size="sm"
          style={{ color: '#04373B' }}
        >
          취소
        </Button>
      </div>
    </ReportWrap>
  </ReportOverlay>
);

function ReportModal({
  handleReportModalOpen,
  onClose,
  typeId,
}: ReportModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(true);
  const handleReportClick = () => {
    // handleReportModalOpen();
    // onClose?.();
    setReportModalOpen(false);
    setConfirmModalOpen(true);
  };

  const handleClose = () => {
    // 확인 버튼을 누르면, 신고를 처리하고 모든 모달을 닫습니다.
    handleReportModalOpen();
    onClose?.();
    setConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    // 신고 처리
    defaultApi
      .post(
        requests.POST_REPORT_FEED(),
        {
          content: 'Inappropriate content',
          type: true,
          typeId: typeId,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        console.log(response.data);
        // 모든 모달 닫기
        handleReportModalOpen();
        onClose?.();
        setConfirmModalOpen(false);
        alert('신고가 성공적으로 처리되었습니다.');
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('이미 신고한 게시물입니다.');
          handleReportModalOpen();
          onClose?.();
          setConfirmModalOpen(false);
        } else {
          alert('신고 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      });
  };

  const handleCancel = () => {
    // 취소 버튼을 누르면, 확인 모달만 닫습니다.
    onClose?.();
    setConfirmModalOpen(false);
  };

  //모달 외부 클릭시 모달창 꺼짐
  useOutsideClick(modalRef, handleClose);

  //외부 스크롤 방지
  useEffect(() => {
    const $body = document.querySelector('body');
    const overflow = $body?.style.overflow;
    if ($body) {
      if (reportModalOpen || confirmModalOpen) {
        $body.style.overflow = 'hidden';
      } else {
        $body.style.overflow = overflow || '';
      }
    }
    return () => {
      if ($body) {
        $body.style.overflow = overflow || '';
      }
    };
  }, [reportModalOpen, confirmModalOpen]);
  return (
    <div>
      {reportModalOpen && (
        <ModalOverlay>
          <ModalWrapper ref={modalRef}>
            <ContentContainer onClick={handleReportClick}>
              {/* <img src={ReportIcon} alt="report_icon" /> */}
              <span className="text-p2">신고</span>
            </ContentContainer>
          </ModalWrapper>
        </ModalOverlay>
      )}
      {confirmModalOpen && (
        <ModalOverlay>
          <ConfirmModal onConfirm={handleConfirm} onCancel={handleCancel} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default ReportModal;
