import tw from 'twin.macro';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import Button from '../../components/common/Button';
import { Navigation } from '../../components/common/Navigation';
import AuthWrapper from '../../api/AuthWrapper';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[500px] text-p1 rounded border-black break-all mb-[16px]`}
`;

function Will(): React.JSX.Element {
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const userData = useRecoilValue(userDataState);
  if (Object.keys(userData).length === 0) {
    return <AuthWrapper></AuthWrapper>;
  }
  return (
    <AuthWrapper>
      <Navigation />
      <Container>
        {isVideo ? (
          <video
            src={userData.will.videoUrl}
            controls
            poster={userData.will.videoUrl ? '' : undefined}
          />
        ) : (
          <WillContentInputContainer
            value={userData.will.content}
            placeholder="가족, 지인들에게 남기고 싶은 말을 적어주세요."
            readOnly
          />
        )}
        <Button
          onClick={() => {
            setIsVideo(() => !isVideo);
          }}
          color={isVideo ? '#B3E9EB' : '#0E848A'}
          size="sm"
          className="mx-[8px]"
        >
          {isVideo ? '유언장 확인하기' : '유언 비디오 확인하기'}
        </Button>
        <img src={userData.will.signUrl} alt="사인" />
      </Container>
    </AuthWrapper>
  );
}

export default Will;
