import tw from 'twin.macro';
import styled from 'styled-components';
import PenIcon from '../../assets/icons/pen_docu.svg';
import WillDoc from '../../assets/images/will_doc.svg';
import WillVideo from '../../assets/images/will_video.svg';
import NotFound from '../../assets/images/NotFound.png';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import { Navigation } from '../../components/common/Navigation';
import AuthWrapper from '../../api/AuthWrapper';
import WillModal from './WillModal';

const Container = styled.div`
  ${tw` md:pt-[100px] pt-[80px] px-[24px]`}
`;

const Content = styled.p`
  ${tw`flex justify-center w-full text-center items-center text-p2`}
`;

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.src = NotFound;
};

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
          {userData.will.videoUrl ? (
            <video
              src={userData.will.videoUrl}
              controls
              poster={userData.will.videoUrl ? '' : undefined}
            />
          ) : (
            <img className="h-32" src={NotFound} alt="동영상 없음" />
          )}
        </WillModal>
      ) : null}
      {onWillDoc ? (
        <WillModal onClose={onWillDocModalClose}>
          <div className="container mx-auto p-4 h-full">
            <div className="bg-neutral-50 p-8 handwritten h-[80%]">
              <div className="prose lg:prose-lg xl:prose-xl">
                <p className="text-xl font-semibold mb-4">유언장</p>
                <p className="text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                  {userData.will.content
                    ? userData.will.content
                    : '유언장 내용이 없습니다.'}
                </p>
                <div className="flex w-full justify-end">
                  {userData.will.signUrl ? (
                    <img
                      className="h-32"
                      src={userData.will.signUrl}
                      alt="사인"
                    />
                  ) : (
                    <img className="h-32" src={NotFound} alt="사인 없음" />
                  )}
                </div>
                {/* More paragraphs... */}
              </div>
            </div>
          </div>
        </WillModal>
      ) : null}
      <Navigation />
      <Container>
        <div className="flex flex-col justify-evenly items-center text-p2 bg-gray-100/80 rounded-[10px] max-w-[700px] mx-auto min-h-[85vh]">
          <img src={PenIcon} alt="pen icon" className="w-[150px]" />
          <Content className="my-8">
            {userData.will.name}님께서 남기신 유언장입니다.
          </Content>
          <Content>
            버튼을 클릭하여 동영상과 <br />
            서면 유언장을 확인하십시오
          </Content>
          <div className="flex space-x-[10%] my-8 w-full justify-center items-center">
            <img
              className="cursor-pointer sm:w-[30%] w-[40%]"
              src={WillDoc}
              onClick={onWillDocModalOpen}
              alt="will document"
            />
            <img
              className="cursor-pointer sm:w-[30%] w-[40%]"
              src={WillVideo}
              onClick={onWillVideoModalOpen}
              alt="will video"
            />
          </div>
        </div>
      </Container>
    </AuthWrapper>
  );
}

export default Will;
