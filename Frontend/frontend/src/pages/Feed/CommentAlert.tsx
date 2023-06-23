import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

const Container = styled.div`
  ${tw`text-p3`}
`;

const CommentList = styled.ul`
  ${tw`mt-5`}
`;

const CommentListItem = styled.li`
  ${tw`mb-2`}
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
      <CommentList>
        {comments.map((comment) => (
          <CommentListItem key={comment.commentId}>
            {comment.nickname}님이 회원님의 게시물에 댓글을 남겼습니다:{' '}
            {comment.content}
          </CommentListItem>
        ))}
      </CommentList>
    </Container>
  );
}

export default CommentAlert;
