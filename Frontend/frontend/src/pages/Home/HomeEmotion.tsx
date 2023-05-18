import styled from 'styled-components';
import tw from 'twin.macro';

import textLogoImg from '../../assets/images/text_logo.png';

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
  z-index: 1;
`;
