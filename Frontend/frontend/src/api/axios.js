/* axios instance 정의 
   defaultApi.get(API, body);
*/
import axios from 'axios';
import requests from './config';

const BASE_URL = requests.base_url;
const axiosApi = (url, options) => {
  const instance = axios.create({
    baseURL: url, //URL은 입력받고
    ...options, //나머지 옵션은 그대로
  });

  return instance;
};

export const defaultApi = axiosApi(BASE_URL);
