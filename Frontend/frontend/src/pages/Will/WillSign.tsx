import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import tw from 'twin.macro';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas'; // 라이브러리 import
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import TopBar from '../../components/common/TopBar';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;

const SignatureCanvasContainer = styled.div`
  ${tw`flex justify-center items-center `}
`;
const CanvasButton = styled.button`
  ${tw`flex w-[80px] h-[30px] justify-center border-2 items-center mt-[20px]`}
`;
const CanvasButtonContainer = styled.div`
  ${tw`flex justify-center items-center`}
`;
function WillSign(): JSX.Element {
  const userInfo = useRecoilState(userState);
  const [sign, setSign] = useState<File | null>(null);

  // useRef로 DOM에 접근 (SignatureCanvas 라는 캔버스 태그에 접근)
  const signCanvas = useRef() as React.MutableRefObject<any>;

  // 캔버스 지우기
  const clear = () => {
    signCanvas.current.clear();
  };

  // 이미지 저장
  const save = () => {
    if (signCanvas.current) {
      const canvasData = signCanvas.current.toDataURL('image/png');
      fetch(canvasData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${userInfo[0]?.nickname}의 서명.png`, {
            type: 'image/png',
          });
          setSign(file);
          console.log('저장완료');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <TopBar title="유언장 서명 등록" />
      <Container>
        <SignatureCanvasContainer>
          <SignatureCanvas
            ref={signCanvas}
            canvasProps={{
              width: '250',
              height: '250',
              className: 'sigCanvas',
            }}
            backgroundColor="rgb(255, 255, 255)"
          />
        </SignatureCanvasContainer>
        <CanvasButtonContainer>
          <CanvasButton onClick={clear}>clear</CanvasButton>
          <CanvasButton onClick={save}>save</CanvasButton>
        </CanvasButtonContainer>
        {sign ? <img src={URL.createObjectURL(sign)} alt="" /> : ''}
      </Container>
    </div>
  );
}

export default WillSign;
