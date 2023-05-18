import tw from 'twin.macro';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import AppTitle from '../../assets/images/text_logo.png';
import Lottie from 'react-lottie-player';
import Signiture from '../../../src/assets/animation/tablet-signature.json';
import Writing from '../../../src/assets/animation/upload-document.json';
import Video from '../../../src/assets/animation/video-conversation-icon-animation.json';

const Container = styled.div`
  ${tw`flex flex-col justify-center rounded-xl p-[8px] m-[24px] bg-gray-100/80`}
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  border: solid 1px #9e9e9e;
`;
const LinkWrapper = styled.div`
  ${tw`flex flex-col w-full text-h3 items-center my-[8px]`}
  height: 17vh;
  justify-content: center;
`;
const SmallBox = styled.div`
  ${tw`flex flex-col justify-center rounded-xl`}// box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  // border: solid 1px #9e9e9e;
  // width: 50%;
  // height: 100%;
`;

const TextBox = styled.div`
  ${tw`flex `}
  justify-content:center;
  align-items: center;
  // width: 50%;
`;

function Will(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div>
      <TopBar title="유언장" />
      <div className="flex justify-center my-[30px]">
        <img src={AppTitle} alt="" />
      </div>
      <Container>
        <Link to="/will/text">
          <LinkWrapper>
            <SmallBox>
              <Lottie
                animationData={Writing}
                play={false}
                loop
                style={{ width: 120, height: 120, margin: '0 auto' }}
              />
            </SmallBox>
            <TextBox>
              <p className="text-smT">유언장 등록</p>
            </TextBox>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/sign">
          <LinkWrapper>
            <SmallBox>
              <Lottie
                animationData={Signiture}
                play
                loop
                style={{ width: 120, height: 120, margin: '0 auto' }}
              />
            </SmallBox>
            <TextBox>
              <p className="text-smT">서명 등록</p>
            </TextBox>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/video">
          <LinkWrapper>
            <SmallBox>
              <Lottie
                animationData={Video}
                play={false}
                loop
                style={{ width: 130, height: 130, margin: '0 auto' }}
              />
            </SmallBox>
            <TextBox>
              <p className="text-smT">동영상 유언장</p>
            </TextBox>
          </LinkWrapper>
        </Link>
      </Container>
    </div>
  );
}

export default Will;
