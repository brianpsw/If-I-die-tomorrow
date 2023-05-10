import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/diary_bg.png';
import TopBar from '../../components/common/TopBar';
import { userDataState } from '../../states/UserDataState';

interface Bucket {
  bucketId: number;
  nickname: string;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
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
  top: 18%;
`;

const CommentDotIcon = styled.div`
  ${tw`flex`}
  position: absolute;
  right: 5%;
  top: 40%;
`;

const ContentTitle = styled.div`
  ${tw``}
  width: 280px;
  word-break: break-all;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

const Nickname = styled.p`
  font-size: 15px;
`;

const CreateDate = styled.div`
  font-size: 12px;
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
  position: relative;
`;

const StyledCommentForm = styled.form`
  ${tw`mb-6 flex mx-auto w-full`}
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

function BucketDetail() {
  const { bucketId } = useParams<{ bucketId: string }>();
  const userData = useRecoilValue(userDataState);

  let bucket: Bucket = {} as Bucket;
  const data = userData.buckets;
  data.forEach((item) => {
    if (item.bucketId == (bucketId as unknown as number)) {
      bucket = item;
    }
  });

  if (!bucket) {
    return <div>Loading...</div>;
  }
  return (
    <Background>
      <TopBar title="" />
      <Container>
        <BucketWrap>
          <BucketHeader>
            <div>
              <ContentTitle className="text-h3">{bucket.title}</ContentTitle>
              <Nickname>{bucket.nickname}</Nickname>
              <CreateDate>
                {new Date(bucket.createdAt).toISOString().split('T')[0]}
              </CreateDate>
            </div>
          </BucketHeader>
          <BucketImg>
            {bucket.imageUrl && bucket.imageUrl !== '""' && (
              <img src={bucket.imageUrl} alt="Bucket" />
            )}
          </BucketImg>
          <BucketText>{bucket.content}</BucketText>
        </BucketWrap>
      </Container>
    </Background>
  );
}

export default BucketDetail;
