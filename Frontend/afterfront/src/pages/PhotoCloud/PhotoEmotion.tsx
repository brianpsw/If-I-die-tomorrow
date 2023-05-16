import styled from 'styled-components';
import tw from 'twin.macro';

export const Container = styled.div`
  ${tw`flex p-4 m-4`}
`;

export const PhotoWrapper = styled.div`
  ${tw`pb-[10px] flex flex-col`}
`;

export const PhotoCardWrapper = styled.div`
  ${tw`md:max-w-[40%] sm:max-w-[60%] my-4 mx-auto p-6 rounded-[10px] bg-[#f6f6f6b3] relative`}
  width: calc(100% - 48px);
`;

export const PhotoStyle = styled.img`
  ${tw`w-full object-contain mb-6 rounded-[10px]`}
`;
