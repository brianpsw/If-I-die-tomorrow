import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

interface CategoryData {
  categoryId: number;
  name: string;
  userId: number;
  imageUrl: string;
}

export const categoryState = atom<CategoryData[] | null>({
  key: 'categoryState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
