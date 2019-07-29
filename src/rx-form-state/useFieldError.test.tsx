import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import useFieldError from './useFieldError';

it('校验通过时，表单域错误提示为空', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(() => useFieldError('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBeUndefined();
});

it('校验不通过时，获取到表单域错误提示', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      userName: '必填',
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(() => useFieldError('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBe('必填');
});

it('异步校验不通过时，获取到表单域错误提示', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setAsyncErrors({
      userName: '此用户名已存在',
    });
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(() => useFieldError('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBe('此用户名已存在');
});

it('既有表单校验错误，又有异步校验错误时，获取到的表单域错误提示是表单校验错误', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      userName: '必填',
    });

    formState.setAsyncErrors({
      userName: '此用户名已存在',
    });
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(() => useFieldError('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBe('必填');
});

it('获取嵌套表单的验证错误', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      address: {
        city: '必填',
      },
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(() => useFieldError('address.city'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBe('必填');
});
