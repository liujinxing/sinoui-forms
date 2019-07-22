# sinoui-forms

主要用于表单状态管理。

`useFormState`提供以下功能：

- 表单值变更处理
- 表单校验
- 表单提交
- 嵌套表单
- 表单域值关联

## 依赖安装

```shell
yarn add sinoui-forms
```

或

```shell
npm install --save sinoui-forms
```

## 快速使用

```tsx
import React from 'react';
import useFormState, {
  FormItem,
  Field,
  Label,
  FormStateContext,
} from 'sinoui-forms';
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
    <FormStateContext.Provider value={formState}>
      <FormItem>
        <Label>用户名</Label>
        <Field as="input" name="userName" required />
      </FormItem>
      <FormItem>
        <Label>密码</Label>
        <Field
          as="input"
          name="password"
          required
          compProps={{ type: 'password' }}
        />
      </FormItem>
      <Button onClick={() => formState.onSubmit()}>登录</Button>
    </FormStateContext.Provider>
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
