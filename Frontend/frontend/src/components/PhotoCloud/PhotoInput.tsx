import React, { useState } from 'react';

import { Icon } from '@iconify/react';
import tw from 'twin.macro';
import styled from 'styled-components';

interface PhotoUpload {
  imgUrl: string;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
  photoFile: File | null;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const PhotoUploadWrapper = styled.div`
  ${tw`md:max-w-[40%] sm:max-w-[60%] p-4 rounded-[10px] cursor-pointer mb-8 bg-[#f6f6f6b3] mx-auto `}
  width: 100%;
`;

function PhotoInput(props: PhotoUpload) {
  const { imgUrl, setImgUrl, photoFile, setPhotoFile } = props;
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

  return (
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
  );
}

export default PhotoInput;
