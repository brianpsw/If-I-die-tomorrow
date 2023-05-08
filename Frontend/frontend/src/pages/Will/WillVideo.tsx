import React, { useRef, useState } from 'react';
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

  const startRecording = () => {
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
        const file = new File([blob], 'recorded-video.webm', {
          type: 'video/webm',
        });

        // 파일 업로드 등의 후속 작업을 수행할 수 있습니다.
        console.log('녹화된 파일:', file);
      }
    });
  };

  return (
    <div>
      <TopBar title="동영상 유언장" />
      <Container>
        <div>
          <Webcam audio={true} ref={webcamRef} />
          <button onClick={startRecording}>녹화 시작</button>
          <button onClick={stopRecording}>녹화 중지</button>
          <video ref={previewRef} controls />
        </div>
      </Container>
    </div>
  );
}

export default WillVideo;
