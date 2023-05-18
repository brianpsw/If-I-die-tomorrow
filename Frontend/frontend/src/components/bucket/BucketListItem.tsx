import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import Button from '../common/Button';
import TreeDot from '../../assets/icons/three_dot.svg';
import uploadIcon from '../../assets/icons/camera_alt.svg';
const Container = styled.div`
  ${tw`flex flex-col items-center w-full my-2`}
`;

const BucketContainer = styled.div`
  ${tw`flex items-center w-full h-[64px] bg-gray-100/80 px-[16px] my-[4px] border-l-[8px]`}
`;
const FormContainer = styled.div`
  ${tw`flex flex-col w-full bg-gray-100/80 mt-[16px] pt-[16px] px-[16px]`}
`;
const ContentContainer = styled.div`
  ${tw`flex items-center justify-between border-b border-black w-full h-[33px] px-[6px]`}
`;
const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full text-p2 h-[86px] p-[8px] rounded border-black break-all my-[16px]`}
`;
const TitleContainer = styled.textarea`
  ${tw`flex flex-wrap w-full  h-[40px] text-p1 rounded border-black break-all p-[8px] my-[8px]`}
`;
const PhotoContainer = styled.div`
  ${tw`items-center self-end w-full min-h-[93px] my-[8px] rounded border border-dashed border-black`}
`;
const FeedCheckContainer = styled.div`
  ${tw`flex items-center w-full h-[24px] my-[8px]`}
`;
const DeleteBtn = styled.div`
  ${tw`fill-black w-[30px] absolute h-[30px] right-[4px] top-[4px] cursor-pointer`}
`;
interface Bucket {
  bucketId: number;
  title: string;
  complete: string;
  secret: boolean;
}
interface BucketListItemProps {
  bucket: Bucket;
  setBuckets: React.Dispatch<React.SetStateAction<Bucket[]>>;
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBucketId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedBucketContent: React.Dispatch<React.SetStateAction<string>>;
  // 버킷 정보 가져오기
}
function BucketListItem({
  bucket,
  setBuckets,
  setOpenEditOrDeleteModal,
  setSelectedBucketId,
  setSelectedBucketContent,
}: BucketListItemProps) {
  //Bucket controller
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const handleBucketClick = () => {
    if (bucket.complete) {
      navigate(`/bucket/${bucket.bucketId}`);
    }
    setIsClicked(!isClicked);
  };

  //Form controller
  const [isChecked, setIsChecked] = useState(false);
  const [completeContent, setCompleteContent] = useState('');
  const [completeDate, setCompleteDate] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isCompleteDateValid, setIsCompleteDateValid] = useState(false);
  const [isCompleteContentValid, setIsCompleteContentValid] = useState(false);
  const [bucketTitle, setBucketTitle] = useState(bucket.title);
  useEffect(() => {
    const title = bucket.title;
    const maxLength = 18;
    if (title.length > maxLength) {
      const truncatedString = title.slice(0, maxLength) + '...';
      setBucketTitle(truncatedString);
    } else {
      setBucketTitle(title);
    }
  }, [bucket]);
  useEffect(() => {
    if (isCompleteContentValid && isCompleteDateValid) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [isCompleteDateValid, isCompleteContentValid]);
  const handleSubmit = () => {
    //버킷 완료 api 연결
    const formData = new FormData();
    let updatePhoto = false;
    if (photo) {
      formData.append('photo', photo); // 사진 파일이 있으면 formData에 추가
      updatePhoto = true;
    }
    formData.append(
      'data',
      JSON.stringify({
        bucketId: bucket.bucketId, // 버킷 리스트 ID
        title: bucket.title, // 제목
        content: completeContent, // 내용
        complete: completeDate, // 완료 여부
        secret: !isChecked, // 공개/비공개 여부
        updatePhoto: updatePhoto, // 사진을 바꿨다면 true로 보내주세요},
      }),
    );
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
    const put_bucket = async () => {
      try {
        await defaultApi.put(requests.PUT_BUCKET(), formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        get_user_bucket();
        Swal.fire({
          title: '버킷 완료 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: '버킷 완료 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      }
    };

    put_bucket();
  };
  const handleDeleteItemImage = () => {
    setPhoto(null);
    setImageUrl(null);
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (file) {
      let fileToUrl = URL.createObjectURL(file);
      setImageUrl(fileToUrl);
      setPhoto(file);
    }
  };
  const handleFeedCheckClick = () => {
    setIsChecked(!isChecked);
  };
  const handleClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleDateChange = (date: any) => {
    const transformedDate = dayjs(date).format('YYYY-MM-DD');
    setCompleteDate(transformedDate);
    setIsCompleteDateValid(true);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompleteContent(e.currentTarget.value);
    setIsCompleteContentValid(e.currentTarget.value.length > 0);
  };
  const handleEditModalOpen = () => {
    setOpenEditOrDeleteModal(true);
    //해당 버킷 id 전달
    setSelectedBucketId(bucket.bucketId);
    //해당 버킷 content 전달
    setSelectedBucketContent(bucket.title);
  };

  return (
    <Container>
      {/* <BucketContainer state={BucketState}> isClicked={isClicked}*/}
      <BucketContainer>
        {bucket.complete ? (
          <img onClick={handleBucketClick} src={CheckedIcon} alt="" />
        ) : (
          <img onClick={handleBucketClick} src={UnCheckedIcon} alt="" />
        )}
        <ContentContainer onClick={handleBucketClick}>
          <span className="text-p1">{bucketTitle}</span>
        </ContentContainer>
        {bucket.complete ? (
          ''
        ) : (
          <div onClick={handleEditModalOpen}>
            <img className="cursor-pointer" src={TreeDot} alt="" />
          </div>
        )}
      </BucketContainer>

      {isClicked ? (
        <FormContainer>
          <TitleContainer value={bucketTitle} disabled />
          <DatePicker
            label="버킷 완료 일자 선택"
            className="flex w-full"
            onChange={handleDateChange}
            disableFuture
          />
          <PhotoContainer>
            <div className="image-upload-container w-full h-full">
              {imageUrl ? (
                <div className="relative">
                  <DeleteBtn onClick={handleDeleteItemImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                  </DeleteBtn>
                  <img
                    className="image-upload-preview w-full h-full bg-auto "
                    src={imageUrl}
                    alt="upload-preview"
                    onClick={handleClick}
                  />
                </div>
              ) : (
                <div
                  className="image-upload-placeholder h-full"
                  onClick={handleClick}
                >
                  <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                    <img src={uploadIcon} alt="" />
                  </div>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                hidden
              />
            </div>
          </PhotoContainer>
          <form action="submit">
            <ContentInputContainer
              onChange={handleContentChange}
              value={completeContent}
              placeholder="버킷리스트 달성 과정과 느낀점을 입력해주세요."
            />
          </form>
          <FeedCheckContainer>
            {isChecked ? (
              <img onClick={handleFeedCheckClick} src={CheckedIcon} alt="" />
            ) : (
              <img onClick={handleFeedCheckClick} src={UnCheckedIcon} alt="" />
            )}
            <span className="text-p1 mx-2">피드 공개여부 체크</span>
          </FeedCheckContainer>
          <div className="flex w-full justify-center my-4">
            <Button
              onClick={handleSubmit}
              color={isValid ? '#0E848A' : '#B3E9EB'}
              size="sm"
              disabled={isValid ? false : true}
            >
              작성 완료
            </Button>
          </div>
        </FormContainer>
      ) : null}
    </Container>
  );
}
export default BucketListItem;
