/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const methods: (keyof HttpInterface)[] = ['get', 'post', 'delete', 'put'];

export interface HttpInterface {
  /**
   * 获取
   *
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @returns {AxiosPromise}
   * @memberof HttpInterface
   */
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  /**
   * 删除
   *
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @returns {AxiosPromise}
   * @memberof HttpInterface
   */
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  /**
   * post，用于新增
   *
   * @param {string} url
   * @param {*} [data]
   * @param {AxiosRequestConfig} [config]
   * @returns {AxiosPromise}
   * @memberof HttpInterface
   */
  // tslint:disable-next-line:no-any
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  /**
   * put，用于更新
   *
   * @param {string} url
   * @param {*} [data]
   * @param {AxiosRequestConfig} [config]
   * @returns {AxiosPromise}
   * @memberof HttpInterface
   */
  // tslint:disable-next-line:no-any
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const http: HttpInterface = Axios.create() as HttpInterface;

// 处理响应码
const transformResponse = (response: AxiosResponse) => {
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

// 错误处理
const transformError = (error: object) => {
  throw error;
};

methods.forEach((methodName) => {
  const fn: any = http[methodName];
  http[methodName] = (...args: any[]) =>
    fn(...args).then(transformResponse, transformError);
});

export default http;
