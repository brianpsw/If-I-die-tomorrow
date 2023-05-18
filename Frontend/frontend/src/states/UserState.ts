import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

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

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const loginState = atom<boolean>({
  key: 'loginState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
