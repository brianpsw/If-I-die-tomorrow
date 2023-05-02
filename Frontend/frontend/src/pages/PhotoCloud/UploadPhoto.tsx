import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';
import tw from 'twin.macro';
import styled from 'styled-components';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import { Background } from '../../pages/PhotoCloud/PhotoCloudEmotion';
import Button from '../../components/common/Button';

const PhotoUploadWrapper = styled.div`
  ${tw`w-[342px] p-4 rounded-[10px] cursor-pointer mb-8`}
  background-color: rgba(246, 246, 246, 0.7);
`;

const ContentWrapper = styled.div`
  ${tw`w-[342px]  p-4 rounded-[10px] mb-8`}
  background-color: rgba(246, 246, 246, 0.7);
`;

function UploadPhoto() {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleInputPhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImgUrl(imageUrl);
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

  return (
    <Background>
      <div style={{ padding: '16px 24px' }}>
        <Link to="/photo-cloud">
          <Icon
            icon="ph:x-bold"
            style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }}
          />
        </Link>
        <h2 className="text-h3 text-white text-center my-8">
          사진과 텍스트를 넣어주세요
        </h2>
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
            className="w-full rounded-[10px] p-4"
            placeholder="당신만의 이야기를 써보세요."
            onChange={handleContent}
          ></textarea>
        </ContentWrapper>
        <Button color="#36C2CC" size="lg" style={{ color: '#04373B' }}>
          사진 올리기
        </Button>
      </div>
    </Background>
  );
}

export default UploadPhoto;
