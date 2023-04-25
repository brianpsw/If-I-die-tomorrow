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
  IconContainer,
} from './MyPageEmotion';

function MyPage() {
  const [consent, setConsent] = useState<string | null>(null);
  const [serviceEnabled, setServiceEnabled] = useState(false);

  const toggleService = () => {
    setServiceEnabled(!serviceEnabled);
  };

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
  const inputRefs = receivers.map(() => ({
    name: React.createRef<HTMLInputElement>(),
    email: React.createRef<HTMLInputElement>(),
    phone: React.createRef<HTMLInputElement>(),
  }));
  const handleSave = () => {
    let invalidIndex = -1;
    const validReceivers: typeof receivers = [];

    for (let index = 0; index < receivers.length; index++) {
      const receiver = receivers[index];
      const isValid = Object.values(receiver).every(
        (value) => value.trim() !== '',
      );

      if (isValid) {
        validReceivers.push(receiver);
      } else if (invalidIndex === -1) {
        invalidIndex = index;
      }
    }

    const newReceiverTexts = validReceivers.map((receiver) => ({
      name: `이름: ${receiver.name}`,
      email: `이메일: ${receiver.email}`,
      phone: `전화번호: ${receiver.phone}`,
    }));

    setReceiverTexts([
      ...receiverTexts,
      ...newReceiverTexts.slice(0, 3 - receiverTexts.length),
    ]);

    if (invalidIndex !== -1) {
      const invalidReceiver = receivers[invalidIndex];
      const emptyField = Object.keys(invalidReceiver).find(
        (field) =>
          invalidReceiver[field as keyof typeof invalidReceiver].trim() === '',
      );
      if (emptyField) {
        inputRefs[invalidIndex][
          emptyField as keyof (typeof inputRefs)[0]
        ].current?.focus();
      }
    }

    const newReceivers = receivers.filter(
      (_, index) => !validReceivers.includes(receivers[index]),
    );
    if (newReceivers.length === 0) {
      newReceivers.push({ name: '', email: '', phone: '' });
    }
    setReceivers(newReceivers);
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
              <Icon
                icon={
                  serviceEnabled
                    ? 'line-md:switch-off-to-switch-transition'
                    : 'line-md:switch-off-filled'
                }
                onClick={toggleService}
                width="32px"
                height="32px"
              />
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
                  disabled={!serviceEnabled}
                />
              </RadioButtonLabel>
              <RadioButtonLabel>
                비동의
                <RadioButton
                  name="consent"
                  value="disagree"
                  checked={consent === 'disagree'}
                  onChange={handleConsentChange}
                  disabled={!serviceEnabled}
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
                      ref={inputRefs[index].name}
                      value={receiver.name}
                      onChange={(e) => handleReceiverChange(index, 'name', e)}
                      disabled={!serviceEnabled}
                    />
                    <input
                      type="email"
                      placeholder="이메일"
                      ref={inputRefs[index].email}
                      value={receiver.email}
                      onChange={(e) => handleReceiverChange(index, 'email', e)}
                      disabled={!serviceEnabled}
                    />
                    <input
                      type="tel"
                      placeholder="전화번호"
                      ref={inputRefs[index].phone}
                      value={receiver.phone}
                      onChange={(e) => handleReceiverChange(index, 'phone', e)}
                      disabled={!serviceEnabled}
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
              <IconContainer>
                <Icon icon="line-md:plus-circle" onClick={addReceiver} />
              </IconContainer>
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
