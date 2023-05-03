import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Question from './Question';
import Button from '../../components/common/Button';
import backgroundImg from '../../assets/images/diary_bg.png';

const questions = [
  '주기적으로 새로운 친구들을 만든다.',
  '압박감이 심한 환경에서도 평정심을 유지하는 편이다.',
  '일정이나 목록으로 계획을 세우는 일을 좋아한다.',
  '작은 실수로도 자신의 능력이나 지식을 의심하곤 한다.',
  '예술 작품의 다양한 해석에 대해 토록하는 일에는 크게 관심이 없다.',
];

interface PersonalityTestProps {
  onSubmit?: (answers: { [key: string]: number }) => void;
}

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
`;

const SurveyForm = styled.form`
  ${tw`flex flex-col items-center mx-auto`}
  max-width: calc(100% - 48px);
`;

const QuestionWrapper = styled.div`
  ${tw`w-full`}
`;

const SurveyText = styled.p`
  text-align: center;
  color: #fff;
  font-size: 12px;
`;

const StyledButton = styled(Button)`
  ${tw`mt-6 mb-12`}
`;

const Survey: React.FC<PersonalityTestProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  const handleChange = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [`q${id}`]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit && onSubmit(answers);
  };

  return (
    <Background>
      <SurveyForm onSubmit={handleSubmit}>
        <SurveyText>
          성향 설문조사를 통해 나에게 맞는
          <br />
          추천 버킷리스트를 받아보세요
        </SurveyText>
        <QuestionWrapper>
          {questions &&
            questions.map((title, index) => (
              <Question
                key={index}
                id={index + 1}
                title={title}
                onChange={handleChange}
              />
            ))}
        </QuestionWrapper>
        <StyledButton color="#FFA9A9" size="md">
          선택완료
        </StyledButton>
      </SurveyForm>
    </Background>
  );
};

export default Survey;
