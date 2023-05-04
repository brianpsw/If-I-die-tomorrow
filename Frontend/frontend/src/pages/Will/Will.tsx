import React, { useRef, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import SignatureCanvas from 'react-signature-canvas'; // 라이브러리 import
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-4 m-6 bg-gray-100/80`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[86px] rounded border-black break-all my-4`}
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
  const userInfo = useRecoilState(userState);
  const [willContent, setWillContent] = useState('');
  const [sign, setSign] = useState<File | null>(null);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWillContent(e.currentTarget.value);
    // setIsCompleteContentValid(e.currentTarget.value.length > 0);
  };
  // useRef로 DOM에 접근 (SignatureCanvas 라는 캔버스 태그에 접근)
  const signCanvas = useRef() as React.MutableRefObject<any>;

  // 캔버스 지우기
  const clear = () => {
    signCanvas.current.clear();
  };

  // 이미지 저장
  const save = () => {
    const dataURL = signCanvas.current.toDataURL('image/png');
    const decodedURL = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(decodedURL, 'base64');
    const blob = new Blob([buf], { type: 'image/png' });
    const file = new File([blob], `${userInfo[0]?.nickname}의 서명.png`, {
      type: 'image/png',
    });
    setSign(file);
  };

  return (
    <div>
      <Container>
        <WillContentInputContainer
          onChange={handleContentChange}
          value={willContent}
          placeholder="가족, 지인들에게 남기고 싶은 말을 적어주세요."
        />
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
