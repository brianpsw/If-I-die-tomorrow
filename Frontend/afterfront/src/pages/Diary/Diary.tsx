'use client';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  Container,
  CardWrap,
  NickDateWrap,
  Title,
  Content,
  Image,
  ContentImg,
  TitleContent,
  Nickname,
  DateWrap,
} from './FeedEmotion';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import { Link } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';

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

function DiaryFeed() {
  const [items, setItems] = useState<Diary[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const userData = useRecoilValue(userDataState);

  const fetchData = async (page: number) => {
    try {
      if (Object.keys(userData).length === 0) {
        return;
      }
      const data = userData.diaries.slice(page * 10, (page + 1) * 10);

      if (data.length) {
        setItems((prevItems: Diary[]) => {
          const newData = data.filter(
            (newItem: Diary) =>
              !prevItems.some(
                (prevItem: Diary) => prevItem.diaryId === newItem.diaryId,
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
    <>
      <TopBar title="" />
      <Container>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b style={{ color: 'white' }}>모든 다이어리를 불러왔습니다.</b>
            </p>
          }
        >
          {items.length === 0 ? (
            <div>게시물이 없습니다.</div>
          ) : (
            items.map((item: Diary) => {
              const diary = item;
              return (
                <Link to={`/diary/${item.diaryId}`} key={item.diaryId}>
                  <CardWrap key={item.diaryId}>
                    <NickDateWrap>
                      <Nickname>{diary.nickname}</Nickname>
                      <DateWrap>{diary.createdAt}</DateWrap>
                    </NickDateWrap>
                    <ContentImg>
                      <TitleContent
                        hasImage={Boolean(
                          diary.imageUrl && diary.imageUrl !== '""',
                        )}
                      >
                        <Title>
                          {diary.title.length > 18
                            ? diary.title.substring(0, 18) + '⋯'
                            : diary.title}
                        </Title>
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
                  </CardWrap>
                </Link>
              );
            })
          )}
        </InfiniteScroll>
      </Container>
    </>
  );
}

export default DiaryFeed;
