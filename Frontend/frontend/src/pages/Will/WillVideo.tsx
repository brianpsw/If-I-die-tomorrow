import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import tw from 'twin.macro';
import styled from 'styled-components';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Button from '../../components/common/Button';
import './Will.css';
import AppTitle from '../../assets/images/text_logo.png';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';

const Container = styled.div`
  ${tw`flex flex-col justify-center rounded-lg items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
function WillVideo(): JSX.Element {
  const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const recordRef = useRef<RecordRTC | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    get_will();
  }, []);
  const handleDelete = () => {
    const delete_will_video = async () => {
      setLoadingOpen(true);
      try {
        await defaultApi.delete(requests.DELETE_WILL_VIDEO(), {
          withCredentials: true,
        });
        get_will();
        setLoadingOpen(false);
        Swal.fire({
          title: '동영상 삭제 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        setLoadingOpen(false);
        Swal.fire({
          title: '동영상 삭제 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      }
    };
    delete_will_video();
    setDefaultVideo('');
  };
  const handleSubmit = () => {
    const formData = new FormData();
    if (video) {
      formData.append('video', video);
    }
    const patch_will_video = async () => {
      setLoadingOpen(true);
      try {
        await defaultApi.patch(requests.PATCH_WILL_VIDEO(), formData, {
          withCredentials: true,
        });
        get_will();
        setEditVideo(false);
        setIsRecorded(false);
        setLoadingOpen(false);
        Swal.fire({
          title: '서명 등록 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        setLoadingOpen(false);
        Swal.fire({
          title: '서명 등록 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
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
    const context = canvasRef?.current?.getContext('2d');
    const canvasStream = canvasRef.current?.captureStream();
    const audioPlusCanvasStream = new MediaStream();
    canvasStream?.getVideoTracks().forEach((videoTrack) => {
      audioPlusCanvasStream.addTrack(videoTrack);
    });
    webcamRef?.current?.stream?.getAudioTracks().forEach((audioTrack) => {
      audioPlusCanvasStream.addTrack(audioTrack);
    });
    if (webcam) {
      recordRef.current = new RecordRTC(audioPlusCanvasStream, {
        type: 'video',
        mimeType: 'video/webm',
      });
      recordRef.current.startRecording();
    }
    (function looper() {
      if (!recordRef.current) return; // ignore/skip on stop-recording
      if (canvasRef.current && webcam) {
        canvasRef.current.width = webcam.clientWidth;
        canvasRef.current.height = webcam.clientHeight;
      }

      context?.clearRect(
        0,
        0,
        canvasRef.current?.width as unknown as number,
        canvasRef.current?.height as unknown as number,
      );
      context?.save();
      context?.translate(canvasRef.current?.width as unknown as number, 0);
      context?.scale(-1, 1);
      context?.drawImage(
        webcam as CanvasImageSource,
        0,
        0,
        canvasRef.current?.width as unknown as number,
        canvasRef.current?.height as unknown as number,
      );
      context?.setTransform(1, 0, 0, 1, 0, 0);
      context?.restore();

      // repeat (looper)
      setTimeout(looper, 10);
    })();
  };

  const stopRecording = () => {
    recordRef.current?.stopRecording(() => {
      const blob = recordRef.current?.getBlob();
      if (blob) {
        // 미리보기 업데이트
        recordRef.current = null;
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
    <div className="min-h-[100vh] pb-[70px]">
      {loadingOpen ? <Loading /> : ''}
      <TopBar title="동영상 유언장" />
      <div className="flex justify-center my-[30px]">
        <img src={AppTitle} alt="" />
      </div>
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
              <Webcam
                audio={true}
                ref={webcamRef}
                mirrored={true}
                muted={true}
              />
            )}
          </div>
        ) : (
          ''
        )}
        {!isRecorded && editVideo && isRecording ? (
          <span className="text-red text-p2 mt-[16px] flex items-center">
            <i className="teaser__title-pre sc-bdVaJa dqrciE mt-[8px]" />
            동영상 촬영 중입니다.
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
                className="mx-[8px] "
              >
                동영상 재업로드
              </Button>
              <Button
                onClick={handleDelete}
                color="#0E848A"
                size="sm"
                className="mx-[8px]"
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
                    size="sm"
                    className="mx-[8px]"
                  >
                    녹화 시작
                  </Button>
                  <Button
                    onClick={stopRecording}
                    color={isRecording ? '#0E848A' : '#B3E9EB'}
                    size="sm"
                    className="mx-[8px]"
                  >
                    녹화 완료
                  </Button>
                </div>
              ) : (
                ''
              )}
              {isRecorded ? (
                <div className="flex">
                  <Button
                    onClick={handleRecordAgain}
                    color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
                  >
                    다시 녹화
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    color="#0E848A"
                    size="sm"
                    className="mx-[8px]"
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
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            marginTop: -9999999999,
            marginLeft: -999999999,
            zIndex: -1,
          }}
        />
      </Container>
    </div>
  );
}

export default WillVideo;
