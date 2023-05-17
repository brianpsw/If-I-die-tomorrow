import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import requests from '../../api/config';
// import { defaultApi } from '../../api/axios';
import tw from 'twin.macro';
import Logo from '../../assets/icons/logo.svg';
import AppTitle from '../../assets/images/app_title.svg';
import NaverLoginButton from '../../assets/images/naver_login.svg';
import KakaoLoginButton from '../../assets/images/kakao_login.svg';
const Container = styled.div`
  ${tw`flex items-center flex-col w-full h-[100vh] justify-between`}
`;
const LogoContainer = styled.div`
  ${tw`flex items-center flex-col w-full mt-[146px] space-y-6 `}
`;
const LogInContainer = styled.div`
  ${tw`flex items-center flex-col w-full mb-[180px] space-y-6 `}
`;
const InfoText = styled.span`
  ${tw`text-center text-white text-h3 mx-6`}
`;

function Login() {
  const kakaoLogin = () => {
    window.location.href = requests.KAKAO_LOGIN!;
  };

  const naverLogin = () => {
    window.location.href = requests.NAVER_LOGIN!;
  };
  return (
    <Container>
      <LogoContainer>
        <img src={Logo} width={82} height={102} alt="" />
        <img src={AppTitle} width={213} height={30} alt="" />
      </LogoContainer>
      <LogInContainer>
        <InfoText>
          당신의 남은 인생을 잘 정리해보고 싶나요?
          <br />
          당신의 인생 저희 If I die tomorrow가 정리해드릴게요!
        </InfoText>
        <img
          className="cursor-pointer"
          src={NaverLoginButton}
          onClick={naverLogin}
          alt="naver_login"
        />
        <img
          className="cursor-pointer"
          src={KakaoLoginButton}
          onClick={kakaoLogin}
          alt="kakao_login"
        />
      </LogInContainer>
    </Container>
  );
}

export default Login;
