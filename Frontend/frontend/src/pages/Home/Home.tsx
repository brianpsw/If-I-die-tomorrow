import React, { Suspense, useEffect } from 'react';

import { useSetRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import HomeSemiRoom from '../../components/home/HomeSemiRoom';
import { Logo, FeelingTxt } from './HomeEmotion';
import Loading from '../../components/common/Loading';

function Home() {
  const setUser = useSetRecoilState(userState);
  const setCategory = useSetRecoilState(categoryState);

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
        // return console.log(response);
      } catch (error) {
        throw error;
      }
    };
    get_user();
    // console.log(userInfo[0]?.nickname);

    const get_all_category = async () => {
      try {
        const response = await defaultApi.get(requests.GET_ALL_CATEGORY(), {
          withCredentials: true,
        });
        if (response.status === 200) {
          setCategory(response.data);
        }
      } catch (err) {
        throw err;
      }
    };
    get_all_category();
  }, []);

  return (
    <div>
      <Logo />
      <FeelingTxt>
        밤하늘을 보며 <br /> 산책 한번 어때요?
      </FeelingTxt>
      <Suspense fallback={<Loading />}>
        <HomeSemiRoom />
      </Suspense>
    </div>
  );
}

export default Home;
