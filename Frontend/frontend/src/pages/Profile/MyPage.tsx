import React, { useState, ChangeEvent, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../states/UserState';
import BottomModal from '../../components/profile/MyPageModal';
import UserInfo from '../../components/profile/UserInfo';
import axios from 'axios';
import {
  Background,
  Container,
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
  const [serviceEnabled, setServiceEnabled] = useState(true);
  const [receiverDisabled, setReceiverDisabled] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const user = useRecoilValue(userState);

  const openBottomModal = () => {
    setIsBottomModalOpen(true);
  };
  const onLogoutClose = () => {
    setIsBottomModalOpen(false);
  };

  const toggleService = () => {
    setServiceEnabled(!serviceEnabled);
  };

  const handleConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConsent(event.target.value);
    if (event.target.value === 'disagree') {
      setReceiverDisabled(true);
    } else {
      setReceiverDisabled(false);
    }
  };
  const [receivers, setReceivers] = useState([{ name: '', phone: '' }]);
  const handleReceiverChange = (
    index: number,
    field: keyof { name: string; phone: string },
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newReceivers = [...receivers];
    newReceivers[index][field] = event.target.value;
    setReceivers(newReceivers);
  };

  const [receiverTexts, setReceiverTexts] = useState<
    Array<{
      receiverId: number;
      name: string;
      phone: string;
    }>
  >([]);

  // 리시버 추가하기
  const addReceiverToAPI = async (receiver: {
    name: string;
    phone: string;
  }) => {
    try {
      const response = await defaultApi.post(
        requests.POST_RECEIVER(),
        {
          name: receiver.name,
          phoneNumber: receiver.phone,
        },
        {
          withCredentials: true, // 여기에 withCredentials 추가
        },
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add receiver:', error);
      return null;
    }
  };

  const addReceiver = async () => {
    const lastIndex = receivers.length - 1;
    const lastReceiver = receivers[lastIndex];

    if (lastReceiver.name.trim() !== '' && lastReceiver.phone.trim() !== '') {
      const addedReceiver = await addReceiverToAPI(lastReceiver);
      if (addedReceiver) {
        setReceiverTexts([
          ...receiverTexts,
          {
            receiverId: addedReceiver.receiverId,
            name: `이름: ${addedReceiver.name}`,
            phone: `전화번호: ${addedReceiver.phoneNumber}`,
          },
        ]);
        setReceivers([
          ...receivers.slice(0, lastIndex),
          { name: '', phone: '' },
        ]);
      }
    } else {
      alert('이름, 이메일, 전화번호를 모두 입력해주세요.');
    }

    // handleSave(); // handleSave 함수 호출
  };

  // 추가된 리시버 조회
  const getReceiversFromAPI = async (): Promise<Array<{
    receiverId: number;
    name: string;
    phoneNumber: string;
  }> | null> => {
    try {
      const response = await defaultApi.get(requests.GET_RECEIVER(), {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get receivers:', error);
      return null;
    }
  };

  // 컴포넌트가 마운트될 때 리시버 목록을 가져옵니다.
  useEffect(() => {
    const fetchReceivers = async () => {
      const fetchedReceivers = await getReceiversFromAPI();
      if (fetchedReceivers) {
        setReceiverTexts(
          fetchedReceivers.map((receiver) => ({
            receiverId: receiver.receiverId,
            name: `이름: ${receiver.name}`,
            phone: `전화번호: ${receiver.phoneNumber}`,
          })),
        );
      }
    };

    fetchReceivers();
  }, []);

  // 리시버 삭제하기
  const deleteReceiverFromAPI = async (receiverId: number) => {
    try {
      const response = await defaultApi.delete(
        requests.DELETE_RECEIVER(receiverId),
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete receiver:', error);
      throw error;
    }
  };

  const inputRefs = receivers.map(() => ({
    name: React.createRef<HTMLInputElement>(),
    phone: React.createRef<HTMLInputElement>(),
  }));
  const handleSave = () => {
    let invalidIndex = -1;
    const validReceivers: Array<{
      receiverId: number;
      name: string;
      phone: string;
    }> = [];

    for (let index = 0; index < receivers.length; index++) {
      const receiver = receivers[index];
      const isValid = Object.values(receiver)
        .filter((value) => typeof value === 'string')
        .every((value) => (value as string).trim() !== '');

      if (isValid) {
        validReceivers.push({
          receiverId: receiverTexts[index].receiverId,
          name: receiver.name,
          phone: receiver.phone,
        });
      } else if (invalidIndex === -1) {
        invalidIndex = index;
      }
    }

    const newReceiverTexts = validReceivers.map((receiver) => ({
      receiverId: receiver.receiverId,
      name: `이름: ${receiver.name}`,

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

    const newReceivers = receivers
      .map((receiver, index) => ({
        receiverId: receiverTexts[index].receiverId,
        ...receiver,
      }))
      .filter((receiver, index) => !validReceivers.includes(receiver));
    if (newReceivers.length === 0) {
      newReceivers.push({
        receiverId: receiverTexts.length,
        name: '',
        phone: '',
      });
    }
    setReceivers(newReceivers);
  };

  const handleDelete = async (index: number) => {
    const receiverToDelete = receiverTexts[index];
    try {
      const deletedReceiver = await deleteReceiverFromAPI(
        receiverToDelete.receiverId,
      );
      if (deletedReceiver) {
        setReceiverTexts(receiverTexts.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to delete receiver');
    }
    handleSave();
  };

  return (
    <div>
      {isBottomModalOpen ? (
        <BottomModal onClose={onLogoutClose} children="생존 여부 알림" />
      ) : null}
      <Background>
        <Container>
          <UserInfo />

          <SettingBox>
            <h3 className="text-h4">사후 전송 서비스 설정</h3>

            <IconWithText>
              <h4>생존 여부 알림</h4>
              <Icon
                icon="line-md:question-circle-twotone"
                onClick={openBottomModal}
              />
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
              <Icon
                icon="line-md:question-circle-twotone"
                onClick={openBottomModal}
              />
            </IconWithText>
            {receivers &&
              receivers.map(
                (receiver, index) =>
                  receiverTexts.length < 3 && (
                    <InputRow key={index}>
                      <input
                        type="text"
                        placeholder="이름"
                        ref={inputRefs[index].name}
                        value={receiver.name}
                        onChange={(e) => handleReceiverChange(index, 'name', e)}
                        disabled={!serviceEnabled || receiverDisabled}
                      />

                      <input
                        type="tel"
                        placeholder="전화번호"
                        ref={inputRefs[index].phone}
                        value={receiver.phone}
                        onChange={(e) =>
                          handleReceiverChange(index, 'phone', e)
                        }
                        disabled={!serviceEnabled || receiverDisabled}
                      />
                    </InputRow>
                  ),
              )}
            {receiverTexts &&
              receiverTexts.map((text, index) => (
                <Receiver
                  key={index}
                  style={{
                    color: receiverDisabled ? '#A9A9A9' : 'inherit',
                  }}
                >
                  <div>
                    <p>{text.name}</p>

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
