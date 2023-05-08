import React, { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Button from '../../components/common/Button';

const Container = styled.div`
  ${tw`flex flex-col justify-center items-center p-[16px] m-[24px] bg-gray-100/80`}
`;
const WillContentInputContainer = styled.textarea`
  ${tw`flex flex-wrap w-full h-[500px] text-p1 rounded border-black break-all mb-[16px]`}
`;
function WillText(): JSX.Element {
  const [content, setContent] = useState('');
  const [defaultContent, setDefaultContent] = useState('');
  const [isValid, setIsValid] = useState<Boolean>(false);
  const patch_will_text = async () => {
    try {
      const response = await defaultApi.patch(
        requests.PATCH_WILL_TEXT(),
        {
          content,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response);
    } catch (error) {
      throw error;
    }
  };
  const get_will = async () => {
    try {
      const response = await defaultApi.get(requests.GET_WILL(), {
        withCredentials: true,
      });

      setContent(response.data.content);
      setDefaultContent(response.data.content);

      console.log(response);
    } catch (error) {
      throw error;
    }
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };
  const handleSubmit = () => {
    patch_will_text();
  };
  useEffect(() => {
    get_will();
  }, []);
  useEffect(() => {
    if (content !== defaultContent) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [content, defaultContent]);
  return (
    <div>
      <TopBar title="유언장 작성" />
      <Container>
        <WillContentInputContainer
          onChange={handleContentChange}
          value={content}
          placeholder="가족, 지인들에게 남기고 싶은 말을 적어주세요."
        />
        <div className="flex w-full justify-center my-4">
          <Button
            onClick={handleSubmit}
            color={isValid ? '#0E848A' : '#B3E9EB'}
            size="sm"
            disabled={isValid ? false : true}
          >
            작성완료
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default WillText;
