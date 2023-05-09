import React, { useState, useEffect } from 'react';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/diary_bg.png';
import TopBar from '../../components/common/TopBar';
import { userDataState } from '../../states/UserDataState';

interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  createdAt: string;
  updatedAt: string;
  nickname: string;
}

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  background-attachment: fixed;
`;

const Container = styled.div`
  ${tw`pt-12 pb-24`}
`;

const DiaryWrap = styled.div`
  ${tw`mb-6 p-6 flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  position: relative;
`;

const DiaryHeader = styled.div`
  ${tw`flex`}// justify-content: space-between;
`;

const ContentTitle = styled.div`
  ${tw``}
  width: 280px;
  word-break: break-all;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;
const Nickname = styled.p`
  font-size: 15px;
`;

const CreateDate = styled.div`
  font-size: 12px;
`;

const DiaryImg = styled.div`
  ${tw`mt-6 mb-6 flex flex-col mx-auto`}
  width: 100%;
`;

const DiaryText = styled.div`
  ${tw`flex flex-col mx-auto`}
  width: 100%;
  font-size: 15px;
`;

function DiaryDetail() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [diaryDetail, setDiaryDetail] = useState<Diary | null>(null);
  const userData = useRecoilValue(userDataState);
  const navigate = useNavigate();
  const fetchDiaryDetail = async () => {
    if (Object.keys(userData).length === 0) {
      return;
    }
    const data = userData.diaries;
    data.forEach((diary) => {
      if (diary.diaryId == (diaryId as unknown as number)) {
        setDiaryDetail(diary);
      }
    });
  };

  useEffect(() => {
    fetchDiaryDetail();
  }, [diaryId]);

  if (!diaryDetail) {
    return <div>Loading...</div>;
  }

  const diary = diaryDetail;

  return (
    <div>
      <Background>
        <TopBar title="" />
        <Container>
          <DiaryWrap>
            <DiaryHeader>
              <div>
                <ContentTitle className="text-h3">{diary.title}</ContentTitle>
                <Nickname>{diary.nickname}</Nickname>
                <CreateDate>
                  {new Date(diary.createdAt).toISOString().split('T')[0]}
                </CreateDate>
              </div>
            </DiaryHeader>
            <DiaryImg>
              {diary.imageUrl && diary.imageUrl !== '""' && (
                <img src={diary.imageUrl} alt="Diary" />
              )}
            </DiaryImg>
            <DiaryText>{diary.content}</DiaryText>
          </DiaryWrap>
        </Container>
      </Background>
    </div>
  );
}

export default DiaryDetail;
