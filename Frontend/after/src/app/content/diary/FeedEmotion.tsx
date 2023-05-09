import styled from 'styled-components';
import tw from 'twin.macro';


export const Container = styled.div`
  ${tw`text-p1`}
`;

export const CardWrap = styled.div`
  ${tw`mb-4 p-4 bg-white shadow rounded`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

export const NickDateWrap = styled.div`
  ${tw`text-p2 flex justify-between mb-[8px]`}
`;

export const Title = styled.h3`
  ${tw` text-p1 font-bold mb-[8px]`}
`;

export const Content = styled.p`
  ${tw`text-p2`}
  width: 100%;
`;

export const Image = styled.img`
  ${tw`w-full mb-[8px]`}
  width: 70px;
`;

export const ContentImg = styled.div`
  ${tw`flex justify-between`}
`;

export const TitleContent = styled.div<{ hasImage: boolean }>`
  ${tw`flex flex-col text-smT`}
  text-align: start;
  justify-content: center;
  width: ${(props) => (props.hasImage ? '70%' : '100%')};
  //   border: solid 1px white;
`;

// export const TitleContent = styled.div<{ hasImage: boolean }>`
//   flex: 1;
//   width: ${(props) => (props.hasImage ? '50%' : '100%')};
// `;

export const Meta = styled.div`
  ${tw`text-smT mt-2`}
  text-align: end;
`;

export const Nickname = styled.span`
  ${tw`text-smT`}
`;

export const Comments = styled.span`
  ${tw`text-smT`}
`;

export const DateWrap = styled.span`
  ${tw`text-smT text-gray-500`}
`;
