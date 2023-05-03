import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { css } from 'styled-components';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import Button from '../../components/common/Button';
import TreeDot from '../../assets/icons/three_dot.svg';
import uploadIcon from '../../assets/icons/camera_alt.svg';
const Container = styled.div`
  ${tw`flex flex-col items-center w-full my-2`}
`;

const BucketContainer = styled.div`
  ${tw`flex items-center w-full h-[64px] bg-gray-100/80 px-4 my-1 border-l-8`}
`;
const FormContainer = styled.div`
  ${tw`flex flex-col w-full bg-gray-100/80 mt-4 pt-4 px-4`}
`;
const ContentContainer = styled.div`
  ${tw`flex items-center justify-between border-b border-black w-full h-[33px] px-[6px]`}
`;
const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[86px] rounded border-black break-all my-4`}
`;
const PhotoContainer = styled.div`
  ${tw`items-center self-end w-full min-h-[93px] my-2 rounded border border-dashed border-black`}
`;
const FeedCheckContainer = styled.div`
  ${tw`flex items-center w-full h-[24px] my-2`}
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
  const [isCompleted, setIsCompleted] = useState(false);
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
  const [imageUrl, setImageUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isCompleteDateValid, setIsCompleteDateValid] = useState(false);
  const [isCompleteContentValid, setIsCompleteContentValid] = useState(false);
  useEffect(() => {
    if (isCompleteContentValid && isCompleteDateValid) {
      setIsValid(true);
    }
  }, [{ isCompleteDateValid, isCompleteContentValid }]);
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
        return console.log(response.data);
      } catch (error) {
        throw error;
      }
    };
    const put_bucket = async () => {
      try {
        const response = await defaultApi.put(requests.PUT_BUCKET(), formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response);
        get_user_bucket();
      } catch (error) {
        throw error;
      }
    };

    put_bucket();
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
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
          <span className="text-p1">{bucket.title}</span>
        </ContentContainer>
        <div onClick={handleEditModalOpen}>
          <img className="cursor-pointer" src={TreeDot} alt="" />
        </div>
      </BucketContainer>

      {isClicked ? (
        <FormContainer>
          <DateTimePicker
            label="버킷 완료 일자 선택"
            value={completeDate}
            className="w-full"
            onChange={handleDateChange}
          />
          <form action="submit">
            <ContentInputContainer
              onChange={handleContentChange}
              value={completeContent}
              placeholder="버킷리스트 달성 과정과 느낀점을 입력해주세요."
            />
          </form>
          <PhotoContainer>
            <div className="image-upload-container w-full h-full">
              {imageUrl ? (
                <img
                  className="image-upload-preview w-full h-full bg-auto "
                  src={imageUrl}
                  alt="upload-preview"
                  onClick={handleClick}
                />
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
              color="#B3E9EB"
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
