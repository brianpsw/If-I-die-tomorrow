import { useState, useEffect, useRef } from 'react';
import { defaultApi } from '../../api/axios';
import requests from '../../api/config';
import tw from 'twin.macro';
import styled from 'styled-components';

const Badge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  z-index: 2;
`;

function AlertCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await defaultApi.get(
          requests.GET_NEW_COMMENT_COUNT(),
          { withCredentials: true },
        );
        setCount(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCount();
  }, []);
  return (
    <div>
      <Badge>{count}</Badge>
    </div>
  );
}

export default AlertCount;
