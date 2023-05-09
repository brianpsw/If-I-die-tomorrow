import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import uploadIcon from '../../assets/icons/camera_alt.svg';
import Button from './Button';
import { Icon } from '@iconify/react';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`p-6 bg-white flex flex-col border-solid rounded-xl w-[380px] shadow font-sans justify-between`}
  height: 70%;
  overflow-y: auto;
  position: relative;
`;

const ContentEditForm = styled.form`
  ${tw`flex flex-col`}
  justify-content: space-around;
  // border: solid 1px black;
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
  border-radius: 4px;
  padding: 6px 12px;
`;

const ButtonWrap = styled.div`
  ${tw`flex`}
  justify-content: center;
  // border-top: solid 1px black;
`;

const DeleteImageButton = styled.button`
  ${tw`px-2 py-1 text-xs rounded mt-2`}
  color: black;
`;

interface EditBucketModalProps {
  bucketId: number;
  title: string;
  complete: boolean;
  content: string;
  secret: boolean;
  image: string;
  onClose?: () => void;
  onUpdate?: (updatedBucket: any) => void;
}

function EditBucketModal({
  bucketId,
  title,
  content,
  complete,
  secret,
  image,
  onClose,
  onUpdate,
}: EditBucketModalProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newSecret, setNewSecret] = useState(secret);
  const [newComplete, setNewComplete] = useState(complete);
  const [photo, setPhoto] = useState<File | null>(null);
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
          bucketId,
          title: newTitle,
          complete: newComplete,
          content: newContent,
          secret: newSecret,
          updatePhoto, // updatePhoto 추가
        }),
      );

      if (photo) {
        formData.append('photo', photo); // 사진 파일이 있으면 formData에 추가
      }

      const response = await defaultApi.put(requests.POST_BUCKET(), formData, {
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSecret(e.target.checked);
  };

  return (
    <ModalOverlay>
      <ModalWrapper>
        <h2 className="text-h3 text-center">버킷리스트 수정</h2>
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
              {/* <div className="image-upload-container w-full h-auto overflow-hidden"> */}
              {imageUrl ? (
                <div className="relative">
                  <img
                    className="image-upload-preview w-auto h-full bg-auto "
                    src={imageUrl}
                    alt="upload-preview"
                    onClick={handleClick}
                  />
                  <DeleteImageButton onClick={removeImage}>
                    삭제
                  </DeleteImageButton>
                </div>
              ) : (
                <label
                  htmlFor="photo"
                  className="flex flex-col justify-center items-center w-full h-full cursor-pointer"
                >
                  <img src={uploadIcon} alt="" />
                </label>
              )}
              <input
                type="file"
                id="photo"
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
              {/* </div> */}
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
              <EditLabel htmlFor="secret">나만보기</EditLabel>
              <input
                className="text-left"
                type="checkbox"
                id="secret"
                checked={newSecret}
                onChange={handleCheckboxChange}
              />
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

export default EditBucketModal;
