import tw from 'twin.macro';
import styled from 'styled-components';
import PenIcon from '../../assets/icons/pen_docu.svg';
import WillDoc from '../../assets/images/will_doc.svg';
import WillVideo from '../../assets/images/will_video.svg';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import { Navigation } from '../../components/common/Navigation';
import AuthWrapper from '../../api/AuthWrapper';
import WillModal from './WillModal';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[500px] text-p1 rounded border-black break-all`}
`;
const Content = styled.p`
  ${tw`flex justify-center text-center items-center text-p2`}
  width: 100%;
`;

function Will(): React.JSX.Element {
  const [onWillVideo, setOnWillVideo] = useState<boolean>(false);
  const [onWillDoc, setOnWillDoc] = useState<boolean>(false);
  const userData = useRecoilValue(userDataState);
  if (Object.keys(userData).length === 0) {
    return <AuthWrapper></AuthWrapper>;
  }

  const onWillVideoModalClose = () => {
    setOnWillVideo(false);
  };

  const onWillDocModalClose = () => {
    setOnWillDoc(false);
  };

  const onWillVideoModalOpen = () => {
    setOnWillVideo(true);
  };

  const onWillDocModalOpen = () => {
    setOnWillDoc(true);
  };
  return (
    <AuthWrapper>
      {onWillVideo ? (
        <WillModal onClose={onWillVideoModalClose}>
          <video
            src={userData.will.videoUrl}
            controls
            poster={userData.will.videoUrl ? '' : undefined}
          />
        </WillModal>
      ) : null}
      {onWillDoc ? (
        <WillModal onClose={onWillDocModalClose}>
          {/* <WillContentInputContainer
            value={userData.will.content}
            placeholder="가족, 지인들에게 남기고 싶은 말을 적어주세요."
            readOnly
          /> */}
          <div className="container mx-auto p-4">
            <div className="bg-neutral-50 p-8 handwritten">
              <div className="prose lg:prose-lg xl:prose-xl">
                <p className="text-xl font-semibold mb-4">유언장</p>
                <p className="text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                  {userData.will.content}
                </p>
                {/* More paragraphs... */}
              </div>
            </div>
          </div>
        </WillModal>
      ) : null}
      <Navigation />
      <Container>
        <img src={PenIcon} />
        <Content className="my-8">박상우님께서 남기신 유언장입니다.</Content>
        <Content>
          버튼을 클릭하여 동영상과 <br />
          서면 유언장을 확인하십시오
        </Content>
        <div className="flex space-x-[30px] my-8">
          <img
            className="cursor-pointer"
            src={WillDoc}
            onClick={onWillDocModalOpen}
          />
          <img
            className="cursor-pointer"
            src={WillVideo}
            onClick={onWillVideoModalOpen}
          />
        </div>
        <img className="h-32" src={userData.will.signUrl} alt="사인" />
      </Container>
    </AuthWrapper>
  );
}

export default Will;
