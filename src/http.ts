import Axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosError,
} from 'axios';

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
}

const http = Axios.create() as HttpInterface;

// 处理响应码
export const transformResponse = (response: AxiosResponse) => {
  if (response.status < 400 && response.status >= 200) {
    return response.data;
  }
  throw response;
};

http.interceptors.response.use(transformResponse);

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
