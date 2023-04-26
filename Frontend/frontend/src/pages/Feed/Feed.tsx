import React, { useState, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';
import DiaryFeed from '../../components/feed/DiaryFeed';
import BucketFeed from '../../components/feed/BucketFeed';

const Container = styled.div`
  ${tw`flex flex-col mx-auto pt-12`}
  max-width: calc(100% - 48px);
  text-align: center;
  justify-content: center;
`;

const FeedTab = styled.div`
  ${tw`flex`}
  justify-content: space-evenly;
`;

const Tab = styled.span<{ isSelected: boolean }>`
  ${tw`cursor-pointer mb-6`}
  ${({ isSelected }) => (isSelected ? tw`font-bold border-b-2` : null)}
`;

function Feed() {
  const [feedType, setFeedType] = useState<'diary' | 'bucketList'>('diary');

  return (
    <Container>
      <FeedTab>
        <Tab
          isSelected={feedType === 'bucketList'}
          onClick={() => setFeedType('bucketList')}
        >
          버킷리스트
        </Tab>
        <Tab
          isSelected={feedType === 'diary'}
          onClick={() => setFeedType('diary')}
        >
          다이어리
        </Tab>
      </FeedTab>
      {feedType === 'diary' ? <DiaryFeed /> : <BucketFeed />}
    </Container>
  );
}

export default Feed;
