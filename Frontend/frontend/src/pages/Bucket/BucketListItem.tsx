import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import Button from '../../components/common/Button';
import TreeDot from '../../assets/icons/three_dot.svg';
const Container = styled.div`
  ${tw`flex flex-col items-center w-full my-2`}
`;
const BucketContainer = styled.div`
  ${tw`flex items-center w-full h-[64px] bg-gray-100/80 px-4 my-2`}
`;
const FormContainer = styled.div`
  ${tw`flex items-center w-full h-[100px] bg-gray-100/80 my-2`}
`;
const ContentContainer = styled.div`
  ${tw`flex items-center justify-between border-b border-black w-full h-[33px] px-[6px]`}
`;
function BucketListItem() {
  const [isClicked, setIsClicked] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const clickHandler = () => {
    setIsClicked(!isClicked);
  };
  return (
    <Container>
      <BucketContainer>
        {isCompleted ? (
          <img src={CheckedIcon} alt="" />
        ) : (
          <img src={UnCheckedIcon} alt="" />
        )}
        <ContentContainer>
          <span className="text-p1">청담스케쥴 김치볶음밥</span>
          <img src={TreeDot} alt="" />
        </ContentContainer>
      </BucketContainer>

      {isClicked ? (
        <FormContainer>
          <span className="text-p1">청담스케쥴 김치볶음밥</span>
        </FormContainer>
      ) : null}
    </Container>
  );
}

export default BucketListItem;
