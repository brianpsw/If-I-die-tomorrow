import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';
import textLogoImg from '../../assets/images/text_logo.png';

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

export const Logo = styled.div`
  background-image: url(${textLogoImg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 120px;
  min-height: 60px;
  position: absolute;
  top: 36px;
  left: 24px;
`;

export const BtModal = styled.div`
  ${tw`flex items-center justify-between border-b w-full `}
`;

export const Container = styled.div`
  ${tw`text-p2 flex flex-col mx-auto pt-36`}
  max-width: calc(100% - 48px);
  padding-bottom: 15%;
  // border: solid 1px white;
`;

export const HeadText = styled.h1`
  text-align: center;
  color: white;
`;

export const FillingText = styled.h4`
  ${tw`text-white`}
  text-shadow: 4px 4px 4px #111111;
`;

export const MyProfile = styled.div`
  ${tw`mt-12`}
  color: white;
`;

export const SettingBox = styled.div`
  ${tw`mb-4 mt-6 p-4 bg-white shadow rounded`}
  background-color: rgba(246, 246, 246, 0.7);
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  // border: solid 2px #9e9e9e;
  border-radius: 10px;
  color: black;
  // width: 342px;
  // height: auto;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
`;

export const WillServiceWrap = styled.div`
  color: black;
  // width: 342px;
  // height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WillContent = styled.div`
  ${tw`mb-4 mt-6 p-4 bg-white shadow rounded`}
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  background-color: rgba(246, 246, 246, 0.7);
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
  // border: solid 2px #9e9e9e;
  border-radius: 10px;
  color: black;
  width: 43vw;
  height: auto;
`;

export const RadioContainer = styled.div`
  ${tw`mt-4`}
  display: flex;
  margin-top: 8px;
`;

export const RadioButtonLabel = styled.label`
  ${tw`mb-6 mr-6 text-p3`}
  display: flex;
  align-items: center;
  color: #000;
`;

export const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-left: 8px;
`;

export const InputRow = styled.div`
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: 3%;

  input {
    margin-bottom: 8px;
    border-radius: 5px;
    height: 2.5rem;
    padding: 3px;
  }

  input:nth-child(1) {
    width: 25%;
  }

  input:nth-child(2) {
    width: 63%;
  }
`;

export const Receiver = styled.div`
  ${tw`mb-6 flex justify-between`}
  align-items: center;
  // border: 1px solid;
`;

export const StyledButton = styled(Button)`
  margin: 0 auto;
`;

export const IconWithText = styled.div`
  display: flex;
  align-items: center;
  // margin-bottom: 8px;
  margin-top: 4px;
  // font-size: 14px;
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
  font-size: 30px;
`;

export const ReceiverTextWrap = styled.div`
  ${tw`flex text-p2`}
  width: 80%;
  // justify-content: space-around;
  // border: solid 1px;
`;
export const NameText = styled.p`
  ${tw`mr-20 ml-2`}
  width: 40%;
`;
export const PhoneText = styled.p`
  ${tw`flex`}
  width: 60%;
  align-items: center;
`;
