# @sinoui/http

@sinoui/http 封装的是[Axios](https://github.com/axios/axios)库提供的方法。此次封装只是一次轻量级无损封装，没有破坏 Axios 库的方法调用方式和传参方式。这里我们只是对常用的几种请求方式进行描述，如需更多了解，可移步到[Axios 官网](http://www.axios-js.com/zh-cn/docs/)。

## 安装

执行下面命令即可快速安装：

- 使用 npm

  ```shell
  npm install --save @sinoui/http
  ```

- 使用 yarn

  ```shell
  yarn add @sinoui/http
  ```

## http 请求方式

- DELETE
- GET 通常用来做数据查询
- POST
- PUT

## http 方法

- GET

  get 请求形成的 url 一般为`http://url?userId=123&userName=zhang`，传递参数时一般是如下方式：

  ```js
  http
    .get(url, { params: { userId, userName } })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  ```

- POST

  post 一般用于创建数据，或者执行特别复杂的查询时。

  post 请求一般会携带一些**请求体**内容，如果需要通过 post 发送内容给服务端，一般采用 json 格式。如下：

  ```js
  const data = { list: [] }; // data是一个对象
  // data会在给服务器发送http请求时，自动编码为json字符串，传递给后端
  http
    .post(url, data)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  ```

- PUT

  put 一般用于更新数据时使用。put 方法的请求体规则与 post 类似。

  ```js
  const id = 'xxxx';
  const data = { list: [] }; // data是一个对象
  // data会在给服务器发送http请求时，自动编码为json字符串，传递给后端
  http
    .put(`url/${id}`, data)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  ```

- DELETE

  delete 一般用于资源删除。delete 一般不允许携带任何请求内容。

  ```js
  http
    .delete(`url/${id}`)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  ```

## http 数据传递

目前有三种数据传递方式：

- 请求参数
- 路径参数
- 请求体

### 请求参数

请求参数一般用于传递查询参数、过滤条件，也会在更新、删除请求中用于传递一些独立的参数。如：

http://url/todos/456?page=0&size=15

上面的 url 中，有两个请求参数，即`page`和`size`,分别是`0`和`15`.对应如下代码：

```js
const id = 'xxx';
const page = 0;
const size = 15;
http
  .get(`url/${id}`, { params: { page, size } })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

在 POST、PUT、DELETE 时传递请求参数时，要格外小心，应该以如下的方式传递请求参数：

```js
const id = 'xxx';
const jsbm = '部门1，部门2';

http
  .post(`url/${id}?jsbm=${jsbm}`)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

如果在 POST、PUT、DELETE 时传递的请求参数特别多时，应该以如下方式传递请求参数：

```js
const id = 'xxx';
const data = { list: [] }; // data是一个对象
const params = {}; // 多个查询条件的对象集合

http
  .post(`url/${id}`, data, { params })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### 路径参数

路径参数一般用于在 url 路径部分添加资源 id，如下所示：

```js
const userId = 'xxx';
http
  .put(`/xxx/${userId}`)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### 请求体

我们在实际业务场景中，频繁使用一种请求体格式，即`application/json`。`http`已经做了 json 的自动处理，只需要在`post`、`put`方法的第二个参数传递一个对象，`http`就会自动将此 js 对象转换成 JSON 字符串传递给后端。

```js
const condition = [
  {
    field: 'bt',
    value: '标题',
    operator: '%like%',
  },
  {
    filed: 'gwlxId',
    value: 'hfw',
    operator: '=',
  },
];

const requestBody = { condition };
http
  .get(url, requestBody)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

**谨记：** 在做实际开发时，一定要仔细阅读相关 API 约束，确定需要传递参数的数据结构。
