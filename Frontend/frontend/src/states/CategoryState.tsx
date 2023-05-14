import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

interface CategoryData {
  categoryId: number;
  name: string;
  objectId: number;
  imageUrl: string;
}

export const categoryState = atom<CategoryData[] | null>({
  key: 'categoryState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const exchangeCategoryState = atom({
  key: 'exchangeCategoryState',
  default: {
    1: '0 0',
    2: '-60px 0',
    3: '-120px 0',
    4: '-180px 0',
    5: '-240px 0',
    6: '0 -60px',
    7: '-60px -60px',
    8: '-120px -60px',
    9: '-180px -60px',
    10: '-240px -60px',
  },
  effects_UNSTABLE: [persistAtom],
});
