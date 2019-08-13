import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import createFormItemContext from './createFormItemContext';

it('创建表单项上下文', () => {
  const formItemContext = createFormItemContext({
    fields: [],
    id: 1,
    readOnly: false,
    inline: true,
    vertical: false,
  });

  const { result } = renderHook(() => formItemContext.useFormItem());

  expect(result.current.readOnly).toBe(false);
  expect(result.current.inline).toBe(true);
  expect(result.current.vertical).toBe(false);

  act(() => {
    formItemContext.addField({
      name: 'userName',
      disabled: true,
      readOnly: true,
      required: true,
    });
  });

  expect(result.current.name).toBe('userName');
  expect(result.current.disabled).toBe(true);
  expect(result.current.readOnly).toBe(false);
  expect(result.current.required).toBe(true);

  act(() => {
    formItemContext.setFormItemProps({
      name: 'firstName',
      disabled: false,
      readOnly: true,
    });
  });

  expect(result.current.name).toBe('firstName');
  expect(result.current.disabled).toBe(false);
  expect(result.current.readOnly).toBe(true);
});

it('重复添加表单域', () => {
  const formItemContext = createFormItemContext();

  const { result } = renderHook(() => formItemContext.useFormItem());

  act(() => {
    formItemContext.addField({
      name: 'userName',
      readOnly: true,
    });

    formItemContext.addField({
      name: 'userName',
      disabled: true,
    });
  });

  expect(result.current.name).toBe('userName');
  expect(result.current.disabled).toBe(true);
  expect(result.current.readOnly).toBe(undefined);
});

it('移除表单域', () => {
  const formItemContext = createFormItemContext({
    id: 1,
    fields: [
      {
        name: 'userName',
      },
    ],
  });

  const { result } = renderHook(() => formItemContext.useFormItem());

  act(() => {
    formItemContext.removeField('userName');
  });

  expect(result.current.name).toBe(undefined);

  // 删除不存在的表单域，不会导致程序崩溃
  act(() => {
    formItemContext.removeField('userName');
  });
});

it('获取表单项属性', () => {
  const formItemContext = createFormItemContext({
    fields: [],
    id: 1,
    readOnly: false,
    inline: true,
    vertical: false,
  });

  const { result } = renderHook(() => formItemContext.useFormItemProps());

  expect(result.current).toEqual({
    id: 1,
    readOnly: false,
    inline: true,
    vertical: false,
  });
});
