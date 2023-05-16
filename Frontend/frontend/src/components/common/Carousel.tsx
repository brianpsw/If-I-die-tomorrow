import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import Image1 from '../../assets/images/diary_bg.png';
import Image2 from '../../assets/images/bucket_bg.png';
import Image3 from '../../assets/images/main_bg.png';
import Image4 from '../../assets/images/feed.png';
import Image5 from '../../assets/images/mypage_bg.jpg';

// Styled Component
const Window = styled.div`
  ${tw`overflow-hidden w-full h-[300px] absolute`}
`;

const Slider = styled.div<{ index: number }>`
  ${tw`h-full flex w-full`}
  ${({ index }) => css`
    transition: all 0.3s ease-out;
    transform: translateX(-${index}00%);
  `}
`;

const Slide = styled.div<{ imgUrl: string }>`
  ${tw`w-full h-full bg-contain bg-no-repeat bg-center flex-none`}
  ${({ imgUrl }) => css`
    background-image: url(${imgUrl});
  `}
`;

// interface CarouselProps {
//   navIndex: number;
// }

const Carousel = ({}) => {
  // 슬라이드 이동
  const location = useLocation().pathname;
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (location.startsWith('/login') || location.startsWith('/home')) {
      setCurrentIndex(3);
    } else if (location.startsWith('/diary')) {
      setCurrentIndex(1);
    } else if (location.startsWith('/bucket')) {
      setCurrentIndex(2);
    } else if (location.startsWith('/feed')) {
      setCurrentIndex(4);
    } else if (location.startsWith('/mypage')) {
      setCurrentIndex(5);
    }
  }, [location]);
  const backgroundImage = [Image1, Image2, Image3, Image4, Image5];

  return (
    <Window id="window">
      <Slider id="slider" index={currentIndex}>
        {backgroundImage
          ? backgroundImage.map((url, index) => (
              <Slide key={index} imgUrl={url} />
            ))
          : ''}
      </Slider>
    </Window>
  );
};

export default Carousel;
