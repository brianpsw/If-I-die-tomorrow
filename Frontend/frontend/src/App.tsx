import React from 'react';
// import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
// import { RecoilRoot } from 'recoil';
// import styled from 'styled-components';
// import tw from 'tailwind-styled-components';
// import axios from 'axios';
// import { persistAtom } from 'recoil-persist';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Home from './pages/Home/Home';
import Room from './pages/Home/Room';
import Bucket from './pages/Bucket/Bucket';
import Diary from './pages/Diary/Diary';
import Login from './pages/LogIn/Login';
import Nickname from './pages/LogIn/Nickname';
import ServiceAgreement from './pages/Profile/ServiceAgreement';
import Feed from './pages/Feed/Feed';
import DiaryDetail from './pages/Diary/DiaryDetail';
import BucketDetail from './pages/Bucket/BucketDetail';
import MyPage from './pages/Profile/MyPage';
import Will from './pages/Profile/Will';
import Survey from './pages/Diary/Survey';
import PhotoCloud from './pages/PhotoCloud/PhotoCloud';
import CreateCategory from './pages/PhotoCloud/CreateCategory';
import UploadPhoto from './pages/PhotoCloud/UploadPhoto';
import NavBar from './components/common/NavBar';

function App() {
  return (
    <div className="App min-w-[390px] max-w-[390px]">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/bucket" element={<Bucket />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/service-agreement" element={<ServiceAgreement />} />
            <Route path="/diary/:diaryId" element={<DiaryDetail />} />
            <Route path="/bucket/:bucketId" element={<BucketDetail />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/photo-cloud" element={<PhotoCloud />} />
            <Route
              path="/photo-cloud/create-category"
              element={<CreateCategory />}
            />
            <Route
              path="/photo-cloud/:category/upload-photo"
              element={<UploadPhoto />}
            />
            {/* <Route path="/*" element={<ErrorPage />} /> */}
          </Routes>
          <NavBar />
        </BrowserRouter>
      </LocalizationProvider>
    </div>
  );
}

export default App;
