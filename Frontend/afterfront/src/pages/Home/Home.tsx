import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { userDataState } from '../../states/UserDataState';
import Room from './Room';
import Button from '../../components/common/Button';
import AppTitle from '../../assets/images/app_title.svg';
import Logo from '../../assets/icons/logo.svg';
import styled from 'styled-components';
import tw from 'twin.macro';

const LogoContainer = styled.div`
  ${tw`flex items-center flex-col w-full space-y-6 mb-6`}
`;
const LogInContainer = styled.div`
  ${tw`flex items-center flex-col w-full space-y-6 `}
`;

function LoginForm({ setIsLogin }: any) {
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pwd = passwordRef.current?.value;

    // Send password to backend server
    try {
      const response = await fetch(
        'https://ifidietomorrow.duckdns.org/api/after',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pwd }),
        },
      );
      const jsonData = await response.json();
      jsonData.preview = false;
      console.log(jsonData);
      setIsLogin(jsonData);
    } catch (error) {
      window.alert('로그인 실패!');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div>
        <LogoContainer>
          <img className="mb-6" src={Logo} width={82} height={102} alt="" />
          <img className="mb-6" src={AppTitle} width={213} height={30} alt="" />
        </LogoContainer>
        <LogInContainer>
          <form className=" w-21rm" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border border-red-500 rounded w-full py-2 text-gray-700 mb-6 leading-tight focus:outline-none focus:shadow-outline focus:border-green-200 focus:ring-1 focus:ring-green-200"
                id="password"
                type="password"
                placeholder="비밀번호"
                ref={passwordRef}
              />
            </div>
            <div>
              <Button color="#046F75" size="lg">
                로그인
              </Button>
            </div>
          </form>
        </LogInContainer>
      </div>
    </div>
  );
}

export default function Home() {
  const [userData, setUserData] = useRecoilState(userDataState);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://ifidietomorrow.duckdns.org/api/after',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );
        const jsonData = await response.json();
        jsonData.preview = true;
        console.log(jsonData);
        setUserData(jsonData);
      } catch (error) {}
    }
    fetchData();
  }, []);

  if (Object.keys(userData).length === 0) {
    return <LoginForm setIsLogin={setUserData}></LoginForm>;
  } else {
    return <Room></Room>;
  }
}
