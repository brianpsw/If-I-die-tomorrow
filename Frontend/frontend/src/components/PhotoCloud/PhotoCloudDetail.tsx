import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import Swal from 'sweetalert2';
import EmptyAlert from '../../components/common/EmptyAlert';
import {
  PhotoWrapper,
  PhotoCardWrapper,
  Photo,
  Video,
} from '../../pages/PhotoCloud/PhotoCloudEmotion';

import blackThreeDot from '../../assets/icons/three_dot.svg';
import Button from '../../components/common/Button';

interface Category {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface PhotoInfo {
  photoId: number;
  imageUrl: string;
  caption: string;
  imageType: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryPhoto {
  category: Category;
  photos: PhotoInfo[];
}

interface EditOrDeleteEpic {
  titleEdit: boolean;
  contentEdit: boolean;
}

interface PhotoCloudProps {
  setOpenEditOrDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPhotoId: React.Dispatch<React.SetStateAction<string>>;
  selectedPhotoId: string;
  setEpic: React.Dispatch<React.SetStateAction<string>>;
  setEditOrDeleteModalEpic: React.Dispatch<
    React.SetStateAction<EditOrDeleteEpic>
  >;
  editOrDeleteModalEpic: EditOrDeleteEpic;
  deleteContent: boolean;
  setSelectedPhotoCaption: React.Dispatch<React.SetStateAction<string>>;
  selectedPhotoCaption: string;
  cancelEdit: () => void;
  photoData: CategoryPhoto | null;
  getPhoto: () => void;
  checkEmptyBeforeSend: (targetContent: string, sendFunc: () => void) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function PhotoCloudDetail(props: PhotoCloudProps) {
  const {
    setOpenEditOrDeleteModal,
    setSelectedPhotoId,
    selectedPhotoId,
    setEpic,
    setEditOrDeleteModalEpic,
    editOrDeleteModalEpic,
    deleteContent,
    setSelectedPhotoCaption,
    selectedPhotoCaption,
    cancelEdit,
    photoData,
    getPhoto,
    checkEmptyBeforeSend,
    setIsLoading,
  } = props;

  const [editContent, setEditContent] = useState<string>('');

  const categoryId = useParams();
  const photos = photoData?.photos;

  useEffect(() => {
    setEditContent(selectedPhotoCaption);
  }, [selectedPhotoId]);

  // 캡션 수정시 photo 다시 불러오기
  useEffect(() => {
    if (deleteContent) getPhoto();
  }, [deleteContent]);

  const handleEditContent = (e: any) => {
    const regExp = /^.{0,300}$/;

    if (regExp.test(e.target.value)) {
      setEditContent(e.target.value);
    } else {
      alert('내용은 300자이내여야합니다.');
    }
  };

  // 캡션 수정 api

  const changeContent = async () => {
    setIsLoading(() => true);
    try {
      const patch_photo = await defaultApi.patch(
        requests.PATCH_PHOTO(),
        { photoId: selectedPhotoId, caption: editContent },
        { withCredentials: true },
      );
      if (patch_photo.status === 200) {
        getPhoto();
        setEditOrDeleteModalEpic({
          titleEdit: false,
          contentEdit: false,
        });
        setIsLoading(() => false);
        Swal.fire({
          title: '캡션 수정 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      setIsLoading(() => false);
      Swal.fire({
        title: '캡션 수정 실패...',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <PhotoWrapper>
      {photoData ? (
        <div>
          <div>
            {photos!.length > 0 ? (
              photos!.map((photo: PhotoInfo) => {
                return (
                  <PhotoCardWrapper key={photo.photoId}>
                    {photo.imageType === 'image' ? (
                      <Photo src={photo.imageUrl} alt="추억이 담긴 사진" />
                    ) : (
                      <Video controls src={photo.imageUrl} />
                    )}

                    {editOrDeleteModalEpic.contentEdit === true &&
                    selectedPhotoId === photo.photoId.toString() ? (
                      <div>
                        <textarea
                          defaultValue={photo.caption}
                          className="w-full min-h-[180px] rounded-[10px] p-4 text-p1"
                          onChange={(e: any) => handleEditContent(e)}
                        />
                        <div className="w-full flex justify-center mt-4">
                          <Button
                            color="#36C2CC"
                            size="sm"
                            style={{ color: '#04373B', marginRight: '16px' }}
                            onClick={() =>
                              checkEmptyBeforeSend(editContent, changeContent)
                            }
                          >
                            입력
                          </Button>
                          <Button
                            color="#eeeeee"
                            size="sm"
                            style={{ color: '#04373B' }}
                            onClick={() => cancelEdit?.()}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-p3 text-green_800 mb-[30px]">
                          {photo.caption}
                        </p>

                        <img
                          className="absolute bottom-6 right-6 cursor-pointer"
                          src={blackThreeDot}
                          alt="three dot button"
                          onClick={() => {
                            setOpenEditOrDeleteModal(true);
                            setEpic('내용');
                            setSelectedPhotoId(photo.photoId.toString());
                            setSelectedPhotoCaption(photo.caption);
                          }}
                        />
                      </div>
                    )}
                  </PhotoCardWrapper>
                );
              })
            ) : (
              <div
                className="my-[20vh] bg-gray-100/70 p-[16px] rounded-[10px] shadow w-5/6 mx-auto"
                style={{ boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.25)' }}
              >
                <EmptyAlert
                  text={`사진이 없습니다. 하단의 버튼을 눌러
                사진을 추가해 보세요.`}
                />
              </div>
            )}
            {photos!.length < 3 ? (
              <Link to={`/photo-cloud/upload-photo/${categoryId}`}>
                <Icon
                  icon="ph:plus-circle"
                  className="text-pink_100 w-[55px] h-[55px] mx-auto mt-4"
                />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </PhotoWrapper>
  );
}

export default PhotoCloudDetail;
