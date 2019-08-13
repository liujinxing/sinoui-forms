import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useFormItemState from '../FormItem/useFormItemState';
import SinouiFormStateContext from '../SinouiFormStateContext';

it('formItemState被定义', () => {
  const { result, rerender } = renderHook((name: string = 'userName') =>
    useFormItemState({ name }).useFormItem(),
  );

  expect(result.current).toHaveProperty('id', 1);
  expect(result.current).toHaveProperty('name', 'userName');

  // 更新配置
  act(() => {
    rerender('firstName');
  });

  expect(result.current.name).toBe('firstName');
});

it('从表单上下文中获取布局元素', () => {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    const context = { inline: true, vertical: false, colon: false };
    return (
      <SinouiFormStateContext.Provider value={context}>
        {children}
      </SinouiFormStateContext.Provider>
    );
  }
  const { result } = renderHook(() => useFormItemState().useFormItem(), {
    wrapper: Wrapper,
  });

  expect(result.current.inline).toBe(true);
  expect(result.current.vertical).toBe(false);
});
