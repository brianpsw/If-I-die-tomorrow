import React from 'react';
import Lottie from 'react-lottie-player';
import EmptyEmogi from '../../assets/animation/sad-look.json';

interface Empty {
  text: string;
}

function EmptyAlert(props: Empty) {
  const { text } = props;

  return (
    <div>
      <Lottie
        animationData={EmptyEmogi}
        play
        loop
        style={{ width: 80, height: 80, margin: '0 auto 24px' }}
      />
      <p className="text-center text-p1 text-green_800 break-keep">{text}</p>
    </div>
  );
}

export default EmptyAlert;
