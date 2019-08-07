import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import useFieldsError from './useFieldsError';

it('校验通过时，获取一组表单的错误提示', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(() => useFieldsError(['userName', 'sex']), {
    wrapper: Wrapper,
  });

  expect(result.current).toBeUndefined();
});

it('校验不通过时，获取到一组表单域错误提示', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      userName: '必填',
      sex: '必须选择男或女',
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(
    () => useFieldsError(['userName', 'sex', 'age']),
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current).toEqual(['必填', '必须选择男或女', undefined]);
});

it('异步校验不通过时，获取一组表单域的错误提示', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setAsyncErrors({
      userName: '此用户名已存在',
      age: '年龄与已有资料不符',
    });
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(() => useFieldsError(['userName', 'age']), {
    wrapper: Wrapper,
  });

  expect(result.current).toEqual(['此用户名已存在', '年龄与已有资料不符']);
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
  const { result } = renderHook(() => useFieldsError(['userName']), {
    wrapper: Wrapper,
  });

  expect(result.current).toEqual(['必填']);
});

it('既有表单校验错误，又有异步校验错误时，获取一组既有同步错误又有异步错误的验证错误', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      password: '密码长度不应少于6位字符',
    });

    formState.setAsyncErrors({
      userName: '用户名已经存在',
    });
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(
    () => useFieldsError(['userName', 'password']),
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current).toEqual(['用户名已经存在', '密码长度不应少于6位字符']);
});

it('获取嵌套表单的验证错误', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      address: {
        city: '必填',
        street: '必填',
      },
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };
  const { result } = renderHook(
    () => useFieldsError(['address.city', 'address.street']),
    {
      wrapper: Wrapper,
    },
  );

  expect(result.current).toEqual(['必填', '必填']);
});

xit('验证重绘时的表单校验错误', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setErrors({
      userName: '必填',
      password: '必填',
    });

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result, rerender } = renderHook(
    (props?: string[]) => useFieldsError(props),
    {
      wrapper: Wrapper,
      initialProps: ['userName'],
    },
  );

  expect(result.current).toEqual(['必填']);

  rerender(['userName', 'password']);

  expect(result.current).toEqual(['必填', '必填']);
});
