import React, { useState, useEffect, useRef } from 'react';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/bucket_bg.png';
import Swal from 'sweetalert2';
import TreeDot from '../../assets/icons/three_dot.svg';
import EditOrDeleteModal from '../../components/common/EditOrDeleteModal';
import EditBucketModal from '../../components/common/EditBucketModal';
import DeleteConfirmModal from '../../components/bucket/BucketDeleteModal';
import ReportModal from '../../components/common/bucketReportModal';
import CommentConfirmModal from '../../components/common/CommentConfirmModal';
import TopBar from '../../components/common/TopBar';
import { FaUnlock, FaLock } from 'react-icons/fa';

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
  position: relative;
`;

const BucketHeader = styled.div`
  ${tw`flex`}// justify-content: space-between;
`;

const DotIcon = styled.div`
  ${tw`flex`}
  position: absolute;
  right: 5%;
  top: 7%;
`;

const CommentDotIcon = styled.div`
  ${tw`flex`}
  position: absolute;
  right: 5%;
  top: 40%;
`;

const ContentTitle = styled.div`
  ${tw``}
  width: 100%;
  word-break: break-all;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

const Nickname = styled.p`
  ${tw`text-p3`}
`;

const CreateDate = styled.p`
  ${tw`text-p3`}
`;

const BucketImg = styled.div`
  ${tw`mt-2 mb-6 flex flex-col mx-auto`}
  width: 100%;
`;

const SecretOrNotText = styled.p`
  ${tw`text-p1`}
  display: inline-block;
  width: content;
  border-radius: 10px;
  // border: 1px solid black;
  // background-color: #ffa9a9;
  font-weight: 400;
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

const CommentLine = styled.p`
  ${tw`mb-6 mt-6 text-h3`}
  color: white;
`;

const CommentBox = styled.div`
  ${tw`mb-2 p-6 flex`}
  justify-content: space-between;
  color: black;
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  position: relative;
`;

const StyledCommentForm = styled.form`
  ${tw`text-p1 mb-6 flex w-full mx-auto`}
  color: white;
  position: relative;
  // border: solid 1px red;
  height: 40px;
`;

const StyledInput = styled.input`
  ${tw``}
  // padding-right: 50px;
  padding-left: 2%;
  // font-size: 1.5rem;
  width: 100%;
  color: black;
  border-radius: 10px;
`;

const StyledButton = styled.button`
  ${tw`px-4 py-2 rounded flex`}
  justify-content: center;
  background-color: white;
  align-items: center;
  position: absolute;
  border-radius: 10px;
  // font-size: 1.5rem;
  font-weight: bold;
  color: gray;
  height: 100%;
  width: 50px;
  right: 0;
  white-space: nowrap;
  // border: solid 1px black;
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
  ${tw`text-p3`}
  max-width: 90%;
  word-break: break-word;
`;

const EditContentForm = styled.form`
  ${tw`flex flex-col text-p3`}
  align-items: flex-end;
  width: 73vw;
`;

const EditContentInput = styled.textarea`
  ${tw`text-smT p-1`}
  width: 100%;
  // font-size: 15px;
  height: auto;
  border-radius: 5px;
`;

const EditButton = styled.button`
  ${tw`ml-2`}
  font-size: 14px;
