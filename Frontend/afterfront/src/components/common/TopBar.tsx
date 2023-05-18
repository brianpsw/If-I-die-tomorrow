import React from 'react';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';
import styled from 'styled-components';

// icon
import arrow_back from '../../assets/icons/previous_vector.svg';

const Container = styled.div`
  ${tw`flex justify-between items-center p-[16px] h-[60px] w-full`}
`;
interface TopBarProps {
  title: string;
}
function TopBar({ title }: TopBarProps) {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <Container id="top-bar-2">
      <img
        src={arrow_back}
        alt="button to go back"
        onClick={handleGoBack}
        className="cursor-pointer"
      />
      <h3 className="text-h3">{title}</h3>
      <div className="w-[24px] h-[24px]"></div>
    </Container>
  );
}

export default TopBar;
