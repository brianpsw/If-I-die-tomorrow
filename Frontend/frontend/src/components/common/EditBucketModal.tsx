import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

const ModalOverlay = styled.div`
  ${tw`flex items-center justify-center z-50 bg-neutral-400/80 h-full w-full fixed`}
`;

const ModalWrapper = styled.div`
  ${tw`bg-white flex flex-col items-center border-solid rounded-xl h-[380px] w-[380px] shadow font-sans`}
`;

interface EditBucketModalProps {
  bucketId: number;
  title: string;
  content: string;
  complete: boolean;
  secret: boolean;
  onClose?: () => void;
  onUpdate?: (updatedBucket: any) => void;
}

function EditBucketModal({
  bucketId,
  title,
  content,
  complete,
  secret,
  onClose,
  onUpdate,
}: EditBucketModalProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [newSecret, setNewSecret] = useState(secret);
  const [newComplete, setNewComplete] = useState(complete);
  const [photo, setPhoto] = useState<File | null>(null);
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          bucketId,
          title: newTitle,
          content: newContent,
          secret: newSecret,
          complete: newComplete,
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
      setPhoto(e.target.files[0]);
      setUpdatePhoto(true);
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
        <h3>버킷리스트 수정</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTitle}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="photo">사진</label>
            <input type="file" id="photo" onChange={handleFileChange} />
          </div>

          <div>
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={newContent}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="secret">비밀</label>
            <input
              type="checkbox"
              id="secret"
              checked={newSecret}
              onChange={handleCheckboxChange}
            />
          </div>
          <div>
            <button type="submit">수정하기</button>
            <button onClick={onClose}>닫기</button>
          </div>
        </form>
      </ModalWrapper>
    </ModalOverlay>
  );
}

export default EditBucketModal;
