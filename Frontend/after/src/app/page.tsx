'use client';

import { useRef } from 'react';
import { atom, useRecoilState } from 'recoil';

interface Bucket {
  bucketId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  complete: string;
  created: string;
  updated: string;
};

interface Category {
  userId: number;
  categoryId: number;
  name: string;
  objectId: number;
};

interface Photo {
  photoId: number;
  imageUrl: string;
  caption: string;
  created: string;
  updated: string;
};

interface PhotoCategory{
  category: Category;
  photos: Photo[];
}
interface Diary {
  diaryId: number;
  title: string;
  nickname: string;
  imageUrl: string;
  content: string;
  secret: boolean;
  created: string;
  updated: string;
};

interface Will {
  willId: number;
  content: string;
  voiceUrl: string;
  signUrl: string;
  created: string;
  updated: string;
};
			

interface Data {
 
  buckets: Bucket[];
  diaries: Diary[];
  photos: PhotoCategory[];
  will: Will;
}

export const userDataState = atom<Data>({
  key: 'userDataState',
  // default: {},
});



function LoginForm({setIsLogin} : any) {
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const password = passwordRef.current?.value;

    // Send password to backend server
    fetch('https://ifidietomorrow.co.kr/api/after', {
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
  const [userData, setUserData] = useRecoilState(userDataState);

  
  if(Object.keys(userData).length === 0){
    return <LoginForm setIsLogin = {setUserData}></LoginForm>;
  }
  else{
    return <h1>Hello, Home!</h1>;
  }
}




  