import React, { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Question from '../../components/diary/Question';
import Button from '../../components/common/Button';
import backgroundImg from '../../assets/images/diary_bg.png';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const questions = [
  '나는 새로운 사람들을 만나는 것이 흥미롭다.',
  '팀장보다는 팀원으로 소속되어있는게 편하다.',
  '관심이 가는 사람에게 다가가서 대화를 시작하기가 어렵지 않다.',
  '리스크를 감수하고 큰 성공을 이루려는 것보다는 안정적으로 성장하는 것이 좋다.',
  '대체로 사람들 앞에 서서 이야기하는 것이 편하다.',
  '새로운 아이디어나 접근 방식을 시도하는 것은 피곤하다.',
  '혼자보다는 다른 사람과 시간을 보내고 싶어한다.',
  '압박감을 느끼는 상황에서는 빠른 결정을 하기가 힘들다.',
  '조용한 공간보다는 사람 많고 떠들썩한 분위기를 좋아한다.',
  '새로운 경험보다는 익숙한 환경에서 일하는 것을 선호한다.',
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
  ${tw`mt-8 flex flex-col items-center mx-auto`}
  max-width: calc(100% - 48px);
  padding-bottom: 18%;
  // border: 1px solid white;
`;

const QuestionWrapper = styled.div`
  ${tw`w-full`}
`;

const SurveyText = styled.p`
  ${tw`text-p2 mb-14`}
  text-align: center;
  color: #fff;
`;

const StyledButton = styled(Button)`
  ${tw`mt-6 mb-12`}
`;

const Survey: React.FC<PersonalityTestProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const handleChange = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [`q${id}`]: value }));
  };

  // 모든 문항에 답변이 있는지 확인하는 함수
  const allQuestionsAnswered = () => {
    for (let i = 1; i <= questions.length; i++) {
      if (answers[`q${i}`] === undefined) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 문항에 대한 응답이 없는 경우
    if (!allQuestionsAnswered()) {
      alert('모든 문항을 선택해주세요!');
      return;
    }

    let introvertExtrovertScore = 0;
    let stabilityAchievementScore = 0;
    let personalityId: number;
    let personalityType: string;

    for (let i = 1; i <= 10; i++) {
      if (i % 2 === 1) {
        // 1, 3, 5, 7, 9번 문항
        introvertExtrovertScore += answers[`q${i}`];
      } else {
        // 2, 4, 6, 8, 10번 문항
        stabilityAchievementScore += answers[`q${i}`];
      }
    }

    const introvertExtrovert =
      introvertExtrovertScore > 10 ? '외향형' : '내향형';
    const stabilityAchievement =
      stabilityAchievementScore > 10 ? '안정형' : '진취형';

    personalityType = `${introvertExtrovert}${stabilityAchievement}`;

    switch (personalityType) {
      case '외향형안정형':
        personalityId = 1;
        break;
      case '외향형진취형':
        personalityId = 2;
        break;
      case '내향형안정형':
        personalityId = 3;
        break;
      case '내향형진취형':
        personalityId = 4;
        break;
      default:
        throw new Error('Invalid personality type');
    }

    console.log(`${personalityId}:${personalityType}`);

    // API 요청
    try {
      const response = await defaultApi.patch(
        requests.PATCH_USERPERSONALITY(),
        {
          personalityId: personalityId,
        },
        { withCredentials: true },
      );
      console.log(response.data);
      alert('설문이 제출되었습니다.');
      navigate('/diary');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Background>
      <TopBar title="사용자 성향 조사" />
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
        {/* <Link to="/diary"> */}
        <StyledButton color="#FFA9A9" size="md">
          선택완료
        </StyledButton>
        {/* </Link> */}
      </SurveyForm>
    </Background>
  );
};

export default Survey;
