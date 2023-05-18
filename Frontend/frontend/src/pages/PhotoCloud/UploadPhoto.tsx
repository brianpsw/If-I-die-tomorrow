import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Icon } from '@iconify/react';
import tw from 'twin.macro';
import styled from 'styled-components';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';
import PhotoInput from '../../components/PhotoCloud/PhotoInput';
import Button from '../../components/common/Button';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleContent = (e: any) => {
    setContent(e.target.value);
    if (content.length > 300) {
      alert('300자 이상 작성할 수 없습니다.');
    }
  };

  const submitPhoto = async () => {
    setIsLoading(() => true);
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
        setIsLoading(() => false);
        Swal.fire({
          title: '사진 업로드 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
        navigate(`/photo-cloud/${params.categoryId}`);
      }
    } catch (err: any) {
      if (err.response.status === 500) {
        setIsLoading(() => false);
        Swal.fire({
          title: '사진 업로드 실패...',
          text: '사진에 데이터가 없습니다. 다른 사진으로 교체해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      } else if (err.response.status === 400) {
        setIsLoading(() => false);
        Swal.fire({
          title: '사진 업로드 실패...',
          text: '지원하지 않는 확장자입니다. 다른 사진으로 교체해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
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
    <div className="min-h-[100vh]" style={{ paddingBottom: '20%' }}>
      {isLoading && <Loading />}
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
        <PhotoInput
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
        />
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
    </div>
  );
}

export default UploadPhoto;
