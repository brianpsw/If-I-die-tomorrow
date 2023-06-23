import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

const Container = styled.div`
  ${tw`text-p1`}
  padding-bottom: 20%;
`;

const NewCommentWrap = styled.div`
  ${tw`mt-10`}
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

async function fetchCommentNotifications() {
  try {
    const response = await defaultApi.get(requests.GET_NEW_COMMENT(), {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const comments = response.data.data;
    return comments;
  } catch (error) {
    console.error('Failed to fetch comment notifications:', error);
    return [];
  }
}

function CommentAlert() {
  const [comments, setComments] = useState<CommentNotification[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchCommentNotifications();
      setComments(fetchedComments);
    };

    loadComments();
  }, []);

  return (
    <Container>
      <TopBar title="알림" />
      <NewCommentWrap>
        {comments.map((comment) => (
          <Link
            to={
              comment.type
                ? `/diary/${comment.typeId}`
                : `/bucket/${comment.typeId}`
            }
            key={comment.commentId}
          >
            <CardWrap key={comment.commentId}>
              <b>{comment.nickname}</b>님이 회원님의 게시물에 댓글을 남겼습니다:
              <br />
              {comment.content}
            </CardWrap>
          </Link>
        ))}
      </NewCommentWrap>
    </Container>
  );
}

export default CommentAlert;
