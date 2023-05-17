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
import ServiceAgreement from './pages/Profile/ServiceAgreement';
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
import { LogoContainer } from './pages/LogIn/Login';
import Logo from './assets/icons/logo.svg';
import AppTitle from './assets/images/app_title.svg';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div className="App min-w-[300px]">
          <div className="fixed min-[451px]:block hidden h-full w-full bg-gray-500 z-10 pt-[180px]">
            <LogoContainer>
              <img src={Logo} width={82} height={102} alt="" />
              <img src={AppTitle} width={213} height={30} alt="" />
            </LogoContainer>
            <p className="text-center text-p1 mt-8 text-white">
              저희 서비스는 모바일에 최적화 되어있습니다.
              <br /> 화면의 크기를 줄여주세요.
            </p>
          </div>
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
