import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import tw from 'twin.macro';
import TopBar from '../../components/common/TopBar';
import { userDataState } from '../../states/UserDataState';
import AuthWrapper from '../../api/AuthWrapper';

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

const Container = styled.div`
  ${tw`pt-12 pb-24 px-[24px]`}
`;

const BucketWrap = styled.div`
  ${tw`mb-6 p-6 flex flex-col mx-auto w-full sm:w-4/6 md:w-3/6`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  position: relative;
`;

const BucketHeader = styled.div`
  ${tw`flex`};
`;

const ContentTitle = styled.div`
  ${tw`w-full`}
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

function BucketDetail() {
  const { bucketId } = useParams<{ bucketId: string }>();
  const userData = useRecoilValue(userDataState);

  if (Object.keys(userData).length === 0) {
    return <AuthWrapper></AuthWrapper>;
  }
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
    <AuthWrapper>
      <TopBar title="버킷리스트" />
      <Container>
        <BucketWrap>
          <BucketHeader>
            <div>
              <ContentTitle className="text-h3">{bucket.title}</ContentTitle>
              <Nickname>{bucket.nickname}</Nickname>
              <CreateDate>
                {new Date(bucket.createdAt).toLocaleDateString().split('T')[0]}
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
    </AuthWrapper>
  );
}

export default BucketDetail;
