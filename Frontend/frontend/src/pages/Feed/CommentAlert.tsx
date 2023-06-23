import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

const Container = styled.div`
  ${tw``}
  padding-bottom: 20%;
`;

const NewCommentWrap = styled.div`
  ${tw`mt-10 text-p1`}
`;

const CardWrap = styled.div`
  ${tw`mb-6 p-8 bg-white mx-auto shadow rounded`}
  background-color: rgba(246, 246, 246, 0.7);
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  // border: solid 1px #9e9e9e;
  border-radius: 10px;
  box-sizing: border-box;
  max-width: calc(100% - 48px);
`;

interface CommentNotification {
  commentId: number;
  content: string;
  nickname: string;
  type: boolean;
  typeId: number;
  createdAt: string;
  updatedAt: string;
}

async function fetchCommentNotifications(page: number) {
  try {
    const response = await defaultApi.get(
      `${requests.GET_NEW_COMMENT()}?page=${page}&size=10`,
      {
        withCredentials: true,
      },
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const comments = response.data.data;
    const hasNext = response.data.hasNext;
    return { comments, hasNext };
  } catch (error) {
    console.error('Failed to fetch comment notifications:', error);
    return { comments: [], hasNext: false };
  }
}

function CommentAlert() {
  const [comments, setComments] = useState<CommentNotification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);

  useEffect(() => {
    const loadComments = async () => {
      const result = await fetchCommentNotifications(page);
      setComments(result.comments);
      setHasNext(result.hasNext);
    };

    loadComments();
  }, []);

  const fetchMoreData = async () => {
    if (!hasNext) return;
    const nextPage = page + 1;
    console.log('Previous comments:', comments);
    const result = await fetchCommentNotifications(nextPage);
    setComments((prevComments) => [...prevComments, ...result.comments]);
    setHasNext(result.hasNext);
    setPage(nextPage);
    console.log('fetchMoreData called, page:', nextPage);
  };

  console.log('Rendering comments:', comments);
  return (
    <Container>
      <TopBar title="알림" />
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchMoreData}
        hasMore={hasNext}
        loader={<h4>Loading...</h4>}
      >
        <NewCommentWrap>
          {comments.map((comment, index) => (
            <Link
              to={
                comment.type
                  ? `/diary/${comment.typeId}`
                  : `/bucket/${comment.typeId}`
              }
              key={`${comment.commentId}-${index}`}
            >
              <CardWrap>
                <b>{comment.nickname}</b>님이 회원님의 게시물에 댓글을
                남겼습니다:
                <br />
                {comment.content}
              </CardWrap>
            </Link>
          ))}
        </NewCommentWrap>
      </InfiniteScroll>
    </Container>
  );
}

export default CommentAlert;
