import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import './CalenderStyles.css';
import Calendar from './Calender';
import DiaryDetail from './DiaryDetail';

function Diary() {
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);

  const showDetailsHandle = (dayStr: any) => {
    setData(dayStr);
    setShowDetails(true);
  };

  return (
    <div className="App">
      <Calendar showDetailsHandle={showDetailsHandle} />
      <br />
    </div>
  );
}

export default Diary;
