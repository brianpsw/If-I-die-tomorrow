import React, { useState, useEffect } from 'react';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/diary_bg.png';
import TreeDot from '../../assets/icons/three_dot.svg';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import EditBucketModal from '../../components/common/EditBucketModal';

interface Comment {
  commentId: bigint;
  content: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

interface Bucket {
  bucketId: number;
  title: string;
  content: string;
  imageUrl: string;
  complete: boolean;
  secret: boolean;
  createdAt: string;
  updatedAt: string;
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
  // color: white;
  // border: solid 1px white;
`;

const CommentBox = styled.div`
  ${tw`mb-2 p-6 flex`}
  justify-content: space-between;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      // 확인/취소 버튼이 있는 모달을 띄움
      if (bucketId) {
        deleteBucket(parseInt(bucketId));
      } else {
        console.error('Bucket ID is undefined');
      }
    }
  };

  const deleteBucket = async (bucketId: number) => {
    try {
      await defaultApi.delete(requests.DELETE_BUCKET(bucketId), {
        withCredentials: true,
      });
      navigate('/feed?tab=bucket'); // 피드 페이지로 이동
      setBucketDetail(null); // 상태를 업데이트하여 게시물이 화면에서 사라지도록 함
      setComments([]); // 댓글도 함께 초기화
      alert('다이어리가 삭제되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (updatedBucket: Bucket) => {
    setBucketDetail(updatedBucket);
    setUpdatePhoto(true);
  };

  const fetchBucketDetail = async () => {
    try {
      const response = await defaultApi.get(requests.GET_BUCKET(bucketId), {
        withCredentials: true,
      });
      if (response.status === 200) {
        setBucketDetail(response.data.bucket);
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBucketDetail();
  }, [bucketId]);

  if (!bucketDetail) {
    return <div>Loading...</div>;
  }

  const bucket = bucketDetail;

  return (
    <div>
      {modalOpen && (
        <EditOrDeleteModal
          onClose={handleModalClose}
          handleBucketEditModalOpen={handleEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      )}
      {editModalOpen && bucketDetail && (
        <EditBucketModal
          bucketId={bucketDetail.bucketId}
          title={bucketDetail.title}
          content={bucketDetail.content}
          secret={bucketDetail.secret}
          complete={bucketDetail.complete}
          onClose={handleEditModalClose}
          onUpdate={handleUpdate}
        />
      )}
      <Background>
        <Container>
          <BucketWrap>
            <BucketHeader>
              <div>
                <h2 className="text-h3">{bucket.title}</h2>
                <Nickname>{bucket.nickname}</Nickname>
                <div>
                  {new Date(bucket.createdAt).toISOString().split('T')[0]}
                </div>
              </div>
              <DotIcon>
                <img src={TreeDot} alt="" onClick={handleModalOpen} />
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
              <Comment
                key={index}
                comment={comment}
                onUpdate={() => fetchBucketDetail()}
              />
            ))}
          </CommentWrap>
        </Container>
      </Background>
    </div>
  );
}

function CommentForm({ bucketId }: { bucketId: number }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await defaultApi.post(
        requests.POST_COMMENT(), // 수정된 API 엔드포인트
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

function Comment({
  comment,
  onUpdate,
}: {
  comment: Comment;
  onUpdate: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false); // 추가: 댓글 수정 상태
  // const [editedContent, setEditedContent] = useState(comment.content); // 추가: 수정된 댓글 내용
  const [content, setContent] = useState(comment.content);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleBucketEditModalOpen = () => {
    setEditing(true); // 추가: 댓글 수정 모드 활성화
    handleModalClose(); // 추가: 수정/삭제 모달 닫기
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleCancel = () => {
    setEditing(false);
    setContent(comment.content); // 원래 댓글 내용으로 되돌립니다.
  };

  const handleDeleteModalOpen = () => {
    deleteComment(comment.commentId);
    handleModalClose();
  };

  const deleteComment = async (commentId: bigint) => {
    try {
      const response = await defaultApi.delete(
        requests.DELETE_COMMENT(commentId),
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        onUpdate(); // 댓글 목록을 업데이트하도록 함수 호출
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateComment = async (commentId: bigint, content: string) => {
    try {
      const response = await defaultApi.put(
        requests.PUT_COMMENT(),
        {
          commentId,
          content,
        },
        { withCredentials: true },
      );
      if (response.status === 200) {
        setEditing(false);
        setContent(content);
        onUpdate(); // 댓글 목록을 업데이트하도록 함수 호출
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 동작을 취소합니다.
    updateComment(comment.commentId, content);
  };

  return (
    <div>
      {modalOpen && (
        <EditOrDeleteModal
          onClose={handleModalClose}
          handleBucketEditModalOpen={handleBucketEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      )}
      <CommentBox>
        <div>
          <b>{comment.nickname}</b>
          <div>{new Date(comment.createdAt).toISOString().split('T')[0]}</div>
        </div>
        <div>
          {editing ? (
            <form onSubmit={handleEditSubmit}>
              <input type="text" value={content} onChange={handleChange} />
              <button type="submit">수정</button>
              <button type="button" onClick={handleCancel}>
                취소
              </button>
            </form>
          ) : (
            <p>{comment.content}</p>
          )}
        </div>
        <DotIcon>
          <img src={TreeDot} alt="" onClick={handleModalOpen} />
        </DotIcon>
      </CommentBox>
    </div>
  );
}

export default BucketDetail;
