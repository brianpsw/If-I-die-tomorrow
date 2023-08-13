import React, { useState } from 'react';
import styled from 'styled-components';
import requests from '../../api/config';
import { useSetRecoilState } from 'recoil';
import { loginState } from '../../states/UserState';
import tw from 'twin.macro';
import Logo from '../../assets/icons/logo.svg';
import AppTitle from '../../assets/images/app_title.svg';
import NaverLoginButton from '../../assets/images/naver_login.svg';
import KakaoLoginButton from '../../assets/images/kakao_login.svg';
import Modal from '../../components/common/Modal';
const Container = styled.div`
  ${tw`flex items-center flex-col w-full min-h-[100vh] justify-between`}
`;
const LogoContainer = styled.div`
  ${tw`flex items-center flex-col w-full mt-[146px] space-y-6 `}
`;
const LogInContainer = styled.div`
  ${tw`flex items-center flex-col w-full mb-[180px] space-y-6 `}
`;
const InfoText = styled.p`
  ${tw`text-center text-white text-p1 mx-6 mb-4`}
`;
const ContentTitle = styled.div`
  ${tw`text-p2 m-4`}
  font-weight: 600
`;

const ContentText = styled.p`
  ${tw`m-1`}
  font-size: 14px;
`;

function Login() {
  const setIsLogin = useSetRecoilState(loginState);
  const [modalOpen, setModalOpen] = useState(true);
  const kakaoLogin = () => {
    setIsLogin(() => true);
    window.location.href = requests.KAKAO_LOGIN!;
  };

  const naverLogin = () => {
    setIsLogin(() => true);
    window.location.href = requests.NAVER_LOGIN!;
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <Container>
      {modalOpen ? (
        <Modal onClose={handleModalClose}>
          <div className="flex flex-col">
            <ContentTitle>서비스 종료 공지</ContentTitle>
            <ContentText>
              안녕하세요 If I Die Tomorrow 이용자 여러분! <br />
              저희 서비스를 꾸준히 사랑해주셔서 감사합니다! <br /> If I Die
              Tomorrow를 열심히 이용해주신 여러분들 덕분에 즐겁고 재미있는
              시간을 보낼 수 있었습니다. <br />
              오늘은 안타까운 소식을 전하려고 합니다. 저희 If I Die Tomorrow
              서비스를 <b>2023년 8월 20일</b>부로 종료하게 되었습니다. <br />
              저희 운영진 모두 지금까지 조금씩 시간을 내서 서비스를 업데이트하고
              있었습니다만, 더 이상 서비스를 좋은 퀄리티로 유지하기에는 어려움이
              있다고 판단하였습니다. <br />
              여러분께서 올려주신 사진과 영상 그리고 문서들은 다운로드 받을 수
              있도록 메인페이지에 버튼을 마련해두었습니다.
              <br />
              지금까지 저희 서비스를 사랑해주셔서 감사합니다! <br />
              다음에 더 좋은 모습으로 돌아오겠습니다! <br />
              <br />- If I Die Tomorrow 운영진 일동 -
            </ContentText>
          </div>
        </Modal>
      ) : null}
      <LogoContainer>
        <img src={Logo} width={82} height={102} alt="" />
        <img src={AppTitle} width={213} height={30} alt="" />
      </LogoContainer>
      <LogInContainer>
        <InfoText>
          당신의 남은 인생을 조금 더 알차고 가치있게,
          <br />
          If I die tomorrow와 함께해요!
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
