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
        withCredentials: true,
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
    fetchData(page + 1);
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
            <CardWrap key={diary.diaryId}>
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
            </CardWrap>
          );
        })}
      </InfiniteScroll>
    </Container>
  );
}

export default DiaryFeed;
