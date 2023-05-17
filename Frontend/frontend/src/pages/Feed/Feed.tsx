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
import textLogoImg from '../../assets/images/text_logo.png';

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-attachment: fixed;
`;

const Logo = styled.div`
  background-image: url(${textLogoImg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 120px;
  min-height: 60px;
  position: absolute;
  top: 36px;
  left: 24px;
`;

const Container = styled.div`
  ${tw`flex flex-col mx-auto pt-48`}
  max-width: calc(100% - 48px);
  text-align: center;
  justify-content: center;
  padding-bottom: 70px;
`;

const FeedTab = styled.p`
  ${tw`flex text-p1`}
  justify-content: space-evenly;
  color: white;
  // font-size: 16px;
`;

const Tab = styled.span<{ isSelected: boolean }>`
  ${tw`cursor-pointer mb-12 inline-block pb-1`}
  ${({ isSelected }) => (isSelected ? tw`font-bold border-b-4` : null)}
  ${({ isSelected }) => (isSelected ? { borderColor: '#FFA9A9' } : null)}
  width: 110px;
  white-space: nowrap;
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
    <div>
      <Link to="/home">
        <Logo />
      </Link>
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
    </div>
  );
}

export default Feed;
