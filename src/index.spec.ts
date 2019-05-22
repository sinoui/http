/* eslint-disable import/no-unresolved */
import mockAxios from 'jest-mock-axios';
import http from './index';

afterEach(() => {
  mockAxios.reset();
});

it('http的基本方法', () => {
  ['get', 'put', 'post', 'delete', 'interceptors'].forEach((methodName) =>
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

it('500响应', async () => {
  expect.assertions(2);

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
});

it('请求发送失败', async () => {
  expect.assertions(2);

  try {
    const promise = http.get('/test');

    expect(mockAxios.get).toHaveBeenCalled();

    mockAxios.mockError(new Error('未知错误'));

    await promise;
  } catch (e) {
    expect(e).toBeDefined();
  }
});
