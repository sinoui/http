/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInterceptorManager,
} from 'axios';

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

  /**
   * 请求、响应拦截器、转换器
   */
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}

// 处理响应码
const transformResponse = (response: AxiosResponse) => {
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

function ceateCallAxiosFn(fnName: keyof AxiosInstance) {
  return (...args: any) => {
    return (Axios[fnName] as any)(...args).then(transformResponse);
  };
}

const http: HttpInterface = {} as any;

(['get', 'post', 'delete', 'put'] as (keyof HttpInterface)[]).forEach(
  (fnName) => {
    http[fnName] = ceateCallAxiosFn(fnName);
  },
);

http.interceptors = Axios.interceptors;

export default http;
