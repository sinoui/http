/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
} from 'axios';
import { EventEmitter } from 'events';

const eventbus = new EventEmitter();

const HTTP_RESPONSE = 'response';

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
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

export function registerInterceptFunction(fn: any) {
  eventbus.on(HTTP_RESPONSE, fn);
}

export function cancelInterceptFunction(fn: any) {
  eventbus.removeListener(HTTP_RESPONSE, fn);
}

// 处理响应码
const transformResponse = (response: AxiosResponse) => {
  eventbus.emit(HTTP_RESPONSE, response);
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

// 错误处理
const transformError = (error: AxiosError) => {
  eventbus.emit(HTTP_RESPONSE, error.response);
  throw error;
};

function ceateCallAxiosFn(fnName: keyof AxiosInstance) {
  return (...args: any) => {
    return (Axios[fnName] as any)(...args).then(
      transformResponse,
      transformError,
    );
  };
}

const http: HttpInterface = {} as any;

(['get', 'post', 'delete', 'put'] as (keyof HttpInterface)[]).forEach(
  (fnName) => {
    http[fnName] = ceateCallAxiosFn(fnName);
  },
);

export default http;
