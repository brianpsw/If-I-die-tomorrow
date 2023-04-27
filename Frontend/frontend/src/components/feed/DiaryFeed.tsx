import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import requests from '../../api/config';
import {
  Container,
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
  Date,
} from './FeedEmotion';

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
  const [items, setItems] = useState<DiaryItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page: number) => {
    try {
      const response = await axios.get(`${requests.base_url}/board/diary`, {
        params: {
          page,
          size: 10,
          // secret: true,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response.data;
        setItems((prevItems: DiaryItem[]) => {
          const newData = data.filter(
            (newItem: DiaryItem) =>
              !prevItems.some(
                (prevItem: DiaryItem) =>
                  prevItem.diary.diaryId === newItem.diary.diaryId,
              ),
          );
          return [...prevItems, ...newData];
        });
        setHasMore(!!data.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
      console.log('무한 스크롤 작동');
    }
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
        {items.length === 0 ? (
          <div>게시물이 없습니다.</div>
        ) : (
          items.map((item: DiaryItem, index: number) => {
            const diary = item.diary;
            const commentCount = item.comments.length;
            return (
              <CardWrap key={index}>
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
                    {diary.imageUrl && (
                      <Image src={diary.imageUrl} alt="Diary" />
                    )}
                  </div>
                </ContentImg>
                <Meta>
                  <Comments>댓글 {commentCount}개</Comments>
                </Meta>
              </CardWrap>
            );
          })
        )}
      </InfiniteScroll>
    </Container>
  );
}

export default DiaryFeed;
