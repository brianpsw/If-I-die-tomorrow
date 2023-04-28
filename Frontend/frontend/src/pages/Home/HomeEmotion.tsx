import styled from 'styled-components';
import tw from 'twin.macro';

import backgroundImg from '../../assets/images/main_bg.png';
import textLogoImg from '../../assets/images/text_logo.png';

export const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

export const Logo = styled.div`
  background-image: url(${textLogoImg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 120px;
  min-height: 60px;
  position: absolute;
  top: 36px;
  left: 24px;
`;

export const FeelingTxt = styled.h1`
  ${tw`text-h1 text-white`}
  text-shadow: 4px 4px 4px #111111;
  line-height: 1.4;
  position: absolute;
  top: 155px;
  left: 24px;
  z-index: 100;
`;
