import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import useFormSelect from './useFormSelect';
import createFormState from './createFormState';

it('获取表单状态', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState({
      userName: '张三',
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(
    () => useFormSelect((formStateModel) => formStateModel.values),
    { wrapper: Wrapper },
  );

  expect(result.current).toEqual({
    userName: '张三',
  });
});

it('从指定的formState中获取状态', () => {
  const formState = createFormState({
    userName: '张三',
  });
  const { result } = renderHook(() =>
    useFormSelect(formState, (formStateModel) => formStateModel.values),
  );

  expect(result.current).toEqual({
    userName: '张三',
  });
});
