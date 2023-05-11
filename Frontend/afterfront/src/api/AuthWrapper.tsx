import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../states/UserDataState';

function AuthWrapper({ children }: any) {
  const navigation = useNavigate();
  const userData = useRecoilValue(userDataState);

  useEffect(() => {
    console.log('auth');
    console.log(userData);
    if (Object.keys(userData).length === 0) {
      navigation('/');
    }
  }, [userData]);

  return <>{children}</>;
}

export default AuthWrapper;
