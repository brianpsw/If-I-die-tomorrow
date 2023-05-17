import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { calendarState } from '../../states/CalendarState';
import { userState } from '../../states/UserState';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import './CalendarStyles.css';
import Calendar from '../../components/diary/Calendar';
import backgroundImg from '../../assets/images/bucket_bg.png';
import IIDT from '../../assets/images/text_logo.png';
import Button from '../../components/common/Button';
import uploadIcon from '../../assets/icons/camera_alt.svg';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import surveyIcon from '../../assets/icons/survey.svg';

import {
  CardWrap,
  NickDateWrap,
  Title,
  Content,
  Image,
  ContentImg,
  TitleContent,
  Meta,
  Nickname,
  Comments,
  DateWrap,
} from '../../components/feed/FeedEmotion';
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
  ${tw`flex items-center flex-col px-[24px] w-full h-[92vh] overflow-y-auto`}
  padding-bottom: 10%;
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[60px] my-[8px]`}
`;

const FormContainer = styled.div`
  ${tw`flex flex-col w-full rounded-lg bg-gray-100/80 mt-[16px] px-[16px]`}
`;

const TitleInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full text-p1 h-[33px] p-[8px] rounded border-black break-all mt-[16px]`}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full text-p1 h-[86px] p-[8px] rounded border-black break-all my-[16px]`}
`;
const PhotoContainer = styled.div`
  ${tw`items-center self-end w-full min-h-[93px] my-[8px] rounded border border-dashed border-black`}
`;
const FeedCheckContainer = styled.div`
  ${tw`flex items-center w-full h-[24px] my-[8px]`}
`;
interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
}

function Diary() {
  const navigate = useNavigate();
  const userInfo = useRecoilState(userState);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(new Date());
  const [prevSelectedMonth, setPrevSelectedMonth] = useState<Date>(new Date());
  const [data, setData] = useState<Diary | null>();
  const [diarys, setDiarys] = useState<Diary[]>([]);
  const [sameDay, setSameDay] = useState<boolean>(false);
  //Form controller
  const [isChecked, setIsChecked] = useState(false);
  const [completeContent, setCompleteContent] = useState('');
  const [completeTitle, setCompleteTitle] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isCompleteTitleValid, setIsCompleteTitleValid] = useState(false);
  const [isCompleteContentValid, setIsCompleteContentValid] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    if (isCompleteContentValid && isCompleteTitleValid) {
      setIsValid(true);
    }
  }, [isCompleteTitleValid, isCompleteContentValid]);
  const get_user_diary = async () => {
    try {
      const response = await defaultApi.get(requests.GET_USER_DIARY(), {
        withCredentials: true,
      });
      setDiarys(response.data);
    } catch (error) {
      throw error;
    }
  };
  const handleSubmit = () => {
    const formData = new FormData();
    let hasPhoto = false;
    if (photo) {
      formData.append('photo', photo);
      hasPhoto = true;
    }
    formData.append(
      'data',
      JSON.stringify({
        title: completeTitle,
        content: completeContent,
        secret: !isChecked,
        hasPhoto: hasPhoto,
      }),
    );

    const post_diary = async () => {
      try {
        await defaultApi.post(requests.POST_DIARY(), formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        get_user_diary();
      } catch (error) {
        throw error;
      }
    };
    post_diary();
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setPhoto(file);
    }
  };
  const handleClickDiary = () => {
    navigate(`/diary/${data?.diaryId}`);
  };
  const handleFeedCheckClick = () => {
    setIsChecked(!isChecked);
  };
  const handleClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompleteContent(e.currentTarget.value);
    setIsCompleteContentValid(e.currentTarget.value.length > 0);
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompleteTitle(e.currentTarget.value);
    setIsCompleteTitleValid(e.currentTarget.value.length > 0);
  };
  const moveToSurvey = () => {
    navigate('/survey');
  };
  useEffect(() => {
    // console.log(diarys.length);
    if (diarys.length === 0) {
      get_user_diary();
    }
  }, []);

  const showDetailsHandle = (diaryData: Diary | null) => {
    if (diaryData) {
      return setData(diaryData);
    } else {
      return setData(null);
    }
  };

  return (
    <div className="w-full">
      {/* <Background> */}
      <Container>
        <div className="flex w-full justify-between">
          <LogoContainer src={IIDT} />
          <img
            className="mt-[60px]"
            src={surveyIcon}
            onClick={moveToSurvey}
            alt="survey_icon"
          />
        </div>
        <Calendar
          showDetailsHandle={showDetailsHandle}
          diarys={diarys}
          setSameDay={setSameDay}
          setPrevSelectedDate={setPrevSelectedDate}
          setPrevSelectedMonth={setPrevSelectedMonth}
        />
        {/* 해당 날짜에 데이터가 있을경우 다이어리 피드 보여주기 */}
        {data ? (
          <CardWrap
            className="flex flex-col w-full mt-6"
            onClick={handleClickDiary}
          >
            <NickDateWrap>
              <Nickname>{userInfo[0]?.nickname}</Nickname>
              <DateWrap>{data.createdAt}</DateWrap>
            </NickDateWrap>
            <ContentImg>
              <TitleContent
                hasImage={Boolean(data.imageUrl && data.imageUrl !== '""')}
              >
                <Title>{data.title}</Title>
                <Content>
                  {data.content.length > 40
                    ? data.content.substring(0, 40) + '⋯'
                    : data.content}
                </Content>
              </TitleContent>
              <div>
                {data.imageUrl && data.imageUrl !== '""' && (
                  <Image src={data.imageUrl} alt="Diary" />
                )}
              </div>
            </ContentImg>
            <Meta>
              <Comments>댓글 {data.commentCount}개</Comments>
            </Meta>
          </CardWrap>
        ) : (
          ''
        )}
        {!data && sameDay ? (
          <FormContainer>
            <form action="submit">
              <TitleInputContainer
                onChange={handleTitleChange}
                value={completeTitle}
                placeholder="제목을 작성해주세요."
              />
            </form>
            <form action="submit">
              <ContentInputContainer
                onChange={handleContentChange}
                value={completeContent}
                placeholder="오늘 질문, 혹은 데일리 버킷에 대해 작성해 주세요."
              />
            </form>
            <PhotoContainer>
              <div className="image-upload-container w-full h-full">
                {imageUrl ? (
                  <img
                    className="image-upload-preview w-full h-full bg-auto "
                    src={imageUrl}
                    alt="upload-preview"
                    onClick={handleClick}
                  />
                ) : (
                  <div
                    className="image-upload-placeholder h-full"
                    onClick={handleClick}
                  >
                    <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                      <img src={uploadIcon} alt="" />
                    </div>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  hidden
                />
              </div>
            </PhotoContainer>
            <FeedCheckContainer>
              {isChecked ? (
                <img onClick={handleFeedCheckClick} src={CheckedIcon} alt="" />
              ) : (
                <img
                  onClick={handleFeedCheckClick}
                  src={UnCheckedIcon}
                  alt=""
                />
              )}
              <span className="text-p1 mx-2">피드 공개여부 체크</span>
            </FeedCheckContainer>
            <div className="flex w-full justify-center my-4">
              <Button
                onClick={handleSubmit}
                color="#B3E9EB"
                size="sm"
                disabled={isValid ? false : true}
              >
                작성 완료
              </Button>
            </div>
          </FormContainer>
        ) : (
          ''
        )}
      </Container>
      {/* </Background> */}
    </div>
  );
}

export default Diary;
