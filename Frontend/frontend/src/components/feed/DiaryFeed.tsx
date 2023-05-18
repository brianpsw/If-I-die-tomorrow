import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { defaultApi } from '../../api/axios';
import requests from '../../api/config';
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

interface DiaryItem {
  diary: {
    diaryId: number;
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

function DiaryFeed() {
  const [items, setItems] = useState<DiaryItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const lastItemRef = useRef<HTMLAnchorElement>(null);

  const fetchData = async (page: number) => {
    try {
      const response = await defaultApi.get(requests.GET_DIARY_FEED(page, 10), {
        withCredentials: true,
      });

      if (response.status === 200 && typeof response.data === 'object') {
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
            <b style={{ color: 'white' }}>모든 다이어리를 불러왔습니다.</b>
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
              <Link
                to={`/diary/${diary.diaryId}`}
                key={index}
                ref={index === items.length - 1 ? lastItemRef : null}
              >
                <CardWrap key={index}>
                  <NickDateWrap>
                    <Nickname>{diary.nickname}</Nickname>
                    <DateWrap>
                      {new Date(diary.createdAt).toISOString().split('T')[0]}
                    </DateWrap>
                  </NickDateWrap>
                  <ContentImg>
                    <TitleContent
                      hasImage={Boolean(
                        diary.imageUrl && diary.imageUrl !== '""',
                      )}
                    >
                      <Title>{diary.title}</Title>
                      <Content>
                        {diary.content.length > 40
                          ? diary.content.substring(0, 40) + '⋯'
                          : diary.content}
                      </Content>
                    </TitleContent>
                    <div>
                      {diary.imageUrl && diary.imageUrl !== '""' && (
                        <Image src={diary.imageUrl} alt="Diary" />
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

export default DiaryFeed;
