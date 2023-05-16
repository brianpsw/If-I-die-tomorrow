import styled from 'styled-components';
import tw from 'twin.macro';

export const Container = styled.div`
  ${tw`px-[24px] pt-[80px] md:pt-[100px]`}
`;

export const PhotoWrapper = styled.div`
  ${tw`pb-[10px] flex flex-col ml-[60px]`}
`;

export const PhotoCardWrapper = styled.div`
  ${tw`lg:max-w-[30%] md:max-w-[40%] sm:max-w-[60%] w-[70%] my-4 mx-auto p-6 rounded-[10px] bg-[#f6f6f6b3] relative `}
  width: calc(100% - 48px);
`;

export const PhotoStyle = styled.img`
  ${tw`w-full object-contain mb-6 rounded-[10px]`}
`;
