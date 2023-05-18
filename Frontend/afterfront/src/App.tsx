import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Home from './pages/Home/Home';
import Bucket from './pages/Bucket/Bucket';
import Diary from './pages/Diary/Diary';
import DiaryDetail from './pages/Diary/DiaryDetail';
import BucketDetail from './pages/Bucket/BucketDetail';
import Will from './pages/Will/Will';
import PhotoCloud from './pages/PhotoCloud/PhotoCloud';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useRecoilValue } from 'recoil';
import { userDataState } from './states/UserDataState';
import PurpleBg from '../src/assets/images/purple_sky.jpg';

const Background = styled.div`
  background-image: url(${PurpleBg});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
`;

const Preview = styled.div`
  ${tw`fixed z-10 bg-gray-100/50 py-4 px-8 rounded-[50px] bottom-4 left-6 shadow`}
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
`;

function App() {
  const userData = useRecoilValue(userDataState);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter basename="/after">
        <div className="App min-w-[300px]">
          <Background>
            {userData && userData.preview ? (
              <Link
                to="https://ifidietomorrow.co.kr/mypage"
                target="_self"
                reloadDocument={true}
                replace={true}
              >
                <Preview>
                  <h4 className="text-h4 text-black">미리보기 끝내기</h4>
                </Preview>
              </Link>
            ) : null}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/bucket" element={<Bucket />} />
              <Route path="/diary" element={<Diary />} />
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/diary/:diaryId" element={<DiaryDetail />} />
              <Route path="/bucket/:bucketId" element={<BucketDetail />} />
              <Route path="/will" element={<Will />} />
              <Route path="/photo-cloud" element={<PhotoCloud />} />
              {/* <Route path="/*" element={<ErrorPage />} /> */}
            </Routes>
          </Background>
        </div>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
