import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { userState, loginState } from '../../states/UserState';
import { categoryState } from '../../states/CategoryState';

import requests from '../../api/config';
import { defaultApi } from '../../api/axios';

import HomeSemiRoom from '../../components/home/HomeSemiRoom';
import {
  Logo,
  FeelingTxt,
  CommentAlert,
  CommentAlertIcon,
} from './HomeEmotion';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../App';
import AlertCount from '../../components/feed/AlertCount';

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
      <Link to="/newcomment">
        <CommentAlert>
          <CommentAlertIcon>
            <AlertCount />
            <svg
              width="24"
              height="28"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 19H11C11 20.1 10.1 21 9 21C7.9 21 7 20.1 7 19ZM18 17V18H0V17L2 15V9C2 5.9 4 3.2 7 2.3V2C7 0.9 7.9 0 9 0C10.1 0 11 0.9 11 2V2.3C14 3.2 16 5.9 16 9V15L18 17ZM14 9C14 6.2 11.8 4 9 4C6.2 4 4 6.2 4 9V16H14V9Z"
                fill="white"
              />
            </svg>
          </CommentAlertIcon>
        </CommentAlert>
      </Link>
      <FeelingTxt>
        밤하늘을 보며 <br /> 산책 한번 어때요?
      </FeelingTxt>
      <HomeSemiRoom />
    </div>
  );
}

export default Home;