`;

function BucketDetail() {
  const { bucketId } = useParams<{ bucketId: string }>();
  const [bucketDetail, setBucketDetail] = useState<Bucket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [updatePhoto, setUpdatePhoto] = useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const user = useRecoilValue(userState);
  const loggedInUserNickname = user ? user.nickname : null;
  const navigate = useNavigate();

  const handleModalClose = () => {
    setModalOpen(false);
    setReportModalOpen(false);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleReportModalOpen = () => {
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
    handleModalClose();
  };

  const handleModalOpen = () => {
    if (loggedInUserNickname === bucket.nickname) {
      setModalOpen(true);
    } else {
      setReportModalOpen(true);
    }
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    handleModalClose();
  };

  const openDeleteConfirmModal = () => {
    setDeleteConfirmModalOpen(true);
    handleModalClose();
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModalOpen(false);
  };

  const handleDelete = async () => {
    if (typeof bucketId === 'undefined') {
      console.error('Bucket ID is undefined');
      return;
    }

    try {
      await defaultApi.delete(requests.DELETE_BUCKET(parseInt(bucketId)), {
        withCredentials: true,
      });
      navigate(-1);
      setBucketDetail(null);
      setComments([]);
      Swal.fire({
        title: '버킷리스트 삭제 성공!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: '버킷리스트 삭제 실패...',
        icon: 'error',
        confirmButtonText: '확인',
      });
      throw error;
    }
  };

  const handleUpdate = (updatedBucket: Bucket) => {
    setBucketDetail(updatedBucket);
    setUpdatePhoto(true);
    fetchBucketDetail();
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
          handleDeleteModalOpen={openDeleteConfirmModal}
        />
      )}
      {reportModalOpen && (
        <ReportModal
          handleReportModalOpen={handleReportModalOpen}
          onClose={handleReportModalClose}
          typeId={bucketDetail.bucketId}
        />
      )}
      {editModalOpen && bucketDetail && (
        <EditBucketModal
          bucketId={bucketDetail.bucketId}
          title={bucketDetail.title}
          content={bucketDetail.content}
          secret={bucketDetail.secret}
          complete={bucketDetail.complete}
          image={bucketDetail.imageUrl}
          onClose={handleEditModalClose}
          onUpdate={handleUpdate}
        />
      )}
      {deleteConfirmModalOpen && (
        <DeleteConfirmModal
          onClose={closeDeleteConfirmModal}
          onDelete={handleDelete}
        />
      )}
      <Background>
        <TopBar title="버킷리스트" />
        <Container>
          <BucketWrap>
            <BucketHeader>
              <div>
                <SecretOrNotText>
                  {bucket.secret ? <FaLock /> : <FaUnlock />}
                </SecretOrNotText>
                <ContentTitle className="text-h3">{bucket.title}</ContentTitle>
                <Nickname>{bucket.nickname}</Nickname>

                <CreateDate>
                  {new Date(bucket.createdAt).toISOString().split('T')[0]}
                </CreateDate>
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
            <CommentLine>댓글</CommentLine>
            <CommentForm
              bucketId={bucket.bucketId}
              type={false}
              onUpdate={() => fetchBucketDetail()}
            />
            {comments &&
              comments.map((comment, index) => (
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

function CommentForm({
  bucketId,
  type,
  onUpdate,
}: {
  bucketId: number;
  type: boolean;
  onUpdate: () => void;
}) {
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
          type, // type을 true로 설정
          typeId: bucketId, // typeId를 bucketId로 설정
        },
        { withCredentials: true },
      );
      if (response.status === 201) {
        // window.location.reload();
        setContent(''); // 입력란을 초기화합니다.
        onUpdate(); // 댓글이 추가되었음을 상위 컴포넌트에 알립니다.
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
        placeholder="댓글을 입력하세요"
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const user = useRecoilValue(userState);
  const loggedInUserNickname = user ? user.nickname : null;

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
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
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
    if (content.trim().length === 0) {
      alert('댓글 내용이 없습니다. 내용을 입력해주세요.');
      return;
    }
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
      {deleteModalOpen && (
        <CommentConfirmModal
          onClose={handleDeleteModalClose}
          onDelete={() => deleteComment(comment.commentId)}
        />
      )}
      <CommentBox>
        <div className="w-full">
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
        {loggedInUserNickname === comment.nickname && (
          <CommentDotIcon>
            <img src={TreeDot} alt="" onClick={handleModalOpen} />
          </CommentDotIcon>
        )}
      </CommentBox>
    </div>
  );
}

export default BucketDetail;
