import React, { useState, useEffect } from 'react';
import axios from 'axios';
import requests from '../../api/config';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/diary_bg.png';
import TreeDot from '../../assets/icons/three_dot.svg';

interface Comment {
  commentId: bigint;
  content: string;
  nickname: string;
  created: string;
  updated: string;
}

interface Bucket {
  bucketId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  created: string;
  updated: string;
  nickname: string;
}

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  background-attachment: fixed;
`;

const Container = styled.div`
  ${tw`pt-12 pb-24`}
`;

const BucketWrap = styled.div`
  ${tw`mb-6 p-6 flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

const BucketHeader = styled.div`
  ${tw`flex`}
  justify-content: space-between;
`;

const DotIcon = styled.div`
  ${tw`flex`}
`;

const Nickname = styled.p`
  font-size: 15px;
`;

const BucketImg = styled.div`
  ${tw`mt-6 mb-6 flex flex-col mx-auto`}
  width: 100%;
`;

const BucketText = styled.div`
  ${tw`flex flex-col mx-auto`}
  width: 100%;
  font-size: 15px;
`;

const CommentWrap = styled.div`
  ${tw`mb-6 flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  border-radius: 10px;
  color: white;
  // border: solid 1px white;
`;

const CommentBox = styled.div`
  ${tw`mb-2 p-6 flex`}
  color: black;
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

const StyledCommentForm = styled.form`
  ${tw`mb-6 flex mx-auto`}
  color: white;
`;

const StyledInput = styled.input`
  ${tw`flex-1 mr-2`}
  color: black;
`;

const StyledButton = styled.button`
  ${tw`bg-blue-500 text-white px-4 py-2 rounded`}
`;

function BucketDetail() {
  const { bucketId } = useParams<{ bucketId: string }>();
  const [bucketDetail, setBucketDetail] = useState<Bucket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchBucketDetail = async () => {
      try {
        const response = await axios.get(
          `${requests.base_url}/bucket/${bucketId}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          setBucketDetail(response.data.bucket);
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBucketDetail();
  }, [bucketId]);

  if (!bucketDetail) {
    return <div>Loading...</div>;
  }

  const bucket = bucketDetail;

  return (
    <Background>
      <Container>
        <BucketWrap>
          <BucketHeader>
            <div>
              <h2 className="text-h3">{bucket.title}</h2>
              <Nickname>{bucket.nickname}</Nickname>
            </div>
            <DotIcon>
              <img src={TreeDot} alt="" />
            </DotIcon>
          </BucketHeader>
          <BucketImg>
            {bucket.imageUrl && bucket.imageUrl !== '""' && (
              <img src={bucket.imageUrl} alt="Bucket" />
            )}
          </BucketImg>
          <BucketText>{bucket.content}</BucketText>
        </BucketWrap>
        <CommentWrap>
          <CommentForm bucketId={bucket.bucketId} />
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
        </CommentWrap>
      </Container>
    </Background>
  );
}

function CommentForm({ bucketId }: { bucketId: number }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${requests.base_url}/board/comment`, // 수정된 API 엔드포인트
        {
          content,
          type: true, // type을 true로 설정
          typeId: bucketId, // typeId를 bucketId로 설정
        },
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
    <StyledCommentForm onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <StyledButton type="submit">작성</StyledButton>
    </StyledCommentForm>
  );
}

function Comment({ comment }: { comment: Comment }) {
  return (
    <CommentBox>
      <b>{comment.nickname}</b>
      <p>{comment.content}</p>
      <p>{comment.created}</p>
    </CommentBox>
  );
}

export default BucketDetail;
