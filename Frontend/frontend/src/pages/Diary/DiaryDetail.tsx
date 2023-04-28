import React, { useState, useEffect } from 'react';
import axios from 'axios';
import requests from '../../api/config';
import { useParams } from 'react-router-dom';

interface Comment {
  commentId: bigint;
  content: string;
  nickname: string;
  created: string;
  updated: string;
}

interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  created: string;
  updated: string;
  nickname: string;
}

function DiaryDetail() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [diaryDetail, setDiaryDetail] = useState<Diary | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        const response = await axios.get(
          `${requests.base_url}/diary/${diaryId}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          setDiaryDetail(response.data.diary);
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDiaryDetail();
  }, [diaryId]);

  if (!diaryDetail) {
    return <div>Loading...</div>;
  }

  const diary = diaryDetail;

  return (
    <div>
      <h2>{diary.title}</h2>
      <div>{diary.nickname}</div>
      {diary.imageUrl && diary.imageUrl !== '""' && (
        <img src={diary.imageUrl} alt="Diary" />
      )}
      <div>{diary.content}</div>
      <CommentForm diaryId={diary.diaryId} />
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}

function CommentForm({ diaryId }: { diaryId: number }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${requests.base_url}/diary/${diaryId}/comment`,
        { content },
        { withCredentials: true },
      );
      if (response.status === 201) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function Comment({ comment }: { comment: Comment }) {
  return (
    <div>
      <p>{comment.nickname}</p>
      <p>{comment.content}</p>
      <p>{comment.created}</p>
    </div>
  );
}

export default DiaryDetail;
