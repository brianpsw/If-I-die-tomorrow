import React, { Suspense } from 'react';

import HomeSemiRoom from '../../components/home/HomeSemiRoom';
import { Background, Logo, FeelingTxt } from './HomeEmotion';

function Home() {
  return (
    <Background>
      <Logo></Logo>
      <FeelingTxt>
        밤하늘을 보며 <br /> 산책 한번 어때요?
      </FeelingTxt>
      <Suspense fallback={<div>loading...</div>}>
        <HomeSemiRoom />
      </Suspense>
    </Background>
  );
}

export default Home;
