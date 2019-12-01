# @sinoui/http

[![npm version](https://img.shields.io/npm/v/@sinoui/http)](https://www.npmjs.com/package/@sinoui/http) [![downloads](https://img.shields.io/npm/dm/@sinoui/http)](https://www.npmjs.com/package/@sinoui/http)

@sinoui/http 封装的是[Axios](https://github.com/axios/axios)库提供的方法。这是一次轻量级无损封装，没有破坏 Axios 库的方法调用方式和传参方式。这里我们只是对常用的几种请求方式进行描述，如需更多了解，可移步到[Axios 官网](http://www.axios-js.com/zh-cn/docs/)。

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
  async function get() {
    try {
      const result = await http.get(url, { params: { userId, userName } });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  ```

- POST

  post 一般用于创建数据，或者执行特别复杂的查询时。

  post 请求一般会携带一些**请求体**内容，如果需要通过 post 发送内容给服务端，一般采用 json 格式。如下：

  ```js
  async function post() {
    const data = { userName: 'John' }; // data是一个对象
    // data会在给服务器发送http请求时，自动编码为json字符串，传递给后端
    try {
      const result = await http.post(url, data);
      console.log(result);
    } catch (error) {
      console.error(errro);
    }
  }
  ```

- PUT

  put 一般用于更新数据时使用。put 方法的请求体规则与 post 类似。

  ```js
  async function put() {
    const id = 'xxxx';
    const data = { id: 'xxxx', userName: 'John' }; // data是一个对象
    try {
      // data会在给服务器发送http请求时，自动编码为json字符串，传递给后端
      const result = await http.put(`url/${id}`, data);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  ```

- DELETE

  delete 一般用于资源删除。delete 一般不允许携带任何请求内容。

  ```js
  async function remove() {
    try {
      const result = await http.delete(`url/${id}`);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
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
async function get() {
  const id = 'xxx';
  const page = 0;
  const size = 15;

  try {
    const result = await http.get(`url/${id}`, { params: { page, size } });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

在 POST、PUT、DELETE 时传递请求参数时，要格外小心，应该以如下的方式传递请求参数：

```js
async function main() {
  const id = 'xxx';
  const jsbm = '部门1，部门2';

  try {
    const result = await http.post(`url/${id}?jsbm=${jsbm}`);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

如果在 POST、PUT、DELETE 时传递的请求参数特别多时，应该以如下方式传递请求参数：

```js
async function main() {
  const id = 'xxx';
  const data = { list: [] }; // data是一个对象
  const params = {}; // 多个查询条件的对象集合

  try {
    const result = await http.post(`url/${id}`, data, { params });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

### 路径参数

路径参数一般用于在 url 路径部分添加资源 id，如下所示：

```js
async function main() {
  const userId = 'xxx';
  try {
    const result = await http.put(`/xxx/${userId}`);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

### 请求体

我们在实际业务场景中，频繁使用一种请求体格式，即`application/json`。`http`已经做了 json 的自动处理，只需要在`post`、`put`方法的第二个参数传递一个对象，`http`就会自动将此 js 对象转换成 JSON 字符串传递给后端。

```js
async function main() {
  const requestBody = { userName: 'jacking' };

  try {
    const result = await http.post(url, requestBody);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

**谨记：** 在做实际开发时，一定要仔细阅读相关 API 约束，确定需要传递参数的数据结构。

## 拦截器、转换器

http 采用与[Axios Interceptors](https://github.com/axios/axios#interceptors)同样的 API，做请求和响应的拦截与转换。

### 例子：拦截 401

```ts
import http from '@sinoui/http';

http.onFailure((error) => {
  if (error.response && error.response.status === 401) {
    console.log('需要登录才能访问此接口');
    // 跳转到登录页
  }
});
```

与 React 项目的结合请参见 [在 React 项目中添加 401 拦截器](#在-react-项目中添加-401-拦截器)。

### 例子：统一添加 userToken

```ts
import http from '@sinoui/http';

http.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers.userToken = '123';

  return config;
});
```

### `onFailure` vs `interceptors`

我们可以通过 `http.onFailure(failureCallback)` 或者 `http.interceptors.response.use(undefined, failureCallback)` 添加 http 响应失败的回调函数。但是有细微差别。

`onFailure` 用来监听响应失败，但不能将失败的响应转换成正确的响应，非常适合做安全拦截这种场景。但是 `interceptors` 则可以将失败的响应转换成正确的响应，例如从缓存中拿数据。

`onFailure` 内部使用的是 `interceptors`，所以`onFailure` 可以转化为 `interceptors`：

```ts
import http from '@sinoui/http';

http.onFailure((error) => {
  console.log('http出错');
});
```

相当于：

```ts
import http from '@sinoui/http';

http.interceptors.response.use(undefined, (error) => {
  console.log('http出错');

  throw error; // ⚠ 这里必须抛出 error，要不然 axios 会将失败响应当成成功响应处理
});
```

### 取消拦截器

```ts
import http from '@sinoui/http';

const interceptorId = http.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers.userToken = '123';

  return config;
});

http.interceptors.request.eject(interceptorId);
```

注意：使用 interceptors 时，需要返回`response`或者`config`。

### 取消 `onFailure`

```ts
import http from '@sinoui/http';

const interceptorId = http.onFailure((error) => {
  console.log('http出错');
});

http.interceptors.response.eject(interceptorId);
```

## @sinoui/http 与 Axios 的区别

`@sinoui/http`只是对于`Axios`的简单轻量级封装，区别如下：

- http 简化了响应和状态码的处理。在响应码为`200~400(包含200，不包含400)`，http 会直接返回响应数据，而 axios 则返回整个响应对象`(response)`
- http 只支持单例应用(全局只有一个 http 对象);而`axios`既支持单例使用，又支持创建对象的方式使用，也就是说，axios 可以实现在同一个应用中不同模块使用不同的 axios 配置、拦截器之类的。

## 上传文件

建议使用 [@sinoui/http-send-file](https://github.com/sinoui/http-send-file) 上传文件。

建议使用 [send-big-file](https://github.com/sinouiincubator/send-big-file) 分片上传大文件。

### 上传单个文件

`html`文件：

```html
<html>
  <body>
    <input id="file" type="file" />
    <input type="button" value="文件上传" onclick="uploadFile()" />
  </body>
</html>
```

对应的 js 文件：

```js
import http from '@sinoui/http';

async function uploadFile() {
  const file = document.getElementById('file').files[0];
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    await http.post('url', formData, config);
    console.log('上传成功');
  } catch (error) {
    console.error('上传失败');
  }
}
```

### 上传多个文件

`html`文件：

```html
<html>
  <body>
    <input id="file" type="file" multiple />
    <input type="button" value="文件上传" onclick="uploadFiles()" />
  </body>
</html>
```

对应的 js 文件：

```js
import http from '@sinoui/http';

async function uploadFiles() {
  const files = document.getElementById('file').files;
  const formData = new FormData();

  files.forEach((file, index) => formData.append(`files[${index}]`, file));

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    await http.post('url', formData, config);
    console.log('上传成功');
  } catch (error) {
    console.error('上传失败');
  }
}
```

### 从表单中获取文件数据

`index.html`:

```html
<html>
  <body>
    <form id="userForm">
      <input type="text" name="userName" placeholder="请输出用户名" />
      <input
        type="file"
        name="userPhotos"
        multiple
        placeholder="选择文件图像"
      />
      <input type="button" value="文件上传" onclick="uploadFiles()" />
    </form>
    <script src="index.js"></script>
  </body>
</html>
```

`index.js`:

```js
import http from '@sinoui/http';

async function uploadFiles() {
  const formData = new FormData(document.getElementById('userForm'));
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    await http.post('url', formData, config);
    console.log('上传成功');
  } catch (error) {
    console.error('上传失败');
  }
}
```

## 在 React 项目中添加 401 拦截器

401 响应代表 “用户没有有效身份信息”，我们可以监听 401 响应，并跳转到登录页。

我们需要在 React 项目靠近顶层的地方添加 401 拦截器，确保在发出任何 http 请求之前就设置了 401 拦截器。假设项目采用 [react-router](https://github.com/ReactTraining/react-router) 做路由管理，且 401 时跳转到登录页。

首先定义一个 `AuthInterceptor` 组件：

```ts
import React, { useEffect } from 'react';
import http from '@sinoui/http';
import { withRouter } from 'react-router';
import { History } from 'history';=

const AuthInterceptor: React.SFC<{ history: History }> = ({ history }) => {
  useEffect(() => {
    const interceptorId = http.onFailure((error) => {
      if (error.response && error.response.status === 401) {
        history.push('/login'); // 跳转到登录页
      }
    });
    return () => http.interceptors.response.eject(interceptorId);
  }, [history]);

  return null;
};

export default withRouter(AuthInterceptor);
```

在 `App` 组件中使用：

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import AuthInterceptor from './components/AuthInterceptor';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        // 一定要在 Router 组件之中使用。因为 AuthInterceptor 使用了 withRouter
        <AuthInterceptor />
        <Router path="/login" component={Login} />
        <Router path="/admin" component={AdminPage} />
      </BrowserRouter>
    </div>
  );
}
```

## 下载二进制数据

默认情况下，@sinoui/http 会将响应数据当成 JSON 数据处理。但是可以通过 `responseType` 属性指定响应数据的类型，如下所示，下载图片数据：

```ts
import http from '@sinoui/http';

const imageData = await http.get<Blob>('/image/1.png', {
  responseType: 'blob',
});

// 将二进制数据生成对象链接
const imageSrc = URL.createObjectURL(imageData);

// 将生成的图片url指定给图片元素
<img src={imageSrc} />;
```

`responseType` 有如下选项：

- `json` - 将响应数据当成 JSON 解析。这是默认的选项。
- `text` - 将响应数据当成纯文本解析。
- `blob` - 将响应数据当成二进制数据处理，并包装成 Blob 对象。只能在浏览器端使用。
- `arraybuffer` - 将响应数据当成二进制数据处理，并包装成 ArrayBuffer 对象。
- `document` - 将响应数据当成 DOM 元素解析。
- `stream` - 将响应数据当成二进制数据处理，并包装成 Node.js 的 stream 对象。
