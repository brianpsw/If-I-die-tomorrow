import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import uploadIcon from '../../assets/icons/camera_alt.svg';
import Button from './Button';
import { Icon } from '@iconify/react';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';

const ModalOverlay = styled.div`
  ${tw`text-p1 flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`p-8 bg-white border-solid rounded-xl w-[380px] shadow font-sans justify-between`}
  height: 80%;
  overflow-y: auto;
  position: relative;
`;

const ContentEditForm = styled.form`
  ${tw`flex flex-col justify-between`}
  // border: solid 1px black;
  height: 90%;
`;

const EditSection = styled.div`
  ${tw`flex flex-col mb-4`}
`;

const EditLabel = styled.label`
  ${tw`mb-2 flex flex-col`}
  font-weight: bold;
`;

const TitleEditInput = styled.input`
  ${tw``}
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 4px;
  padding: 6px 12px;
`;

const PhotoContainer = styled.div`
  ${tw`items-center self-end w-full min-h-[93px] my-2 rounded border border-dashed border-black overflow-hidden`}
`;

const ContentEditInput = styled.textarea`
  ${tw``}
  border: 1px solid #ccc;
  width: 100%;
  height: 100px;
  border-radius: 4px;
  padding: 6px 12px;
`;

const ButtonWrap = styled.div`
  ${tw`flex`}
  justify-content: center;
  // border: 1px solid #ccc;
  padding-top: 15px;
  padding-bottom: 20px;
`;

const DeleteImageButton = styled.button`
  ${tw`fill-black w-[30px] absolute h-[30px] right-[4px] top-[4px] cursor-pointer`}// justify-content: flex-end;
  // color: black;
  // width: 100%;
  // text-align: center;
`;

interface EditDiaryModalProps {
  diaryId: number;
  title: string;
  content: string;
  secret: boolean;
  image: string;
  onClose?: () => void;
  onUpdate?: (updatedDiary: any) => void;
}

function EditDiaryModal({
  diaryId,
  title,
  content,
  secret,
  image,
  onClose,
  onUpdate,
}: EditDiaryModalProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newSecret, setNewSecret] = useState(secret);
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUpdated, setImageUpdated] = useState<boolean>(false);
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(image);

  const removeImage = () => {
    setPhoto(null);
    setUpdatePhoto(true);
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() === '' || newContent.trim() === '') {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          diaryId,
          title: newTitle,
          content: newContent,
          secret: newSecret,
          updatePhoto, // updatePhoto 추가
        }),
      );

      if (photo !== null) {
        formData.append('photo', photo);
      }

      const response = await defaultApi.put(requests.PUT_DIARY(), formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        if (onClose) {
          onClose();
        }
        if (onUpdate) {
          // Add this line
          onUpdate(response.data); // Add this line
        } // Add this line
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhoto(file);
      setImageUpdated(true);
      setUpdatePhoto(true);

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Update this line
    const { name, value } = e.target;
    if (name === 'title') {
      setNewTitle(value);
    } else if (name === 'content') {
      setNewContent(value);
    }
  };

  const handleCheckboxChange = () => {
    setNewSecret(!newSecret);
  };

  return (
    <ModalOverlay>
      <ModalWrapper>
        <h2 className="text-h3 text-center" style={{ marginBottom: '5%' }}>
          다이어리 수정
        </h2>
        <Icon
          icon="line-md:remove"
          onClick={onClose}
          className="absolute right-6 top-7"
        />
        <ContentEditForm onSubmit={handleSubmit}>
          <EditSection>
            <EditLabel htmlFor="title">제목</EditLabel>
            <TitleEditInput
              type="text"
              id="title"
              name="title"
              value={newTitle}
              onChange={handleInputChange}
            />
          </EditSection>
          <EditSection>
            <EditLabel htmlFor="photo">사진 선택</EditLabel>
            <PhotoContainer>
              <div className="image-upload-container w-full h-full">
                {imageUrl ? (
                  <div className="relative">
                    <DeleteImageButton onClick={removeImage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                      </svg>
                    </DeleteImageButton>
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
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  accept="image/*"
                  hidden
                />
              </div>
            </PhotoContainer>
          </EditSection>
          <EditSection>
            <EditLabel htmlFor="content">내용</EditLabel>
            <ContentEditInput
              id="content"
              name="content"
              value={newContent}
              onChange={handleInputChange}
            />
          </EditSection>
          <div className="flex justify-start items-center">
            <EditSection>
              <EditLabel htmlFor="secret">피드 공개여부 체크</EditLabel>
              <div onClick={handleCheckboxChange}>
                {newSecret ? (
                  <img src={UnCheckedIcon} alt="unchecked icon" />
                ) : (
                  <img src={CheckedIcon} alt="checked icon" />
                )}
              </div>
            </EditSection>
          </div>
          <ButtonWrap>
            <Button color="#36C2CC" size="md">
              수정하기
            </Button>
          </ButtonWrap>
        </ContentEditForm>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default EditDiaryModal;
