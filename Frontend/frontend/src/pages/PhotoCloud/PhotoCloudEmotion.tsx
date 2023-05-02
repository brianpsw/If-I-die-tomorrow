import styled from 'styled-components';
import tw from 'twin.macro';

import backgroundImg from '../../assets/images/main_bg.png';

export const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-attachment: fixed;
  padding-bottom: 70px;
`;

export const PhotoWrapper = styled.div`
  padding-bottom: 70px;
`;

export const PhotoCardWrapper = styled.div`
  width: 342px;
  padding: 16px;
  margin: 16px auto;
  background-color: #f6f6f6b3;
  border-radius: 10px;
`;

export const Photo = styled.img`
  width: 310px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
`;
