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

interface BucketItem {
  bucket: {
    bucketId: number;
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

function BucketFeed() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page: number) => {
    try {
      const response = await axios.get(`${requests.base_url}/board/bucket`, {
        params: {
          page,
          size: 10,
          // secret: true,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const { data } = response.data;
        setItems((prevItems: BucketItem[]) => {
          const newData = data.filter(
            (newItem: BucketItem) =>
              !prevItems.some(
                (prevItem: BucketItem) =>
                  prevItem.bucket.bucketId === newItem.bucket.bucketId,
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
            <b style={{ color: 'white' }}>모든 버킷리스트를 불러왔습니다.</b>
          </p>
        }
      >
        {items.length === 0 ? (
          <div>게시물이 없습니다.</div>
        ) : (
          items.map((item: BucketItem, index: number) => {
            const bucket = item.bucket;
            const commentCount = item.comments.length;
            return (
              <CardWrap key={index}>
                <NickDateWrap>
                  <Nickname>{bucket.nickname}</Nickname>
                  <Date>{bucket.created}</Date>
                </NickDateWrap>
                <ContentImg>
                  <TitleContent
                    hasImage={Boolean(
                      bucket.imageUrl && bucket.imageUrl !== '""',
                    )}
                  >
                    <Title>{bucket.title}</Title>
                    <Content>
                      {bucket.content.length > 40
                        ? bucket.content.substring(0, 40) + '⋯'
                        : bucket.content}
                    </Content>
                  </TitleContent>
                  <div>
                    {bucket.imageUrl && bucket.imageUrl.length > 0 && (
                      <Image src={bucket.imageUrl} alt="Bucket" />
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

export default BucketFeed;
