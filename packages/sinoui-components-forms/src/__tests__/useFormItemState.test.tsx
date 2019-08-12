import React, { useEffect } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import useFormItemState from '../FormItem/useFormItemState';

it('formItemState被定义', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  expect(result.current).toHaveProperty('id', 1);
  expect(result.current).toHaveProperty('name', 'userName');
});

it('添加Field', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  result.current.addField({ name: 'password' });
  expect(result.current.fields).toEqual([{ name: 'password' }]);
  expect(result.current.fields.length).toBe(1);

  result.current.addField({ name: 'password' });
  expect(result.current.fields.length).toBe(1);
});

it('删除Field', () => {
  const { result } = renderHook(() => useFormItemState('userName'));

  result.current.addField({ name: 'password' });
  result.current.removeField('fav');

  expect(result.current.fields.length).toBe(1);

  result.current.removeField('password');

  expect(result.current.fields.length).toBe(0);
});

it('配置项', () => {
  const { result } = renderHook(() =>
    useFormItemState('userName', {
      inlineProp: true,
      verticalProp: false,
      readOnlyProp: true,
    }),
  );

  expect(result.current.inline).toBeTruthy();
  expect(result.current.vertical).toBeFalsy();
  expect(result.current.readOnly).toBeTruthy();
});

it('循环渲染的问题', () => {
  let count = 0;
  function Wrapper() {
    const { addField, removeField } = useFormItemState('userName', {
      readOnlyProp: false,
    });

    useEffect(() => {
      addField({ name: 'userName' });
      return () => {
        removeField('userName');
      };
    }, [addField, removeField]);

    count += 1;

    return null;
  }

  render(<Wrapper />);

  expect(count).toBe(2);
});
