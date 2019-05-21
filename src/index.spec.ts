/* eslint-disable import/no-unresolved */
import mockAxios from 'jest-mock-axios';
import http, {
  registerInterceptFunction,
  cancelInterceptFunction,
} from './index';

afterEach(() => {
  mockAxios.reset();
});

it('http.get ha been called', async () => {
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
