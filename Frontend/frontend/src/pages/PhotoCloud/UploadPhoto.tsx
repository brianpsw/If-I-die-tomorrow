import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Icon } from '@iconify/react';
import tw from 'twin.macro';
import styled from 'styled-components';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';

const PhotoUploadWrapper = styled.div`
  ${tw`md:max-w-[40%] sm:max-w-[60%] p-4 rounded-[10px] cursor-pointer mb-8 bg-[#f6f6f6b3] mx-auto `}
  width: 100%;
`;

const ContentWrapper = styled.div`
  ${tw`md:max-w-[40%] sm:max-w-[60%] p-4 rounded-[10px] mb-8 bg-[#f6f6f6b3] mx-auto `}
  width: 100%;
`;

function UploadPhoto() {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const params = useParams();
  const handleInputPhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImgUrl(imageUrl);
      setPhotoFile(file);
    }
  };

  const handlePhotoUpload = (e: any) => {
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
      photoInput.click();
    }
  };

  const handleContent = (e: any) => {
    setContent(e.target.value);
    if (content.length > 300) {
      alert('300자 이상 작성할 수 없습니다.');
    }
  };

  const submitPhoto = async () => {
    try {
      const formData = new FormData();

      formData.append(
        'data',
        JSON.stringify({
          categoryId: params.categoryId,
          caption: content,
        }),
      );

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const post_all_photo = await defaultApi.post(
        requests.POST_ALL_PHOTO(),
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (post_all_photo.status === 201) {
        navigate(`/photo-cloud/${params.categoryId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitPhoto = () => {
    if (content === '' || photoFile === null) {
      alert('사진과 텍스트를 모두 넣어주세요');
    } else {
      submitPhoto();
    }
  };

  return (
    <Background>
      <div style={{ padding: '16px 24px' }}>
        <Icon
          icon="ph:x-bold"
          style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
          onClick={() => {
            navigate(-1);
          }}
        />
        <h4 className="text-h4 text-white text-center my-8">
          사진과 텍스트를 넣어주세요
        </h4>

        <PhotoUploadWrapper onClick={handlePhotoUpload}>
          <div
            style={{
              width: '100%',
              minHeight: '192px',
              border: '2px #111111',
              borderStyle: 'dashed ',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {imgUrl ? (
              <img
                className="image-upload-preview w-full h-full bg-auto"
                src={imgUrl}
                alt="upload-preview"
              />
            ) : (
              <Icon
                icon="ic:round-photo-camera"
                style={{ fontSize: '30px', color: '#111111' }}
              />
            )}
          </div>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handleInputPhoto}
            hidden
          />
        </PhotoUploadWrapper>
        <ContentWrapper>
          <textarea
            rows={5}
            maxLength={300}
            className="w-full rounded-[10px] p-4 text-p2"
            placeholder="당신만의 이야기를 써보세요."
            onChange={handleContent}
          ></textarea>
        </ContentWrapper>
        <Button
          color="#36C2CC"
          size="lg"
          style={{ color: '#04373B', margin: '0 auto' }}
          onClick={handleSubmitPhoto}
        >
          사진 올리기
        </Button>
      </div>
    </Background>
  );
}

export default UploadPhoto;
