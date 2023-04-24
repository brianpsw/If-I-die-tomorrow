import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

interface QuestionProps {
  id: number;
  title: string;
  onChange: (id: number, value: number) => void;
}

const RadioButton = styled.input`
  // 라디오 버튼 숨기기
  display: none;

  // 라디오 버튼 가상 요소 스타일
  & + span {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 1px solid black;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
  }

  // 선택된 라디오 버튼 색상 변경
  &:checked + span {
    background-color: #ffa9a9;
    border: 1px solid black;
  }

  // 각 크기에 대한 스타일
  &.large + span {
    width: 24px;
    height: 24px;
  }

  &.medium + span {
    width: 18px;
    height: 18px;
  }

  &.small + span {
    width: 12px;
    height: 12px;
  }
`;

const StyledQuestion = styled.div`
  ${tw`mb-6 p-6 bg-opacity-70`}
  background-color: #F6F6F6;
  border-radius: 10px;
  text-align: center;
`;

const QuestionTitle = styled.h2`
  ${tw`mb-4 font-bold`}
  font-size: 14px;
`;

const RadioGroup = styled.div`
  ${tw`flex items-center justify-between`}
`;

const RadioLabel = styled.label`
  ${tw`flex items-center space-x-2`}
`;

const Question: React.FC<QuestionProps> = ({ id, title, onChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, Number(e.target.value));
  };

  const getRadioButtonSize = (index: number) => {
    if (index === 0 || index === 4) {
      return 'large';
    } else if (index === 1 || index === 3) {
      return 'medium';
    } else {
      return 'small';
    }
  };

  return (
    <StyledQuestion>
      <QuestionTitle>{title}</QuestionTitle>
      <RadioGroup>
        <span>동의</span>
        {Array.from({ length: 5 }, (_, index) => (
          <RadioLabel key={index}>
            <RadioButton
              className={getRadioButtonSize(index)}
              type="radio"
              name={`question-${id}`}
              value={index + 1}
              onChange={handleRadioChange}
            />
            <span></span>
          </RadioLabel>
        ))}
        <span>비동의</span>
      </RadioGroup>
    </StyledQuestion>
  );
};

export default Question;
