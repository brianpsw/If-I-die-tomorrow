import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

interface CategoryData {
  categoryId: number;
  name: string;
  objectId: number;
}

export const categoryState = atom<CategoryData[] | null>({
  key: 'categoryState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const exchangeCategoryState = atom({
  key: 'exchangeCategoryState',
  default: {
    1: '베드',
    2: '커피테이블',
    3: '책장',
    4: '책상',
    5: '보드',
    6: '카펫',
    7: '컴퓨터',
    8: '소파',
    9: '벽장',
    10: '고양이',
  },
  effects_UNSTABLE: [persistAtom],
});
