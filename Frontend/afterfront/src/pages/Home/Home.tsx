import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { userDataState } from '../../states/UserDataState';

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
      console.log(jsonData);
      setIsLogin(jsonData);
    } catch (error) {
      window.alert('로그인 실패!');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Password:
        <input type="password" ref={passwordRef} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default function Home() {
  const [userData, setUserData] = useRecoilState(userDataState);
  if (Object.keys(userData).length === 0) {
    return <LoginForm setIsLogin={setUserData}></LoginForm>;
  } else {
    return <h1>Hello, Home!</h1>;
  }
}
