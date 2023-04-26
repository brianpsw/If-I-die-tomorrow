import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import tw from 'twin.macro';
import axios from 'axios';
import requests from '../../api/config';

const Container = styled.div``;

const DiaryCard = styled.div`
  ${tw`mb-4 p-4 bg-white shadow rounded`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

const NickDateWrap = styled.div`
  ${tw`flex justify-between mb-2`}
`;

const Title = styled.h3`
  ${tw`text-lg font-bold mb-2`}
`;

const Content = styled.p`
  ${tw`text-sm`}
`;

const Image = styled.img`
  ${tw`w-full mb-2`}
  width: 100px;
`;

const ContentImg = styled.div`
  ${tw`flex justify-between`}
`;

const TitleContent = styled.div`
  ${tw`flex flex-col`}
  text-align: start;
  justify-content: center;
`;

const Meta = styled.div`
  ${tw`text-xs mt-2`}
  text-align: end;
`;

const Nickname = styled.span`
  ${tw`font-medium`}
`;

const Comments = styled.span``;

const Date = styled.span`
  ${tw`text-gray-500`}
`;

// const mockData = [
//   {
//     diaryId: 1,
//     title: '인수경 귀여워 짜릿해',
//     content: '갓수경 멋있어',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 2,
//     title: '이거는 사진 없는 다요리',
//     content: '룰루랄라',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 3,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 4,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 5,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 6,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 7,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 8,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 9,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 10,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 11,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 12,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 13,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 14,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 15,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 16,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 17,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 18,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 19,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 20,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 21,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 22,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 23,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 24,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 25,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 26,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 27,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 28,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 29,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 30,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 31,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 32,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 33,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 34,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 35,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 36,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 37,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 38,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 39,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 40,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 41,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 42,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 43,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 44,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 45,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 46,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 47,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 48,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 49,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 50,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 51,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
//   {
//     diaryId: 52,
//     title: '첫 번째 다이어리',
//     content: '오늘은 첫 번째 다이어리를 작성했습니다.',
//     imageUrl: 'https://picsum.photos/300/300/?random',
//     secret: false,
//     createdAt: '2023-01-01',
//     updatedAt: '2023-01-01',
//     commentCount: 3,
//   },
// ];
interface Comment {
  commentId: bigint;
  content: string;
  nickname: string;
  created: string;
  updated: string;
}

interface DiaryItem {
  diary: {
    diaryId: number;
    nickname: string;
    title: string;
    content: string;
    imageUrl: string;
    secret: boolean;
    created: string;
    updated: string;
  };
  comments: Comment[];
}

function DiaryFeed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page: number) => {
    try {
      const response = await axios.get(`${requests.base_url}/board/diary`, {
        params: {
          page,
          size: 10,
        },
      });
      if (response.status === 200) {
        const { data, hasNext } = response.data;
        setItems((prevItems) => prevItems.concat(data));
        setHasMore(hasNext);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  const fetchMoreData = () => {
    if (!hasMore) {
      return;
    }
    fetchData(page);
  };

  return (
    <Container>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>모든 다이어리를 불러왔습니다.</b>
          </p>
        }
      >
        {items.map((item: DiaryItem) => {
          const diary = item.diary;
          const commentCount = item.comments.length;
          return (
            <DiaryCard key={diary.diaryId}>
              <NickDateWrap>
                <Nickname>{diary.nickname}</Nickname>
                <Date>{diary.created}</Date>
              </NickDateWrap>
              <ContentImg>
                <TitleContent>
                  <Title>{diary.title}</Title>
                  <Content>{diary.content}</Content>
                </TitleContent>
                <div>
                  {diary.imageUrl && <Image src={diary.imageUrl} alt="Diary" />}
                </div>
              </ContentImg>
              <Meta>
                <Comments>댓글 {commentCount}개</Comments>
              </Meta>
            </DiaryCard>
          );
        })}
      </InfiniteScroll>
    </Container>
  );
}

export default DiaryFeed;
