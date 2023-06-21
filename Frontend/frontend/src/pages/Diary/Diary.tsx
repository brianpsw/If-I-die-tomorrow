import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import tw from 'twin.macro';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import './CalendarStyles.css';
import Calendar from '../../components/diary/Calendar';
import IIDT from '../../assets/images/text_logo.png';
import Button from '../../components/common/Button';
import uploadIcon from '../../assets/icons/camera_alt.svg';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import surveyIcon from '../../assets/icons/survey.svg';
import Loading from '../../components/common/Loading';

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
const Container = styled.div`
  ${tw`flex items-center flex-col px-[24px] w-full overflow-y-auto mb-[80px]`}
`;

const TopTitle = styled.div`
  ${tw`flex w-full text-white justify-center mt-8 text-p2 mb-10`}
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[43px] w-[120px] my-[8px]`}
`;

const FillingText = styled.h4`
  ${tw`text-white`}
  text-shadow: 4px 4px 4px #111111;
`;

const FormContainer = styled.div`
  ${tw`flex flex-col w-full rounded-lg bg-gray-100/80 mt-[16px] px-[16px]`}
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
`;

const TitleInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full pt-[4px] h-[33px] text-p2 bg-white rounded border-black break-all my-[16px] px-[6px]`}
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
const DeleteBtn = styled.div`
  ${tw`fill-black w-[30px] absolute h-[30px] right-[4px] top-[4px] cursor-pointer`}
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
  const [data, setData] = useState<Diary | null>();
  const [diarys, setDiarys] = useState<Diary[]>([]);
  const [insight, setInsight] = useState<string | null>('');
  const [sameDay, setSameDay] = useState<boolean>(false);
  //Form controller
  const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [completeContent, setCompleteContent] = useState('');
  const [completeTitle, setCompleteTitle] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isCompleteTitleValid, setIsCompleteTitleValid] = useState(false);
  const [isCompleteContentValid, setIsCompleteContentValid] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      setLoadingOpen(true);
      try {
        await defaultApi.post(requests.POST_DIARY(), formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoadingOpen(false);

        Swal.fire({
          title: '다이어리 완료 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
        get_user_diary();
      } catch (error) {
        setLoadingOpen(false);
        Swal.fire({
          title: '다이어리 완료 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      }
    };
    post_diary();
  };
  const handleDeleteItemImage = () => {
    setPhoto(null);
    setImageUrl(null);
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
    const get_insight = async () => {
      try {
        const response = await defaultApi.get(
          requests.GET_INSIGHT(userInfo[0]?.personalityId),
          {
            withCredentials: true,
          },
        );
        setInsight(response.data.content);
        // console.log(response.data);
      } catch (error: any) {
        if (error.response.status === 404) {
        }
        throw error;
      }
    };
    get_insight();
    if (diarys.length === 0) {
      get_user_diary();
    }
  }, []);

  const showDetailsHandle = (diaryData: Diary | null) => {
    if (diaryData) {
      setData(diaryData);
      setFormOpen(false);
      // setFormOpen2(false);
    } else {
      setData(diaryData);
      setFormOpen(true);
    }
  };
  // useEffect(() => {
  //   // console.log(diarys.length);
  //   if (!data && sameDay) {
  //     setFormOpen(true);
  //   } else {
  //     setFormOpen(false);
  //   }
  // }, [data, sameDay]);
  return (
    <div className="">
      {/* <Background> */}
      {loadingOpen ? <Loading /> : ''}
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
        <TopTitle>
          <FillingText className="text-h4">다이어리</FillingText>
        </TopTitle>
        <p
          className="text-p3"
          style={{
            color: 'white',
            marginBottom: '1%',
            // border: '1px solid white',
            // borderRadius: '10px',
            // padding: '2%',
          }}
        >
          {insight}
        </p>
        <Calendar
          showDetailsHandle={showDetailsHandle}
          diarys={diarys}
          setSameDay={setSameDay}
        />
        {/* 해당 날짜에 데이터가 있을경우 다이어리 피드 보여주기 */}
        {data ? (
          <CardWrap
            className="flex flex-col w-full mt-6"
            onClick={handleClickDiary}
          >
            <NickDateWrap>
              <Nickname>{userInfo[0]?.nickname}</Nickname>
              <DateWrap>
                {new Date(data.createdAt).toLocaleDateString().split('T')[0]}
              </DateWrap>
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
        {formOpen && sameDay && !data ? (
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
                  <div className="relative">
                    <DeleteBtn onClick={handleDeleteItemImage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                      </svg>
                    </DeleteBtn>
                    <img
                      className="image-upload-preview w-full h-full bg-auto "
                      src={imageUrl}
                      alt="upload-preview"
                      onClick={handleClick}
                    />
                  </div>
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
                color={isValid ? '#0E848A' : '#B3E9EB'}
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
