/* eslint-disable import/no-unresolved */
import mockAxios from 'jest-mock-axios';
import http, {
  registerInterceptFunction,
  cancelInterceptFunction,
} from './index';

afterEach(() => {
  mockAxios.reset();
});

it('http拥有四个基本方法', () => {
  ['get', 'put', 'post', 'delete'].forEach((methodName) =>
    expect(http).toHaveProperty(methodName),
  );
});

it('发送get请求，并获取到响应数据', async () => {
  const promise = http.get('/test');

  expect(mockAxios.get).toHaveBeenCalled();

  mockAxios.mockResponse({
    status: 200,
    data: '123',
  });

  const result = await promise;

  expect(result).toBe('123');
});

it('添加事件监听', async () => {
  const callback = jest.fn();

  registerInterceptFunction(callback);

  const promise = http.get('/123');

  const response = {
    status: 200,
    data: 'data',
  };
  mockAxios.mockResponse(response);

  await promise;

  expect(callback).toHaveBeenCalled();
});

it('取消监听', async () => {
  const callback = jest.fn();

  registerInterceptFunction(callback);

  const promise = http.get('/123');

  cancelInterceptFunction(callback);

  const response = {
    status: 200,
    data: 'data',
  };
  mockAxios.mockResponse(response);

  await promise;

  expect(callback).not.toHaveBeenCalled();
});

it('500响应', async () => {
  expect.assertions(3);
  const errorCallback = jest.fn();

  registerInterceptFunction(errorCallback);

  try {
    const promise = http.get('/test');

    expect(mockAxios.get).toHaveBeenCalled();

    mockAxios.mockResponse({
      status: 500,
      data: 'error stack',
    });

    await promise;
  } catch (e) {
    expect(e.status).toBe(500);
  }

  expect(errorCallback).toBeCalled();
});

it('请求发送失败', async () => {
  expect.assertions(3);
  const errorCallback = jest.fn();

  registerInterceptFunction(errorCallback);

  try {
    const promise = http.get('/test');

    expect(mockAxios.get).toHaveBeenCalled();

    mockAxios.mockError(new Error('未知错误'));

    await promise;
  } catch (e) {
    expect(e).toBeDefined();
  }

  expect(errorCallback).toBeCalled();
});
