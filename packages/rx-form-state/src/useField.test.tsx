import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useField from './useField';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';

it('获取并更新表单域状态', async () => {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    const formState = useFormState();
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  }

  const { result } = renderHook(() => useField<string>('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current.value).toBe(undefined);

  result.current.addField({ name: 'userName', validate: () => '必填' });
  result.current.validateField();
  expect(result.current.error).toBe('必填');

  result.current.setFieldState((draft) => {
    draft.error = '长度不能超过10';
  });

  result.current.blur();
  expect(result.current.isTouched).toBe(true);

  result.current.setFieldTouched(false);
  expect(result.current.isTouched).toBe(false);

  result.current.setFieldTouched();
  expect(result.current.isTouched).toBe(true);

  result.current.setError();
  expect(result.current.error).toBe(undefined);

  result.current.setFieldPending(true);
  expect(result.current.isPending).toBe(true);

  result.current.setAsyncError('已存在');
  expect(result.current.asyncError).toBe('已存在');
});
