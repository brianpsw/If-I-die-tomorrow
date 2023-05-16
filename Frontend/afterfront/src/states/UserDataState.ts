import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

interface Bucket {
  bucketId: number;
  nickname: string;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  userId: number;
  categoryId: number;
  name: string;
  imageUrl: string;
}

interface Photo {
  photoId: number;
  imageUrl: string;
  caption: string;
  created: string;
  updated: string;
}

interface PhotoCategory {
  category: Category;
  photos: Photo[];
}

interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  createdAt: string;
  updatedAt: string;
  nickname: string;
}

interface Will {
  willId: number;
  name: string;
  content: string;
  videoUrl: string;
  signUrl: string;
  created: string;
  updated: string;
}

interface Data {
  buckets: Bucket[];
  diaries: Diary[];
  photos: PhotoCategory[];
  will: Will;
}

export const userDataState = atom<Data>({
  key: 'userDataState',
  default: {} as Data,
  effects_UNSTABLE: [persistAtom],
});
