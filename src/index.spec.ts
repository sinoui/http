/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import nock from 'nock';
import { transformResponse } from './http';
import http from './index';

it('transform response', () => {
  const response: AxiosResponse = {
    status: 200,
    data: 'responseData',
  } as any;

  expect(transformResponse(response)).toBe('responseData');
});

it('transform error', () => {
  expect.assertions(1);
  const response: AxiosResponse = {
    status: 401,
    data: 'responseData',
  } as any;

  try {
    transformResponse(response);
  } catch (e) {
    expect(e).toBe(response);
  }
});

describe('interceptors', () => {
  beforeEach(() => {
    nock('http://localhost')
      .get('/test')
      .reply(200, '"200"');

    nock('http://localhost')
      .get('/error')
      .reply(401, '401');
  });

  it('200', async () => {
    const response = await http.get('http://localhost/test');

    expect(response).toBe('200');
  });

  it('401', async () => {
    expect.assertions(1);
    try {
      await http.get('http://localhost/error');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('transform response', async () => {
    const mockTransformResponse = jest.fn();
    mockTransformResponse.mockReturnValue('201');
    const response = await http.get('http://localhost/test', {
      transformResponse: mockTransformResponse,
    });

    expect(response).toBe('201');
    expect(mockTransformResponse).toBeCalledWith('"200"', expect.anything());
  });

  it('another response interceptor', async () => {
    const mockResponseInterceptor = jest.fn();
    mockResponseInterceptor.mockReturnValue('interceptor');
    const id = http.interceptors.response.use(mockResponseInterceptor);

    const response = await http.get('http://localhost/test');

    expect(response).toBe('interceptor');
    expect(mockResponseInterceptor).toBeCalledWith('200');

    http.interceptors.response.eject(id);
  });

  it('another response error interceptor', async () => {
    const mockResponseErrorInterceptor = jest.fn();
    mockResponseErrorInterceptor.mockReturnValue('error');
    const id = http.interceptors.response.use(
      undefined,
      mockResponseErrorInterceptor,
    );

    const response = await http.get('http://localhost/error');

    expect(response).toBe('error');
    expect(mockResponseErrorInterceptor).toBeCalled();
    expect(mockResponseErrorInterceptor.mock.calls[0][0].response.status).toBe(
      401,
    );

    http.interceptors.response.eject(id);
  });
});

describe('onFailure', () => {
  beforeEach(() => {
    nock('http://localhost')
      .get('/error')
      .reply(401, '401');
  });

  it('监听响应错误', async () => {
    const mockResponseErrorInterceptor = jest.fn();
    mockResponseErrorInterceptor.mockReturnValue('error');
    const id = http.onFailure(mockResponseErrorInterceptor);
    await expect(http.get('http://localhost/error')).rejects.toThrow();
    http.interceptors.response.eject(id);
  });
});
