import styled from 'styled-components';
import tw from 'twin.macro';

export const PhotoWrapper = styled.div`
  ${tw`pb-[10px] mb-[70px]`}
`;

export const PhotoCardWrapper = styled.div`
  ${tw`md:max-w-[40%] sm:max-w-[60%] my-4 mx-auto p-6 rounded-[10px] bg-[#f6f6f6b3] shadow relative`}
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  width: calc(100% - 48px);
`;

export const Photo = styled.img`
  ${tw`w-full object-contain mb-6 rounded-[10px]`}
`;

export const Video = styled.video`
  ${tw`w-full object-contain mb-6 rounded-[10px]`}
`;

export const CategoryWrapper = styled.div`
  ${tw`flex px-[24px] py-[16px] overflow-x-auto`}
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
