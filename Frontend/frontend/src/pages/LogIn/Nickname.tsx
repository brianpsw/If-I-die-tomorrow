import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import AppTitle from '../../assets/images/text_logo.png';
import RefreshButton from '../../assets/icons/refresh_button.svg';
import Button from '../../components/common/Button';
const Container = styled.div`
  ${tw`flex items-center flex-col px-[24px] w-full h-[100vh] pb-[100px] overflow-y-auto`}
`;
const LogoContainer = styled.div`
  ${tw`flex items-center flex-col w-full mt-[120px] space-y-6 `}
`;

const TitleText = styled.div`
  ${tw`text-h2 w-full mt-[48px] text-white`}
`;
const NicknameContainer = styled.div`
  ${tw`flex items-center justify-between border-b shadow-md border-black w-full h-[40px] px-[16px] mt-[64px]`}
`;
const InfoText = styled.span`
  ${tw`w-full mt-[24px] text-p1 text-white`}
`;
const CheckText = styled.span`
  ${tw`w-full mt-[200px] text-p1 text-white`}
`;

const IIDT = styled.span`
  ${tw`text-black`}
`;
function Nickname() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const get_usernickname = async () => {
    try {
      const response = await defaultApi.get(requests.GET_USERNICKNAME(), {
        withCredentials: true,
      });
      if (typeof response.data === 'string') {
        setNickname(response.data);
      }
      console.log(response.data);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    //랜덤 닉네임 받아오는 API
    handleNicknameChange();
  }, []);
  const handleNicknameChange = () => {
    //랜덤 닉네임 받아오는 API
    get_usernickname();
  };
  const handleNicknameSubmit = () => {
    //닉네임 정하는 API
    const patch_usernickname = async () => {
      try {
        const response = await defaultApi.patch(
          requests.PATCH_USERNICKNAME(),
          {
            nickname,
          },
          {
            withCredentials: true,
          },
        );
        return console.log(response);
      } catch (error) {
        throw error;
      }
    };

    patch_usernickname();
    navigate('/home');
  };
  return (
    <div className="flex h-full">
      <Container>
        <LogoContainer>
          <img src={AppTitle} alt="logo" />
        </LogoContainer>
        <TitleText>
          <IIDT>If I die tomorrow</IIDT>에서 사용할
          <br />
          닉네임을 선택해주세요.
        </TitleText>
        <NicknameContainer>
          <span className="text-h2 text-white">{nickname}</span>
          <img
            className="cursor-pointer shadow-xl"
            onClick={handleNicknameChange}
            src={RefreshButton}
            alt=""
          />
        </NicknameContainer>
        <InfoText>
          유저의 개인정보를 보호하고자 랜덤으로 닉네임을 생성해 드립니다.
        </InfoText>
        <CheckText>
          서비스 방침상 한번 설정한 닉네임은 추후 변경이 불가능합니다.
          <br />
          정말 지금 닉네임을 선택하시겠습니까?
        </CheckText>
        <Button
          onClick={handleNicknameSubmit}
          className="mt-[24px]"
          color="#36C2CC"
          size="lg"
        >
          선택 완료
        </Button>
      </Container>
    </div>
  );
}

export default Nickname;
