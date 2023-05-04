import React, { useRef } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas'; // 라이브러리 import

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-4 m-6 bg-gray-100/80`}
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
function Will(): JSX.Element {
  // useRef로 DOM에 접근 (SignatureCanvas 라는 캔버스 태그에 접근)
  const signCanvas = useRef() as React.MutableRefObject<any>;

  // 캔버스 지우기
  const clear = () => {
    signCanvas.current.clear();
  };

  // 이미지 저장
  const save = () => {
    const image = signCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'sign_image.png';
    link.click();
  };

  return (
    <div>
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
      </Container>
    </div>
  );
}

export default Will;
