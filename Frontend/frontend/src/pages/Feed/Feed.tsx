import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
// import backgroundImg from '../../assets/images/feed.png';
import DiaryFeed from '../../components/feed/DiaryFeed';
import BucketFeed from '../../components/feed/BucketFeed';
import { useNavigate, useLocation } from 'react-router-dom';
import TopButton from '../../components/common/ScrollToTopButton';
import textLogoImg from '../../assets/images/text_logo.png';

// const Background = styled.div`
//   background-image: url(${backgroundImg});
//   background-size: cover;
//   background-position: center;
//   background-repeat: no-repeat;
//   min-height: 100vh;
//   width: 100%;
//   position: relative;
//   background-attachment: fixed;
// `;

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

const CommentAlert = styled.div`
  position: absolute;
  top: 45px;
  right: 24px;
`;

const Container = styled.div`
  ${tw`flex flex-col mx-auto pt-48`}
  max-width: calc(100% - 48px);
  text-align: center;
  justify-content: center;
  padding-bottom: 70px;
`;

const FeedTab = styled.p`
  ${tw`flex`}
  justify-content: space-evenly;
  color: white;
  text-shadow: 4px 4px 4px #111111;
  // font-size: 16px;
`;

const Tab = styled.span<{ isSelected: boolean }>`
  ${tw`text-p1 cursor-pointer mb-12 inline-block pb-1`}
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
      <Link to="/newcomment">
        <CommentAlert>
          <svg
            width="24"
            height="28"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 19H11C11 20.1 10.1 21 9 21C7.9 21 7 20.1 7 19ZM18 17V18H0V17L2 15V9C2 5.9 4 3.2 7 2.3V2C7 0.9 7.9 0 9 0C10.1 0 11 0.9 11 2V2.3C14 3.2 16 5.9 16 9V15L18 17ZM14 9C14 6.2 11.8 4 9 4C6.2 4 4 6.2 4 9V16H14V9Z"
              fill="white"
            />
          </svg>
        </CommentAlert>
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
