import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import backgroundImg from '../../assets/images/mypage_bg.jpg';
import Button from '../../components/common/Button';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Background = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  ${tw`flex flex-col mx-auto`}
  max-width: calc(100% - 48px);
  // border: solid 1px white;
`;

const HeadText = styled.h1`
  text-align: center;
  color: white;
`;

const MyProfile = styled.div`
  ${tw`mb-6 mt-12`}
  color: white;
`;

const SettingBox = styled.div`
  ${tw`mb-12 mt-6 p-6`}
  background-color: rgba(246, 246, 246, 0.7);
  border-radius: 10px;
  width: 342px;
  height: 504px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
`;

const RadioContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const RadioButtonLabel = styled.label`
  ${tw`mb-6 mr-6`}
  display: flex;
  align-items: center;
  color: #000;
`;

const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-left: 8px;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const StyledButton = styled(Button)`
  margin: 0 auto;
`;

const IconWithText = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  svg {
    margin-right: 8px;
  }
`;

function MyPage() {
  const [consent, setConsent] = useState<string | null>(null);
  const handleConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.value);
  };
  const [receivers, setReceivers] = useState([
    { name: '', email: '', phone: '' },
  ]);
  const handleReceiverChange = (
    index: number,
    field: keyof { name: string; email: string; phone: string },
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newReceivers = [...receivers];
    newReceivers[index][field] = event.target.value;
    setReceivers(newReceivers);
  };

  const addReceiver = () => {
    if (receivers.length < 3) {
      setReceivers([...receivers, { name: '', email: '', phone: '' }]);
    }
  };
  return (
    <div>
      <Background>
        <Container>
          <HeadText>마이페이지</HeadText>
          <MyProfile>
            <h2 className="text-h2">Nickname님, 환영합니다.</h2>
            <Link to="/will">
              <IconWithText>
                <Icon icon="line-md:clipboard-list" />
                <span>유언장 작성하러 가기</span>
              </IconWithText>
            </Link>
          </MyProfile>

          <SettingBox>
            <IconWithText>
              <h3 className="text-h4">사후 전송 서비스 설정</h3>
              <Icon icon="line-md:switch-off-filled" />
              <Icon icon="line-md:switch-off-to-switch-transition" />
            </IconWithText>

            <IconWithText>
              <h4>생존 여부 알림</h4>
              <Icon icon="line-md:question-circle-twotone" />
            </IconWithText>
            <RadioContainer>
              <RadioButtonLabel>
                동의
                <RadioButton
                  name="consent"
                  value="agree"
                  checked={consent === 'agree'}
                  onChange={handleConsentChange}
                />
              </RadioButtonLabel>
              <RadioButtonLabel>
                비동의
                <RadioButton
                  name="consent"
                  value="disagree"
                  checked={consent === 'disagree'}
                  onChange={handleConsentChange}
                />
              </RadioButtonLabel>
            </RadioContainer>
            <IconWithText>
              <h4>내 기록 받아볼 사람</h4>
              <Icon icon="line-md:question-circle-twotone" />
            </IconWithText>
            {receivers.map((receiver, index) => (
              <InputRow key={index}>
                <input
                  type="text"
                  placeholder="이름"
                  value={receiver.name}
                  onChange={(e) => handleReceiverChange(index, 'name', e)}
                />
                <input
                  type="email"
                  placeholder="이메일"
                  value={receiver.email}
                  onChange={(e) => handleReceiverChange(index, 'email', e)}
                />
                <input
                  type="tel"
                  placeholder="전화번호"
                  value={receiver.phone}
                  onChange={(e) => handleReceiverChange(index, 'phone', e)}
                />
              </InputRow>
            ))}
            <Icon icon="line-md:plus-circle" onClick={addReceiver} />
            <StyledButton color="#FFA9A9" size="sm">
              저장
            </StyledButton>
          </SettingBox>
        </Container>
      </Background>
    </div>
  );
}

export default MyPage;
