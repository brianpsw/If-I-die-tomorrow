import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/diary_bg.png';
import TreeDot from '../../assets/icons/three_dot.svg';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import EditDiaryModal from '../../components/common/EditDiaryModal';

interface Comment {
  commentId: bigint;
  content: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
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

const DiaryWrap = styled.div`
  ${tw`mb-6 p-6 flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

const DiaryHeader = styled.div`
  ${tw`flex`}
  justify-content: space-between;
`;

const DotIcon = styled.div`
  ${tw`flex`}
`;

const Nickname = styled.p`
  font-size: 15px;
`;

const CreateDate = styled.div`
  font-size: 12px;
`;

const DiaryImg = styled.div`
  ${tw`mt-6 mb-6 flex flex-col mx-auto`}
  width: 100%;
`;

const DiaryText = styled.div`
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
  border-radius: 10px;
`;

const StyledButton = styled.button`
  ${tw`text-white px-4 py-2 rounded`}
`;

const CommentNick = styled.div`
  ${tw``}
  font-weight: bold;
  font-size: 14px;
`;

const CommentDate = styled.div`
  ${tw`mb-2`}
  font-size: 12px;
`;

const CommentContent = styled.div`
  ${tw``}
  width: 280px;
  font-size: 15px;
`;

const EditContentForm = styled.form`
  ${tw`flex flex-col`}
  align-items: flex-end;
`;

const EditContentInput = styled.textarea`
  ${tw`p-1`}
  width: 270px;
  font-size: 15px;
  height: auto;
  border-radius: 5px;
`;

const EditButton = styled.button`
  ${tw`ml-2`}
  font-size: 14px;
`;

function DiaryDetail() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [diaryDetail, setDiaryDetail] = useState<Diary | null>(null);
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
      if (diaryId) {
        deleteDiary(parseInt(diaryId));
      } else {
        console.error('Diary ID is undefined');
      }
    }
  };

  const deleteDiary = async (diaryId: number) => {
    try {
      await defaultApi.delete(requests.DELETE_DIARY(diaryId), {
        withCredentials: true,
      });
      navigate('/feed?tab=diary'); // 피드 페이지로 이동
      setDiaryDetail(null); // 상태를 업데이트하여 게시물이 화면에서 사라지도록 함
      setComments([]); // 댓글도 함께 초기화
      alert('다이어리가 삭제되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (updatedDiary: Diary) => {
    setDiaryDetail(updatedDiary);
    setUpdatePhoto(true);
  };

  const fetchDiaryDetail = async () => {
    try {
      const response = await defaultApi.get(requests.GET_DIARY(diaryId), {
        withCredentials: true,
      });
      if (response.status === 200) {
        setDiaryDetail(response.data.diary);
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDiaryDetail();
  }, [diaryId]);

  if (!diaryDetail) {
    return <div>Loading...</div>;
  }

  const diary = diaryDetail;

  return (
    <div>
      {modalOpen && (
        <EditOrDeleteModal
          onClose={handleModalClose}
          handleBucketEditModalOpen={handleEditModalOpen}
          handleDeleteModalOpen={handleDeleteModalOpen}
        />
      )}
      {editModalOpen && diaryDetail && (
        <EditDiaryModal
          diaryId={diaryDetail.diaryId}
          title={diaryDetail.title}
          content={diaryDetail.content}
          secret={diaryDetail.secret}
          onClose={handleEditModalClose}
          onUpdate={handleUpdate}
        />
      )}
      <Background>
        <Container>
          <DiaryWrap>
            <DiaryHeader>
              <div>
                <h2 className="text-h3">{diary.title}</h2>
                <Nickname>{diary.nickname}</Nickname>
                <CreateDate>
                  {new Date(diary.createdAt).toISOString().split('T')[0]}
                </CreateDate>
              </div>
              <DotIcon>
                <img src={TreeDot} alt="" onClick={handleModalOpen} />
              </DotIcon>
            </DiaryHeader>
            <DiaryImg>
              {diary.imageUrl && diary.imageUrl !== '""' && (
                <img src={diary.imageUrl} alt="Diary" />
              )}
            </DiaryImg>
            <DiaryText>{diary.content}</DiaryText>
          </DiaryWrap>
          <CommentWrap>
            <CommentForm diaryId={diary.diaryId} />
            {comments.map((comment, index) => (
              <Comment
                key={index}
                comment={comment}
                onUpdate={() => fetchDiaryDetail()}
              />
            ))}
          </CommentWrap>
        </Container>
      </Background>
    </div>
  );
}

function CommentForm({ diaryId }: { diaryId: number }) {
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length === 0) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    try {
      const response = await defaultApi.post(
        requests.POST_COMMENT(), // 수정된 API 엔드포인트
        {
          content,
          type: true, // type을 true로 설정
          typeId: diaryId, // typeId를 diaryId로 설정
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
        ref={inputRef}
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          <CommentNick>{comment.nickname}</CommentNick>
          <CommentDate>
            {new Date(comment.createdAt).toISOString().split('T')[0]}
          </CommentDate>

          {editing ? (
            <EditContentForm onSubmit={handleEditSubmit}>
              <EditContentInput value={content} onChange={handleChange} />
              <div>
                <EditButton type="submit">수정</EditButton>
                <EditButton type="button" onClick={handleCancel}>
                  취소
                </EditButton>
              </div>
            </EditContentForm>
          ) : (
            <CommentContent>{comment.content}</CommentContent>
          )}
        </div>
        <DotIcon>
          <img src={TreeDot} alt="" onClick={handleModalOpen} />
        </DotIcon>
      </CommentBox>
    </div>
  );
}

export default DiaryDetail;
