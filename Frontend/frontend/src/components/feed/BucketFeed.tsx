import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import BucketDetail from '../../pages/Bucket/BucketDetail';
import { Link } from 'react-router-dom';
import Loading from '../common/Loading';
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
  DateWrap,
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
    createdAt: string;
    updated: string;
  };
  comments: Comment[];
}

function BucketFeed() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef<HTMLAnchorElement>(null);

  const fetchData = async (page: number) => {
    try {
      const response = await defaultApi.get(
        requests.GET_BUCKET_FEED(page, 10),
        {
          withCredentials: true,
        },
      );

      if (response.status === 200 && typeof response.data === 'object') {
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
    function handleResize() {
      const lastItemLocation = lastItemRef.current?.getBoundingClientRect();
      if (
        (lastItemLocation?.bottom as unknown as number) <= window.innerHeight
      ) {
        fetchMoreData();
      }
    }
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
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
        loader={<div>Loading</div>}
        endMessage={
          <p
            style={{ textAlign: 'center', marginBottom: '5%', marginTop: '5%' }}
          >
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
              <Link
                to={`/bucket/${bucket.bucketId}`}
                key={index}
                ref={index === items.length - 1 ? lastItemRef : null}
              >
                <CardWrap key={index}>
                  <NickDateWrap>
                    <Nickname>{bucket.nickname}</Nickname>
                    <DateWrap>
                      {new Date(bucket.createdAt).toISOString().split('T')[0]}
                    </DateWrap>
                  </NickDateWrap>
                  <ContentImg>
                    <TitleContent
                      hasImage={Boolean(
                        bucket.imageUrl && bucket.imageUrl !== '""',
                      )}
                    >
                      <Title>
                        {bucket.title.length > 18
                          ? bucket.title.substring(0, 18) + '⋯'
                          : bucket.title}
                      </Title>
                      <Content>
                        {bucket.content.length > 40
                          ? bucket.content.substring(0, 40) + '⋯'
                          : bucket.content}
                      </Content>
                    </TitleContent>
                    <div>
                      {bucket.imageUrl && bucket.imageUrl !== '""' && (
                        <Image src={bucket.imageUrl} alt="Bucket" />
                      )}
                    </div>
                  </ContentImg>
                  <Meta>
                    <Comments>댓글 {commentCount}개</Comments>
                  </Meta>
                </CardWrap>
              </Link>
            );
          })
        )}
      </InfiniteScroll>
    </Container>
  );
}

export default BucketFeed;
