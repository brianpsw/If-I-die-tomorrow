import { , useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { userState, loginState } from '../../states/UserState';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import HomeSemiRoom from '../../components/home/HomeSemiRoom';
import { Logo, FeelingTxt } from './HomeEmotion';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../App';

const firebaseToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_PUBLICKEY,
    });
    if (token) {
      const response = await defaultApi.post(
        requests.POST_TOKEN(),
        {
          token,
        },
        { withCredentials: true },
      );
    } else {
      // Show permission request UI
      console.log(
        'No registration token available. Request permission to generate one.',
      );
      // ...
    }
  } catch (e) {
    console.error(e);
  }
};

function Home() {
  const [user, setUser] = useRecoilState(userState);
  const isLogin = useRecoilValue(loginState);
  const setCategory = useSetRecoilState(categoryState);
  const navigate = useNavigate();

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
    } catch (error) {
      throw error;
    }
  };

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

  useEffect(() => {
    if (user?.name === undefined && isLogin === false) {
      navigate('/login');
    } else {
      get_user();
      get_all_category();
      firebaseToken();
    }
  }, []);

  return (
    <div className="min-h-[100vh] pb-[60px]">
      <Logo />
      <FeelingTxt>
        밤하늘을 보며 <br /> 산책 한번 어때요?
      </FeelingTxt>
      <HomeSemiRoom />
    </div>
  );
}

export default Home;
