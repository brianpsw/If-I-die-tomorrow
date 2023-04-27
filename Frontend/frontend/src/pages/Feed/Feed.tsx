import React, { useState, useEffect, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/feed.png';
import Button from '../../components/common/Button';
import DiaryFeed from '../../components/feed/DiaryFeed';
import BucketFeed from '../../components/feed/BucketFeed';
import { useNavigate, useLocation } from 'react-router-dom';
import TopButton from '../../components/common/ScrollToTopButton';

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  ${tw`flex flex-col mx-auto pt-12  pb-24`}
  max-width: calc(100% - 48px);
  text-align: center;
  justify-content: center;
`;

const FeedTab = styled.div`
  ${tw`flex`}
  justify-content: space-evenly;
  color: white;
`;

const Tab = styled.span<{ isSelected: boolean }>`
  ${tw`cursor-pointer mb-12 inline-block pb-1`}
  ${({ isSelected }) => (isSelected ? tw`font-bold border-b-4` : null)}
  ${({ isSelected }) => (isSelected ? { borderColor: '#FFA9A9' } : null)}
  width: 110px;
`;

function Feed() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [feedType, setFeedType] = useState<'diary' | 'bucketList'>(
    'bucketList',
  );

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setShowScrollToTop(currentScrollPos > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');

    if (tabParam === 'diary' || tabParam === 'bucketList') {
      setFeedType(tabParam);
    }
  }, [location]);

  const handleTabClick = (type: 'diary' | 'bucketList') => {
    setFeedType(type);
    navigate({ search: `?tab=${type}` });
  };

  return (
    <Background>
      <Container>
        <FeedTab>
          <Tab
            isSelected={feedType === 'bucketList'}
            onClick={() => handleTabClick('bucketList')}
          >
            버킷리스트
          </Tab>
          <Tab
            isSelected={feedType === 'diary'}
            onClick={() => handleTabClick('diary')}
          >
            다이어리
          </Tab>
        </FeedTab>
        {feedType === 'diary' ? <DiaryFeed /> : <BucketFeed />}
      </Container>
      {showScrollToTop && <TopButton scrollToTop={scrollToTop} />}
    </Background>
  );
}

export default Feed;
