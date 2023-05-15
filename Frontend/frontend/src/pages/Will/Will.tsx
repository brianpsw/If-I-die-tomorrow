import tw from 'twin.macro';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import AppTitle from '../../assets/images/app_title.svg';

const Container = styled.div`
  ${tw`flex flex-col justify-center rounded-xl items-center p-[8px] m-[24px] bg-gray-100/80`}
`;
const LinkWrapper = styled.div`
  ${tw`flex w-full text-h3 justify-center items-center my-[8px]`}
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
            <span>유언장 등록</span>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/sign">
          <LinkWrapper>
            <span>유언장 서명 등록</span>
          </LinkWrapper>
        </Link>
      </Container>
      <Container>
        <Link to="/will/video">
          <LinkWrapper>
            <span>동영상 유언장</span>
          </LinkWrapper>
        </Link>
      </Container>
    </div>
  );
}

export default Will;
