/* eslint-disable no-param-reassign */
import Axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
} from 'axios';
import qs from 'qs';

export interface HttpInterface extends AxiosInstance {
  /**
   * 获取
   *
   * @memberof HttpInterface
   */
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  /**
   * 删除
   *
   * @memberof HttpInterface
   */
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  /**
   * post，用于新增
   *
   *
   * @memberof HttpInterface
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  /**
   * put，用于更新
   *
   *
   * @memberof HttpInterface
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;

  /**
   * 添加响应失败的监听
   *
   * @param callback 处理响应失败的回调函数
   */
  onFailure(callback: (error: AxiosError) => void): number;
  /**
   * 添加response拦截
   *
   * @memberof HttpInterface
   */
  onResponse: (callback: ResponseCallback) => () => ResponseCallback[];
}

type ResponseCallback = (res: AxiosResponse) => number;

const http = Axios.create() as HttpInterface;

// 声明定义的reponse拦截器方法集合
const responseCallbacks: ResponseCallback[] = [];

http.onResponse = (callback: ResponseCallback) => {
  responseCallbacks.push(callback);
  return () => responseCallbacks.filter((fn) => fn !== callback);
};

// 处理响应码
export const transformResponse = (response: AxiosResponse) => {
  responseCallbacks.forEach((fn) => fn(response));
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

http.interceptors.response.use(transformResponse);

/**
 * request拦截器，添加params编译方法
 * @param config
 * @returns
 */
export const transformRequestParams = (config: AxiosRequestConfig) => {
  if (!config.paramsSerializer) {
    config.paramsSerializer = qs.stringify;
  }
  return config;
};

http.interceptors.request.use(transformRequestParams);

http.onFailure = (callback: (error: AxiosError) => void) => {
  return http.interceptors.response.use(undefined, (error) => {
    callback(error);
    throw error;
  });
};

export default http;

export {
  AxiosRequestConfig as HttpRequestConfig,
  AxiosResponse as HttpResponse,
};
