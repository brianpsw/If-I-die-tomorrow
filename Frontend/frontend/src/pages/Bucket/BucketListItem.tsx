import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

//
import EditModal from '../../components/common/EditModal';
import requests from '../../api/config';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import Button from '../../components/common/Button';
import TreeDot from '../../assets/icons/three_dot.svg';
import uploadIcon from '../../assets/icons/camera_alt.svg';
const Container = styled.div`
  ${tw`flex flex-col items-center w-full my-2`}
`;
const BucketContainer = styled.div`
  ${tw`flex items-center w-full h-[64px] bg-gray-100/80 px-4 my-1`}
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
interface BucketListItemProps {
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function BucketListItem(props: BucketListItemProps) {
  //Bucket controller
  const [isClicked, setIsClicked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const handleBucketClick = () => {
    setIsClicked(!isClicked);
  };

  //Form controller
  const [isChecked, setIsChecked] = useState(false);
  const [completeContent, setCompleteContent] = useState('');
  const [completeDate, setCompleteDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
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
  };

  //modal controller
  // const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModalOpen = () => {
    props.setOpenEditModal(true);
  };
  // const onLogoutClose = () => {
  //   setOpenEditModal(false);
  // };

  return (
    <Container>
      {/* {openEditModal ? <EditModal onClose={onLogoutClose} /> : null} */}
      <BucketContainer>
        {isCompleted ? (
          <img onClick={handleBucketClick} src={CheckedIcon} alt="" />
        ) : (
          <img onClick={handleBucketClick} src={UnCheckedIcon} alt="" />
        )}
        <ContentContainer onClick={handleBucketClick}>
          <span className="text-p1">청담스케쥴 김치볶음밥</span>
        </ContentContainer>
        <div onClick={handleEditModalOpen}>
          <img src={TreeDot} alt="" />
        </div>
      </BucketContainer>

      {isClicked ? (
        <FormContainer>
          <DateTimePicker
            label="챌린지 시작 일자 선택"
            value={completeDate}
            className="w-full"
            onChange={handleDateChange}
          />
          <form action="submit">
            <ContentInputContainer
              onChange={(e) => setCompleteContent(e.target.value)}
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
            <Button color="#B3E9EB" size="sm">
              작성 완료
            </Button>
          </div>
        </FormContainer>
      ) : null}
    </Container>
  );
}
export default BucketListItem;
