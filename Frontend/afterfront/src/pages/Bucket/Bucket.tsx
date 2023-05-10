'use client';
import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CheckedIcon from '../../assets/icons/checked_box.svg';
import UnCheckedIcon from '../../assets/icons/unchecked_box.svg';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import { Link } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Navigation } from '../../components/common/Navigation';

interface Bucket {
  bucketId: number;
  nickname: string;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
}
const Container = styled.div`
  ${tw`flex flex-col items-center w-full my-2`}
`;
const BucketContainer = styled.div`
  ${tw`flex items-center w-full h-[64px] bg-gray-100/80 px-[16px] my-[4px] border-l-[8px]`}
`;
const ContentContainer = styled.div`
  ${tw`flex items-center justify-between border-b border-black w-full h-[33px] px-[6px]`}
`;

function BucketFeed() {
  const [items, setItems] = useState<Bucket[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const userData = useRecoilValue(userDataState);
  const lastItemRef = useRef<HTMLAnchorElement>(null);

  const fetchData = async (page: number) => {
    try {
      if (Object.keys(userData).length === 0) {
        return;
      }
      const data = userData.buckets.slice(page * 10, (page + 1) * 10);

      if (data.length) {
        setItems((prevItems: Bucket[]) => {
          const newData = data.filter(
            (newItem: Bucket) =>
              !prevItems.some(
                (prevItem: Bucket) => prevItem.bucketId === newItem.bucketId,
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
      console.log(lastItemLocation?.bottom);
      console.log(window.innerHeight);
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
      setPage((prevPage: number) => prevPage + 1);
      console.log('무한 스크롤 작동');
    }
  };

  return (
    <>
      <Navigation />
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
            items.map((item: Bucket, index: number) => {
              const bucket = item;
              return (
                <Link
                  to={`/bucket/${bucket.bucketId}`}
                  key={bucket.bucketId}
                  ref={index === items.length - 1 ? lastItemRef : null}
                >
                  <BucketContainer>
                    {bucket.complete ? (
                      <img src={CheckedIcon} alt="체크함" />
                    ) : (
                      <img src={UnCheckedIcon} alt="체크 안함" />
                    )}
                    <ContentContainer>
                      <span className="text-p1">{bucket.title}</span>
                    </ContentContainer>
                  </BucketContainer>
                </Link>
              );
            })
          )}
        </InfiniteScroll>
      </Container>
    </>
  );
}

export default BucketFeed;
