import React, { Suspense } from 'react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import HomeSemiRoom from '../../components/home/HomeSemiRoom';
import { Background, Logo, FeelingTxt } from './HomeEmotion';

function Home() {
  const [user, setUser] = useRecoilState(userState);
  const userInfo = useRecoilState(userState);
  useEffect(() => {
    const get_user = async () => {
      try {
        const response = await defaultApi.get(requests.GET_USER(), {
          withCredentials: true,
        });
        const userSave = {
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          age: response.data.age,
          nickname: response.data.nickname,
          sendAgree: response.data.sendAgree,
          personalPage: response.data.personalPage,
          personalityId: response.data.personalityId,
          newCheck: response.data.newCheck,
          deleted: response.data.deleted,
          providerType: response.data.providerType,
        };
        setUser(userSave);
        return console.log(response.data);
      } catch (error) {
        throw error;
      }
    };
    get_user();
    console.log(userInfo[0]?.nickname);
  }, []);

  return (
    <Background>
      <Logo />
      <FeelingTxt>
        밤하늘을 보며 <br /> 산책 한번 어때요?
      </FeelingTxt>
      <Suspense fallback={<div>loading...</div>}>
        <HomeSemiRoom />
      </Suspense>
    </Background>
  );
}

export default Home;
