/* axios instance 정의 
   defaultApi.get(API, body);
*/
import axios from 'axios';
import requests from './config';
import Swal from 'sweetalert2';

const BASE_URL = requests.base_url;
const axiosApi = (url, options) => {
  const instance = axios.create({
    baseURL: url, //URL은 입력받고
    ...options, //나머지 옵션은 그대로
  });

  return instance;
};

export const defaultApi = axiosApi(BASE_URL);

const handleResponse = (response) => {
  if (
    response &&
    response.headers &&
    response.headers['content-type'] &&
    response.headers['content-type'].includes('text/html')
  ) {
    Swal.fire({
      title: '로그인이 필요합니다',
      icon: 'error',
      confirmButtonText: '확인',
    }).then(() => {
      window.location.href = '/login';
    });
  }
  return response;
};

const handleError = (error) => {
  const status = error.response && error.response.status;
  if (status === 401) {
    Swal.fire({
      title: '접근권한이 없는 페이지입니다',
      icon: 'error',
      confirmButtonText: '확인',
    }).then(() => {
      window.location.href = '/';
    });
  }
  return Promise.reject(error);
};

defaultApi.interceptors.response.use(handleResponse, handleError);
