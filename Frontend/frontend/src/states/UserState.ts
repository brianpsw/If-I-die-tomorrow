import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const sessionStorage =
  typeof window !== 'undefined' ? window.sessionStorage : undefined;

const { persistAtom } = recoilPersist({
  key: '내맘대로 정하는 키 이름',
  storage: sessionStorage,
});

interface User {
  userId: number;
  name: string;
  email: string;
  age: number;
  nickname: string;
  sendAgree: boolean;
  personalPage: string | null;
  personalityId: number | null;
  newCheck: boolean;
  deleted: boolean;
  providerType: string;
}

export const userState = atom<User>({
  key: 'userState',
  default: {} as User,
  effects_UNSTABLE: [persistAtom],
});

export const loginState = atom<boolean>({
  key: 'loginState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
