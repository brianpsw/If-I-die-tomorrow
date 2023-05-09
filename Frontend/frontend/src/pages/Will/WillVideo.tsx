import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import tw from 'twin.macro';
import styled from 'styled-components';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Button from '../../components/common/Button';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
function WillVideo(): JSX.Element {
  const webcamRef = useRef<Webcam>(null);
  const recordRef = useRef<RecordRTC | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [defaultVideo, setDefaultVideo] = useState('');
  const [isRecorded, setIsRecorded] = useState<Boolean>(false); //
  const [isRecording, setIsRecording] = useState<Boolean>(false);
  const [editVideo, setEditVideo] = useState<Boolean>(false);

  const get_will = async () => {
    try {
      const response = await defaultApi.get(requests.GET_WILL(), {
        withCredentials: true,
      });
      setDefaultVideo(response.data.videoUrl);
      console.log(response);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    get_will();
  }, []);
  const handleDelete = () => {
    const delete_will_video = async () => {
      try {
        const response = await defaultApi.delete(requests.DELETE_WILL_VIDEO(), {
          withCredentials: true,
        });
        get_will();
        console.log(response);
      } catch (error) {
        throw error;
      }
    };
    delete_will_video();
    setDefaultVideo('');
  };
  const handleSubmit = () => {
    const formData = new FormData();
    console.log(video);
    if (video) {
      formData.append('video', video);
    }
    const patch_will_video = async () => {
      try {
        const response = await defaultApi.patch(
          requests.PATCH_WILL_VIDEO(),
          formData,
          {
            withCredentials: true,
          },
        );
        get_will();
        setEditVideo(false);
        setIsRecorded(false);
        console.log(response);
      } catch (error) {
        throw error;
      }
    };
    patch_will_video();
  };
  const handleEdit = () => {
    setEditVideo(true);
  };

  const startRecording = () => {
    setIsRecording(true);
    const webcam = webcamRef.current?.video;
    if (webcam) {
      recordRef.current = new RecordRTC(webcam.srcObject as MediaStream, {
        type: 'video',
        mimeType: 'video/webm',
      });
      recordRef.current.startRecording();
    }
  };

  const stopRecording = () => {
    recordRef.current?.stopRecording(() => {
      const blob = recordRef.current?.getBlob();
      if (blob) {
        // 미리보기 업데이트
        const previewVideo = previewRef.current;
        if (previewVideo) {
          previewVideo.src = URL.createObjectURL(blob);
        }

        // 파일 변환 및 저장
        const file = new File([blob], 'recorded-video.mp4', {
          type: 'video/mp4',
        });

        // 파일 업로드 등의 후속 작업을 수행할 수 있습니다.
        // console.log('녹화된 파일:', file);
        setVideo(file);
        setIsRecording(false);
        setIsRecorded(true);
      }
    });
  };
  const handleRecordAgain = () => {
    setIsRecorded(false);
  };
  return (
    <div>
      <TopBar title="동영상 유언장" />
      <Container>
        {editVideo ? (
          ''
        ) : (
          <video
            src={defaultVideo}
            controls
            poster={defaultVideo ? '' : undefined}
          />
        )}
        {editVideo ? (
          <div>
            {isRecorded && video ? (
              <video src={URL.createObjectURL(video)} controls />
            ) : (
              <Webcam audio={true} ref={webcamRef} />
            )}
          </div>
        ) : (
          ''
        )}
        {!isRecorded && editVideo ? (
          <span className="text-yellow-500 text-p2 mt-[16px]">
            동영상이 존재하지 않습니다.
          </span>
        ) : (
          ''
        )}
        <div className="flex mt-[16px]">
          {!editVideo && defaultVideo ? (
            <div className="flex">
              <Button
                onClick={handleEdit}
                color={editVideo ? '#B3E9EB' : '#0E848A'}
                size="sm"
                disabled={editVideo ? true : false}
                className="mx-[8px]"
              >
                동영상 재업로드
              </Button>
              <Button
                onClick={handleDelete}
                // color={isValid ? '#0E848A' : '#B3E9EB'}
                color="#0E848A"
                size="sm"
                className="mx-[8px]"
                // disabled={isValid ? false : true}
              >
                동영상 삭제
              </Button>
            </div>
          ) : (
            ''
          )}
          {!editVideo && !defaultVideo ? (
            <Button
              onClick={handleEdit}
              color={editVideo ? '#B3E9EB' : '#0E848A'}
              size="sm"
              disabled={editVideo ? true : false}
              className="mx-[8px] mb-[16px]"
            >
              동영상 등록하기
            </Button>
          ) : (
            ''
          )}

          {editVideo ? (
            <div className="flex">
              {!isRecorded ? (
                <div className="flex">
                  <Button
                    onClick={startRecording}
                    color={!isRecording ? '#0E848A' : '#B3E9EB'}
                    // color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
                    // disabled={isValid ? false : true}
                  >
                    녹화 시작
                  </Button>
                  <Button
                    onClick={stopRecording}
                    color={isRecording ? '#0E848A' : '#B3E9EB'}
                    // color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
                    // disabled={isValid ? false : true}
                  >
                    녹화 중지
                  </Button>
                </div>
              ) : (
                ''
              )}
              {isRecorded ? (
                <div className="flex">
                  <Button
                    onClick={handleRecordAgain}
                    // color={isValid ? '#0E848A' : '#B3E9EB'}
                    color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
                    // disabled={isValid ? false : true}
                  >
                    다시 녹화
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    // color={isValid ? '#0E848A' : '#B3E9EB'}
                    color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
                    // disabled={isValid ? false : true}
                  >
                    등록완료
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        {/* {sign ? <img src={URL.createObjectURL(sign)} alt="" /> : ''} */}
      </Container>
    </div>
  );
}

export default WillVideo;
