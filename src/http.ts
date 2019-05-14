import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const methods = ['get', 'post', 'delete', 'put'];

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
  if (response.status < 300 && response.status >= 200) {
    return response.data;
  } else {
    throw response;
  }
};

// 错误处理
const transformError = (error) => {
  throw error;
};

methods.forEach((methodName) => {
  const fn = http[methodName];
  http[methodName] = (...args) =>
    fn(...args).then(transformResponse, transformError);
});

export default http;
