import tw from 'twin.macro';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import Button from '../../components/common/Button';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
const LinkWrapper = styled.div`
  ${tw`flex w-full text-h3 justify-center items-center my-[8px]`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[500px] text-p1 rounded border-black break-all mb-[16px]`}
`;

function Will(): React.JSX.Element {
  const navigate = useNavigate();
  const [isVideo, setIsVideo] = useState<boolean>(true);
  const userData = useRecoilValue(userDataState);
  return (
    <div>
      <TopBar title="유언장" />
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
    </div>
  );
}

export default Will;
