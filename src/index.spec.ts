import http from './index';

it('http.get ha been called', () => {
  http.get('/123');
  expect(http.get).toBeCalled();
});
