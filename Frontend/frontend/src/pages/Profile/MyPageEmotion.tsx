import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';

export const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-attachment: fixed;
`;

const BtModal = styled.div`
  ${tw`flex items-center justify-between border-b w-full `}
`;

export const Container = styled.div`
  ${tw`flex flex-col mx-auto pb-12`}
  max-width: calc(100% - 48px);
  // border: solid 1px white;
`;

export const HeadText = styled.h1`
  text-align: center;
  color: white;
`;

export const MyProfile = styled.div`
  ${tw`mb-6 mt-12`}
  color: white;
`;

export const SettingBox = styled.div`
  ${tw`mb-12 mt-6 p-6`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  width: 342px;
  height: auto;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
`;

export const RadioContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

export const RadioButtonLabel = styled.label`
  ${tw`mb-6 mr-6`}
  display: flex;
  align-items: center;
  color: #000;
`;

export const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-left: 8px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  input {
    margin-bottom: 8px;
    border-radius: 5px;
    height: 30px;
    padding: 3px;
  }
`;

export const Receiver = styled.div`
  ${tw`mb-6 flex justify-between`}
`;

export const StyledButton = styled(Button)`
  margin: 0 auto;
`;

export const IconWithText = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 4px;
  font-size: 14px;
  svg {
    margin-right: 8px;
    margin-left: 8px;
  }
`;

export const IconContainer = styled.div`
  ${tw`mb-6`}
  display: flex;
  justify-content: center;
  align-items: center;
`;
