# 版本变更记录

## v1.0.0-alpha.5

- fix(@sinoui/rx-form-state): useFomrSelect -> useFormSelect
- improve(@sinoui/sinoui-components-forms): 优化 Field 初始化时的二次渲染
- fix: 修复所有模块的 Field 指定 as 组件的属性提示错误的缺陷 (#3)
- fix: 修复@sinoui/sinoui-components-forms 的 Field 组件和@sinoui/web-forms 的 Field 组件无法引用到 as 组件的缺陷，使用`innerRef`即可引用到。
- feat(@sinoui/sinoui-components-forms): Field 组件给 as 组件`error`属性 (#4)

### 破坏性变更

[@sinoui/rx-form-state | Field](https://sinoui.github.io/sinoui-forms-library/api-field-component)的`ref`属性引用不到`as`组件元素，需要换成`innerRef`属性。如下所示：

之前的方式：

```tsx
<Field
  as="input"
  ref={(instance) => {
    instance.focus();
  }}
  name="userName"
/>
```

调整之后的方式：

```tsx
<Field
  as="input"
  innerRef={(instance) => {
    instance.focus();
  }}
  name="userName"
/>
```

## v1.0.0-alpha.4 (2019.8.12)

- fix(@sinoui/sinoui-components-forms): 修复 Field 组件会无限更新的缺陷

## v1.0.0-alpha.3 (2019.8.12)

- fix: 修复 d.ts 文件引用错误

## v1.0.0-alpha.2 (2019.8.12)

补充 homepage、issues page、source repository 配置。

## v1.0.0-alpha.1 (2019.8.12)

v1.0.0-alpha.0 打包错误，重新发布。

## v1.0.0-alpha.0 (2019.8.12)

- feat(@sinoui/rx-form-state): 表单状态管理，包括表单值处理、表单校验、自定义表单域、一次性设置多个表单域的值、表单域值关联、表单提交、嵌套表单等。
- feat(@sinoui/web-forms): 简单封装 html 表单元素。
- feat(@sinoui/sinoui-components-form): 集成 sinoui-components 库的表单及表单域组件的 ui 模块。
