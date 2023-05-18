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
  ${tw`flex items-center justify-center z-[-10] h-full w-full bottom-[70px] fixed`}
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
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    width: 100%;
  `}
`;

// interface CarouselProps {
//   navIndex: number;
// }

const Carousel = () => {
  // 슬라이드 이동
  const location = useLocation().pathname;
  const [currentIndex, setCurrentIndex] = useState(2);
  const backgroundImage = [Image1, Image2, Image3, Image4, Image5];
  useEffect(() => {
    if (location.startsWith('/diary') || location.startsWith('/survey')) {
      setCurrentIndex(0);
      console.log(typeof Image1);
    } else if (location.startsWith('/bucket')) {
      setCurrentIndex(1);
    } else if (
      location.startsWith('/login') ||
      location.startsWith('/home') ||
      location.startsWith('/photo-cloud') ||
      location === '/'
    ) {
      setCurrentIndex(2);
    } else if (location.startsWith('/feed')) {
      setCurrentIndex(3);
    } else if (location.startsWith('/mypage') || location.startsWith('/will')) {
      setCurrentIndex(4);
    }
  }, [location]);

  return (
    <Window id="window">
      <Slider id="slider" index={currentIndex}>
        {backgroundImage.map((url, index) => (
          <Slide key={index} imgUrl={url} />
        ))}
      </Slider>
    </Window>
  );
};

export default Carousel;
