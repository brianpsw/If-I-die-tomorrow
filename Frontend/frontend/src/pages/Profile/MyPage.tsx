import NavBar from '../../components/common/NavBar';
import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';
import { Icon } from '@iconify/react';

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  ${tw`flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  // border: solid 1px white;
`;

const HeadText = styled.h1`
  text-align: center;
  color: white;
`;

const MyProfile = styled.div`
  ${tw`mb-6 mt-12`}
  color: white;
`;

const SettingBox = styled.div`
  ${tw`mb-12 mt-6 p-6`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  width: 342px;
  height: 504px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  margin: 0 auto; // 추가
`;

const IconWithText = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  svg {
    margin-right: 8px;
  }
`;

const FixedNavBar = styled(NavBar)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

function MyPage() {
  return (
    <>
      <Background>
        <Container>
          <HeadText>마이페이지</HeadText>
          <MyProfile>
            <h2 className="text-h2">Nickname님, 환영합니다.</h2>
            <IconWithText>
              <Icon icon="line-md:clipboard-list" />
              <span>유언장 작성하러 가기</span>
            </IconWithText>
          </MyProfile>

          <SettingBox>
            <IconWithText>
              <h3 className="text-h4" style={{ display: 'inline-block' }}>
                사후 전송 서비스 설정
              </h3>
              <Icon icon="line-md:switch-off-filled" />
              <Icon icon="line-md:switch-off-to-switch-transition" />
            </IconWithText>

            <IconWithText>
              <h4 style={{ display: 'inline-block' }}>생존 여부 알림</h4>
              <Icon icon="line-md:question-circle-twotone" />
            </IconWithText>
            <IconWithText>
              <h4 style={{ display: 'inline-block' }}>내 기록 받아볼 사람</h4>
              <Icon icon="line-md:question-circle-twotone" />
            </IconWithText>
            <StyledButton color="#FFA9A9" size="sm">
              저장
            </StyledButton>
          </SettingBox>
        </Container>
      </Background>
      <FixedNavBar />
    </>
  );
}

export default MyPage;
