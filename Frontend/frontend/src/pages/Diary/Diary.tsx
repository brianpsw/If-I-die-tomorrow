import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import './CalenderStyles.css';
import Calendar from './Calender';
import DiaryDetail from './DiaryDetail';
import IIDT from '../../assets/icons/IIDT.svg';
import Button from '../../components/common/Button';
import uploadIcon from '../../assets/icons/camera_alt.svg';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import { Link } from 'react-router-dom';

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
  ${tw`flex items-center flex-col px-[24px] w-full h-[100vh]`}
`;
const LogoContainer = styled.img`
  ${tw`self-start mt-[60px] w-[71px] h-[44px] my-2`}
`;

const FormContainer = styled.div`
  ${tw`flex flex-col w-full rounded-lg bg-gray-100/80 mt-4 px-4`}
`;

const TitleInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[33px] rounded border-black break-all mt-4`}
`;

const ContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[86px] rounded border-black break-all my-4`}
`;
const PhotoContainer = styled.div`
  ${tw`items-center self-end w-full min-h-[93px] my-2 rounded border border-dashed border-black`}
`;
const FeedCheckContainer = styled.div`
  ${tw`flex items-center w-full h-[24px] my-2`}
`;
interface DiaryList {
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
  const [data, setData] = useState<DiaryList | null>();
  const [diaryList, setDiaryList] = useState<DiaryList[]>([]);
  const [sameDay, setSameDay] = useState<boolean>(false);
  //Form controller
  const [isChecked, setIsChecked] = useState(false);
  const [completeContent, setCompleteContent] = useState('');
  const [completeTitle, setCompleteTitle] = useState('');
  const [completeDate, setCompleteDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const handleSubmit = () => {
    //버킷 완료 api 연결
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
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
  const diary_data = [
    {
      diaryId: 1,
      title: 'gkgk',
      content: 'gkgk',
      imageUrl: 'gkgk',
      secret: true,
      createdAt: '2023-04-30 12:45:23',
      updatedAt: '2023-04-30 12:45:23',
      commentCount: 2,
    },
    // {
    //   diaryId: 1,
    //   title: 'gkgk',
    //   content: 'gkgk',
    //   imageUrl: 'gkgk',
    //   secret: true,
    //   createdAt: '2023-05-01 12:45:23',
    //   updatedAt: '2023-05-01 12:45:23',
    //   commentCount: 2,
    // },
    {
      diaryId: 2,
      title: 'gkgk',
      content: 'gkgk',
      imageUrl: 'gkgk',
      secret: true,
      createdAt: '2023-04-29 12:45:23',
      updatedAt: '2023-04-29 12:45:23',
      commentCount: 2,
    },
  ];
  useEffect(() => {
    setDiaryList(diary_data);
  }, []);

  const showDetailsHandle = (diaryData: DiaryList | null) => {
    if (diaryData) {
      return setData(diaryData);
    } else {
      return setData(null);
    }
  };

  return (
    <div className="max-w-[390px]">
      <Container>
        <LogoContainer src={IIDT} />
        <Calendar
          showDetailsHandle={showDetailsHandle}
          diaryList={diaryList}
          setSameDay={setSameDay}
        />
        {/* 해당 날짜에 데이터가 있을경우 다이어리 피드 보여주기 */}
        {data ? (
          <Link to={`/diary/${data.diaryId}`}>
            <CardWrap className="flex flex-col w-[340px] mt-6">
              <NickDateWrap>
                <Nickname>username</Nickname>
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
          </Link>
        ) : (
          ''
        )}
        {/* 사용일자와 같은 날일 경우 다이어리 작성 form 보여주기 */}
        {!data && sameDay ? (
          <FormContainer>
            <form action="submit">
              <TitleInputContainer
                onChange={(e) => setCompleteTitle(e.target.value)}
                value={completeTitle}
                placeholder="제목을 작성해주세요."
              />
            </form>
            <form action="submit">
              <ContentInputContainer
                onChange={(e) => setCompleteContent(e.target.value)}
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
              <Button onClick={handleSubmit} color="#B3E9EB" size="sm">
                작성 완료
              </Button>
            </div>
          </FormContainer>
        ) : (
          ''
        )}
      </Container>
    </div>
  );
}

export default Diary;
