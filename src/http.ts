/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosResponse } from 'axios';

const http = Axios.create();

// 处理响应码
export const transformResponse = (response: AxiosResponse) => {
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

http.interceptors.response.use(transformResponse);

export default http;
