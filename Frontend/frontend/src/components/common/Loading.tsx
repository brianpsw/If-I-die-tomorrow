import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

import Lottie from 'react-lottie-player';
import LoadingFox from '../../assets/loading/loading_fox.json';

const LoadingWrappper = styled.div`
  ${tw`w-full bg-gray-100/70 flex flex-col justify-center z-10 fixed top-0`}
  height: calc(100% - 70px);
`;

function Loading() {
  return (
    <LoadingWrappper>
      <Lottie
        animationData={LoadingFox}
        play
        loop
        style={{ width: 120, height: 120, margin: '0 auto' }}
      />
      <p className="text-p1 text-center"> 잠시만 기다려주세요.</p>
    </LoadingWrappper>
  );
}

export default Loading;
