'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { atom, useRecoilState } from 'recoil';


const userDataState = atom<any>({
  key: 'userDataState',
  default: {},
});



function LoginForm({setIsLogin} : any) {
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const password = passwordRef.current?.value;

    // Send password to backend server
    fetch('/api/after', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })
      .then(response => {
        setIsLogin(response.json);
      })
      .catch(error => {
        window.alert("로그인 실패!");
      });
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
  const router = useRouter();
  const [userData, setUserData] = useRecoilState(userDataState);

  
  if(Object.keys(userData).length === 0){
    return <LoginForm setIsLogin = {setUserData}></LoginForm>;
  }
  else{
    return <h1>Hello, Home!</h1>;
  }
}


  