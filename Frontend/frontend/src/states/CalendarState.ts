import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

interface Calendar {
  clickedDate: Date;
  clickedMonth: Date;
}

export const calendarState = atom<Calendar | null>({
  key: 'calendarState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
