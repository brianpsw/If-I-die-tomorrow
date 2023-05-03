import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';
import tw from 'twin.macro';

import diaryInactive from '../../assets/icons/diary_inactive.svg';
import diaryActive from '../../assets/icons/diary_active.svg';
import bucketInactive from '../../assets/icons/bucket_inactive.svg';
import bucketActive from '../../assets/icons/bucket_active.svg';
import homeInactive from '../../assets/icons/home_inactive.svg';
import homeActive from '../../assets/icons/home_active.svg';
import feedInactive from '../../assets/icons/feed_inactive.svg';
import feedActive from '../../assets/icons/feed_active.svg';
import mypageInactive from '../../assets/icons/mypage_inactive.svg';
import mypageActive from '../../assets/icons/mypage_active.svg';

import Button from './Button';
const Navbar = styled.div`
  ${tw`bg-gray_100 min-w-[390px] max-w-[390px]`}
  width: 100%;
  height: 70px;
  display: flex;
  padding: 9px 31px;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
`;
function NavBar() {
  const navigate = useNavigate();
  const [isDiary, setIsDiary] = useState<boolean>(false);
  const [isBucket, setIsBucket] = useState<boolean>(false);
  const [isHome, setIsHome] = useState<boolean>(true);
  const [isFeed, setIsFeed] = useState<boolean>(false);
  const [isMypage, setIsMypage] = useState<boolean>(false);
  const [changeNav, setChangeNav] = useState<boolean>(false);

  const handleDiary = () => {
    setIsDiary(true);
    setIsBucket(false);
    setIsHome(false);
    setIsFeed(false);
    setIsMypage(false);

    navigate(`/diary`);
  };

  const handleBucket = () => {
    setIsDiary(false);
    setIsBucket(true);
    setIsHome(false);
    setIsFeed(false);
    setIsMypage(false);

    navigate(`/bucket`);
  };

  const handleHome = () => {
    setIsDiary(false);
    setIsBucket(false);
    setIsHome(true);
    setIsFeed(false);
    setIsMypage(false);

    navigate(`/home`);
  };

  const handleFeed = () => {
    setIsDiary(false);
    setIsBucket(false);
    setIsHome(false);
    setIsFeed(true);
    setIsMypage(false);

    navigate(`/feed`);
  };

  const handleMypage = () => {
    setIsDiary(false);
    setIsBucket(false);
    setIsHome(false);
    setIsFeed(false);
    setIsMypage(true);

    navigate(`/mypage`);
  };

  const onlyMovePage = (page: string) => {
    if (page === 'diary') {
      navigate(`/diary`);
    } else if (page === 'bucket') {
      navigate(`/bucket`);
    } else if (page === 'home') {
      navigate(`/home`);
    } else if (page === 'feed') {
      navigate(`/feed`);
    } else {
      navigate(`/mypage`);
    }
  };

  return (
    <Navbar>
      {isDiary ? (
        <img
          src={diaryActive}
          alt="active diary button"
          width="36px"
          onClick={() => onlyMovePage('diary')}
        />
      ) : (
        <img
          src={diaryInactive}
          alt="inactive diary button"
          width="36px"
          onClick={handleDiary}
        />
      )}

      {isBucket ? (
        <img
          src={bucketActive}
          alt="active bucket button"
          width="36px"
          onClick={() => onlyMovePage('bucket')}
        />
      ) : (
        <img
          src={bucketInactive}
          alt="inactive bucket button"
          width="36px"
          onClick={handleBucket}
        />
      )}

      {isHome ? (
        <img
          src={homeActive}
          alt="active home button"
          width="36px"
          onClick={() => onlyMovePage('home')}
        />
      ) : (
        <img
          src={homeInactive}
          alt="inactive home button"
          width="36px"
          onClick={handleHome}
        />
      )}

      {isFeed ? (
        <img
          src={feedActive}
          alt="active feed button"
          width="36px"
          onClick={() => onlyMovePage('feed')}
        />
      ) : (
        <img
          src={feedInactive}
          alt="inactive feed button"
          width="36px"
          onClick={handleFeed}
        />
      )}

      {isMypage ? (
        <img
          src={mypageActive}
          alt="active mypage button"
          width="36px"
          onClick={() => onlyMovePage('mypage')}
        />
      ) : (
        <img
          src={mypageInactive}
          alt="inactive mypage button"
          width="36px"
          onClick={handleMypage}
        />
      )}
    </Navbar>
  );
}

export default NavBar;
