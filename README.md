# sinoui-forms-library

用于表单状态管理的库：

- @sinoui/rx-form-state - 表单状态管理库，可以用于 react、react-native 的表单状态管理库
- @sinoui/sinoui-components-forms - 适配 sinoui-components 的表单组件库

`@sinoui/rx-form-state`支持以下特性：

- 便捷的表单值处理
- 表单校验、异步校验
- 表单提交
- 嵌套表单
- 表单值关联
- 可以有任何 UI 库、组件结合使用

@sinoui/rx-form-state 内部采用的是局部状态管理，表单域的值变更只会引起表单域本身重绘，不会扩散到整个表单。这从根本上解决了大部分表单状态管理库面临的性能问题。开发人员不需要掌握 React 性能优化的知识点，就能开发出复杂的、性能优越的表单应用。

更多特性和用法查看[官方文档](https://sinoui.github.io/sinoui-forms-library/)。

## 依赖安装

```shell
yarn add @sinoui/rx-form-state @sinoui/sinoui-components-forms
```

或

```shell
npm install --save @sinoui/rx-form-state @sinoui/sinoui-components-forms
```

## 快速使用

示例采用了 sinoui-components 库，需要安装以下依赖才可运行：

```shell
yarn add styled-components@3.4.10
```

示例：

```tsx
import React from 'react';
import { useFormState } from '@sinoui/rx-form-state';
import {
  Form,
  FormItem,
  Field,
  Label,
  TextInput,
} from '@sinoui/sinoui-components-forms';
import Button from 'sinoui-components/Button';
import http from '@sinoui/http';

function validate(values: any) {
  let error: any = {};

  if (values.password && values.password.length < 8) {
    error['password'] = '不能少于8个字符';
  }

  return error;
}

const onSubmit = (values: any) => {
  http.post('/test/login', values);
};

function FormDemo() {
  const defaultValues = {};
  const formState = useFormState(defaultValues, { validate, onSubmit });

  return (
    <Form formState={formState}>
      <FormItem>
        <Label>用户名</Label>
        <TextInput name="userName" required />
      </FormItem>
      <FormItem>
        <Label>密码</Label>
        <TextInput type="password" name="password" required />
      </FormItem>
      <Button onClick={() => formState.onSubmit()}>登录</Button>
    </Form>
  );
}
```

## 本地开发

项目中有以下有用的命令。

### `yarn start`

在开发和监听模式下启动项目。当代码发生变化时就会重新编译代码。它同时会实时地向你汇报项目中的代码错误。

### `yarn build`

打包，并将打包文件放在`dist`文件夹中。使用 rollup 对代码做优化并打包成多种格式（`Common JS`，`UMD`和`ES Module`）。

### `yarn lint`

`yarn lint`会检查整个项目是否有代码错误、风格错误。

开启 vscode 的 eslint、prettier 插件，在使用 vscode 编码时，就会自动修正风格错误、提示语法错误。

### `yarn format`

`yarn format`可以自动调整整个项目的代码风格问题。

### `yarn test`

`yarn test`以监听模式启动 jest，运行单元测试。

开启 vscode 的 jest 插件，会在文件变化时自动运行单元测试。

### 添加模块

```shell
yarn gen my-ts-module
```

### 预览文档

```shell
yarn doc:dev
```

### 编译并打包文档

```shell
yarn doc:publish
```

### 发布文档

```shell
yarn doc:publish
```
