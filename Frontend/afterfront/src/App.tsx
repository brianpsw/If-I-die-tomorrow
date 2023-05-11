import { Route, Routes, BrowserRouter } from 'react-router-dom';
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
import backgroundImg from './assets/images/main_bg.png';
const Background = styled.div`
  ${tw`text-p2`}
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-attachment: fixed;
  padding-bottom: 70px;
`;
function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <div className="App min-w-[300px]">
          <Background>
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
