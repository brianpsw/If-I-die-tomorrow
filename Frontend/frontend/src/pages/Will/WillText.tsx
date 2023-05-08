import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[86px] text-p1 rounded border-black break-all my-[16px]`}
`;
function WillText(): JSX.Element {
  const [willContent, setWillContent] = useState('');
  const [isGotData, setIsGotData] = useState<Boolean>(false);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWillContent(e.currentTarget.value);
  };
  const get_will = async () => {
    try {
      const response = await defaultApi.get(requests.GET_WILL(), {
        withCredentials: true,
      });
      if (response.data.content) {
        setWillContent(response.data.content);
        setIsGotData(true);
      }
      console.log(response.data.content);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    get_will();
  }, []);
  return (
    <div>
      <TopBar title="유언장 작성" />
      <Container>
        <WillContentInputContainer
          onChange={handleContentChange}
          value={willContent}
          placeholder="가족, 지인들에게 남기고 싶은 말을 적어주세요."
          disabled={isGotData ? true : false}
        />
      </Container>
    </div>
  );
}

export default WillText;
