import React from 'react';

import Lottie from 'react-lottie-player';
import LoadingFox from '../../assets/loading/loading_fox.json';

function Loading() {
  return (
    <div>
      <Lottie
        animationData={LoadingFox}
        play
        loop
        style={{ width: 120, height: 120, margin: '0 auto' }}
      />
      <p> 잠시만 기다려주세요.</p>
    </div>
  );
}

export default Loading;
