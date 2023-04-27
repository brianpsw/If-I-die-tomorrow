import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';

export const Container = styled.div``;

export const CardWrap = styled.div`
  ${tw`mb-4 p-4 bg-white shadow rounded`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
`;

export const NickDateWrap = styled.div`
  ${tw`flex justify-between mb-2`}
`;

export const Title = styled.h3`
  ${tw`text-lg font-bold mb-2`}
`;

export const Content = styled.p`
  ${tw`text-sm`}
`;

export const Image = styled.img`
  ${tw`w-full mb-2`}
  width: 100px;
`;

export const ContentImg = styled.div`
  ${tw`flex justify-between`}
`;

export const TitleContent = styled.div`
  ${tw`flex flex-col`}
  text-align: start;
  justify-content: center;
`;

export const Meta = styled.div`
  ${tw`text-xs mt-2`}
  text-align: end;
`;

export const Nickname = styled.span`
  ${tw`font-medium`}
`;

export const Comments = styled.span``;

export const Date = styled.span`
  ${tw`text-gray-500`}
`;
