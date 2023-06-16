import { Route, Routes, BrowserRouter } from 'react-router-dom';
// import { RecoilRoot } from 'recoil';
// import styled from 'styled-components';
// import tw from 'tailwind-styled-components';
// import axios from 'axios';
// import { persistAtom } from 'recoil-persist';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Carousel from './components/common/Carousel';
import Home from './pages/Home/Home';
import Bucket from './pages/Bucket/Bucket';
import Diary from './pages/Diary/Diary';
import Login from './pages/LogIn/Login';
import Nickname from './pages/LogIn/Nickname';
import Feed from './pages/Feed/Feed';
import DiaryDetail from './pages/Diary/DiaryDetail';
import BucketDetail from './pages/Bucket/BucketDetail';
import MyPage from './pages/Profile/MyPage';
import Will from './pages/Will/Will';
import Survey from './pages/Diary/Survey';
import PhotoCloud from './pages/PhotoCloud/PhotoCloud';
import CreateCategory from './pages/PhotoCloud/CreateCategory';
import UploadPhoto from './pages/PhotoCloud/UploadPhoto';
import NavBar from './components/common/NavBar';
import WillText from './pages/Will/WillText';
import WillSign from './pages/Will/WillSign';
import WillVideo from './pages/Will/WillVideo';
import ScrollTop from './components/common/ScrollTop';
import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import './firebase-messaging-sw';

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
export const messaging = getMessaging(firebaseApp);

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  });
}
function App() {
  useEffect(() => {
    if ('Notification' in window && 'requestPermission' in Notification)
      requestPermission();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ScrollTop />
        <div className="App min-w-[300px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bucket" element={<Bucket />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/diary/:diaryId" element={<DiaryDetail />} />
            <Route path="/bucket/:bucketId" element={<BucketDetail />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/will" element={<Will />} />
            <Route path="/will/text" element={<WillText />} />
            <Route path="/will/sign" element={<WillSign />} />
            <Route path="/will/video" element={<WillVideo />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/photo-cloud/:categoryId" element={<PhotoCloud />} />
            <Route
              path="/photo-cloud/create-category"
              element={<CreateCategory />}
            />
            <Route
              path="/photo-cloud/upload-photo/:categoryId"
              element={<UploadPhoto />}
            />
            {/* <Route path="/*" element={<ErrorPage />} /> */}
          </Routes>
          <Carousel />
          <NavBar />
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
