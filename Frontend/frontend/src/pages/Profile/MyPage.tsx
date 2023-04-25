import React, { useState, ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import {
  Background,
  Container,
  HeadText,
  MyProfile,
  SettingBox,
  RadioContainer,
  RadioButtonLabel,
  RadioButton,
  InputRow,
  Receiver,
  StyledButton,
  IconWithText,
} from './MyPageEmotion';

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

  const [receiverTexts, setReceiverTexts] = useState<
    Array<{ name: string; email: string; phone: string }>
  >([]);

  const addReceiver = () => {
    if (receivers.length + receiverTexts.length < 3) {
      setReceivers([...receivers, { name: '', email: '', phone: '' }]);
    }
  };
  const handleSave = () => {
    const newReceiverTexts = receivers.map((receiver) => ({
      name: `이름: ${receiver.name}`,
      email: `이메일: ${receiver.email}`,
      phone: `전화번호: ${receiver.phone}`,
    }));
    setReceiverTexts([
      ...receiverTexts,
      ...newReceiverTexts.slice(0, 3 - receiverTexts.length),
    ]);
    setReceivers([{ name: '', email: '', phone: '' }]);
  };

  const handleDelete = (index: number) => {
    setReceiverTexts(receiverTexts.filter((_, i) => i !== index));
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
            {receivers.map(
              (receiver, index) =>
                receiverTexts.length < 3 && (
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
                ),
            )}
            {receiverTexts.map((text, index) => (
              <Receiver key={index}>
                <div>
                  <p>{text.name}</p>
                  <p>{text.email}</p>
                  <p>{text.phone}</p>
                </div>
                <Icon
                  icon="line-md:remove"
                  onClick={() => handleDelete(index)}
                  style={{ cursor: 'pointer' }}
                />
              </Receiver>
            ))}
            {receivers.length < 3 && receiverTexts.length < 3 && (
              <Icon icon="line-md:plus-circle" onClick={addReceiver} />
            )}
            <StyledButton color="#FFA9A9" size="sm" onClick={handleSave}>
              저장
            </StyledButton>
          </SettingBox>
        </Container>
      </Background>
    </div>
  );
}

export default MyPage;
