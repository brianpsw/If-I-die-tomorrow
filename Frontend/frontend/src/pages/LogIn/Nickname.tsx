import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
// import { defaultApi } from '../../api/axios';
import AppTitle from '../../assets/images/app_title.svg';
import RefreshButton from '../../assets/icons/refresh_button.svg';
const Container = styled.div`
  ${tw`flex items-center flex-col w-full h-[100vh] justify-between`}
`;
const LogoContainer = styled.div`
  ${tw`flex items-center flex-col w-full mt-[111px] space-y-6 `}
`;

const TitleText = styled.div`
  ${tw`text-h2 w-full px-6`}
`;
const InfoText = styled.span`
  ${tw`w-full text-center mx-6`}
`;
const NicknameContainer = styled.div`
  ${tw`border-b w-full px-6 justify-between  `}
`;
const IIDT = styled.span`
  ${tw`text-green-100`}
`;
function Nickname() {
  return (
    <Container>
      <LogoContainer>
        <img src={AppTitle} alt="logo" />
      </LogoContainer>
      <TitleText>
        <IIDT>IIDT</IIDT>에서 사용할
        <br />
        닉네임을 선택해주세요.
      </TitleText>
    </Container>
  );
}

export default Nickname;
