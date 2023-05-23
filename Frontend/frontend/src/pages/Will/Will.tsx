import tw from 'twin.macro';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import AppTitle from '../../assets/images/text_logo.png';
import Signiture from '../../../src/assets/images/will_signature.png';
import Writing from '../../../src/assets/images/will.png';
import Video from '../../../src/assets/images/will_video.png';

const Container = styled.div`
  ${tw`flex flex-col justify-center rounded-xl p-6 m-[24px] bg-gray-100/80`}
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  border: solid 1px #9e9e9e;
`;
const LinkWrapper = styled.div`
  ${tw`flex w-full h-[120px] text-h3 justify-center items-center my-[8px]`}
`;

interface IconProps {
  imgUrl?: string;
}

const SmallBox = styled.div<IconProps>`
  ${tw`w-[120px] h-full mr-[7%]`}
  background-image: url(${(props) => props.imgUrl});
  background-size: contain;
  background-repeat: no-repeat;
`;

const TextBox = styled.div`
  ${tw`flex w-[45%] justify-center items-center`}
`;

function Will(): JSX.Element {
  return (
    <div className="min-h-[100vh]" style={{ paddingBottom: '30%' }}>
      <TopBar title="유언장" />
      <Container>
        <Link to="/will/text">
          <LinkWrapper>
            <SmallBox imgUrl={Writing} />
            <TextBox>
              <p className="text-smT">유언장 등록</p>
            </TextBox>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/sign">
          <LinkWrapper>
            <SmallBox imgUrl={Signiture} />
            <TextBox>
              <p className="text-smT">서명 등록</p>
            </TextBox>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/video">
          <LinkWrapper>
            <SmallBox imgUrl={Video} />

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
