import React, { useRef, useEffect, useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import SignatureCanvas from 'react-signature-canvas'; // 라이브러리 import
import { useRecoilState } from 'recoil';
import { userState } from '../../states/UserState';
import TopBar from '../../components/common/TopBar';
import requests from '../../api/config';
import { defaultApi } from '../../api/axios';
import Button from '../../components/common/Button';
import AppTitle from '../../assets/images/text_logo.png';
import Loading from '../../components/common/Loading';
const Container = styled.div`
  ${tw`flex flex-col justify-center rounded-xl items-center p-[16px] m-[24px] bg-gray-100/80`}
`;

const SignatureCanvasContainer = styled.div`
  ${tw`flex justify-center items-center `}
`;
const CanvasButton = styled.button`
  ${tw`flex w-[80px] h-[30px] justify-center border-2 items-center mt-[20px]`}
`;
const CanvasButtonContainer = styled.div`
  ${tw`flex justify-center items-center`}
`;
function WillSign(): JSX.Element {
  const [loadingOpen, setLoadingOpen] = useState<boolean>(false);
  const userInfo = useRecoilState(userState);
  const [sign, setSign] = useState<File | null>(null);
  const [defaultSign, setDefaultSign] = useState('');
  const [editSign, setEditSign] = useState<Boolean>(false);
  const [isValid, setIsValid] = useState<Boolean>(false);
  // useRef로 DOM에 접근 (SignatureCanvas 라는 캔버스 태그에 접근)
  const signCanvas = useRef() as React.MutableRefObject<any>;
  const get_will = async () => {
    try {
      const response = await defaultApi.get(requests.GET_WILL(), {
        withCredentials: true,
      });
      setDefaultSign(response.data.signUrl);

      console.log(response);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    get_will();
  }, []);
  // 캔버스 지우기
  const handleSubmit = () => {
    const formData = new FormData();
    if (sign) {
      formData.append('photo', sign);
    }
    const patch_will_sign = async () => {
      setLoadingOpen(true);
      try {
        await defaultApi.patch(requests.PATCH_WILL_SIGN(), formData, {
          withCredentials: true,
        });
        get_will();
        setEditSign(false);
        setIsValid(false);
        setLoadingOpen(false);
        Swal.fire({
          title: '서명 등록 성공!',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        setLoadingOpen(false);
        Swal.fire({
          title: '서명 등록 실패...',
          icon: 'error',
          confirmButtonText: '확인',
        });
        throw error;
      }
    };
    patch_will_sign();
  };
  const handleEdit = () => {
    setEditSign(true);
  };
  const clear = () => {
    signCanvas.current.clear();
    setIsValid(false);
  };

  // 이미지 저장
  const save = () => {
    if (signCanvas.current) {
      const isSignatureEmpty = signCanvas.current.isEmpty();
      if (isSignatureEmpty) {
      } else {
        const canvasData = signCanvas.current.toDataURL('image/png');
        fetch(canvasData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File(
              [blob],
              `${userInfo[0]?.nickname}의 서명.png`,
              {
                type: 'image/png',
              },
            );
            setSign(file);
            setIsValid(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  return (
    <div className="min-h-[100vh] pb-[70px]">
      <TopBar title="유언장 서명 등록" />
      <div className="flex justify-center my-[30px]">
        <img src={AppTitle} alt="" />
      </div>
      <Container>
        {editSign ? '' : <img src={defaultSign} alt="" />}
        {editSign ? (
          <SignatureCanvasContainer>
            <SignatureCanvas
              ref={signCanvas}
              canvasProps={{
                width: '250',
                height: '200',
                className: 'sigCanvas',
              }}
              backgroundColor="rgb(255, 255, 255)"
            />
          </SignatureCanvasContainer>
        ) : (
          ''
        )}
        {editSign ? (
          <CanvasButtonContainer>
            <CanvasButton onClick={clear}>clear</CanvasButton>
            <CanvasButton onClick={save}>save</CanvasButton>
          </CanvasButtonContainer>
        ) : (
          ''
        )}
        {!isValid && editSign ? (
          <span className="text-yellow-500 text-p2 mt-[16px]">
            서명이 존재하지 않습니다.
          </span>
        ) : (
          ''
        )}
        <div className="flex mt-[16px]">
          {!editSign && defaultSign ? (
            <Button
              onClick={handleEdit}
              color={editSign ? '#B3E9EB' : '#0E848A'}
              size="sm"
              disabled={editSign ? true : false}
              className="mx-[8px]"
            >
              서명 다시하기
            </Button>
          ) : (
            ''
          )}
          {!editSign && !defaultSign ? (
            <Button
              onClick={handleEdit}
              color={editSign ? '#B3E9EB' : '#0E848A'}
              size="sm"
              disabled={editSign ? true : false}
              className="mx-[8px] mb-[16px]"
            >
              서명 등록하기
            </Button>
          ) : (
            ''
          )}

          {editSign ? (
            <Button
              onClick={handleSubmit}
              color={isValid ? '#0E848A' : '#B3E9EB'}
              // color="#0E848A"
              size="sm"
              className="mx-[8px]"
              disabled={isValid ? false : true}
            >
              등록완료
            </Button>
          ) : (
            ''
          )}
        </div>
        {/* {sign ? <img src={URL.createObjectURL(sign)} alt="" /> : ''} */}
      </Container>
    </div>
  );
}

export default WillSign;
