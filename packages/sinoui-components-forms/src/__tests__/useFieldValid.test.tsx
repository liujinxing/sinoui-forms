/* eslint-disable import/no-unresolved */
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useFormState, FormStateContext } from '@sinoui/rx-form-state';
import useFieldValid from '../useFieldValid';

it('校验通过时，返回true', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(() => useFieldValid('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBeTruthy();
});

it('校验不通过,但touched为false时，返回true', () => {
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

  const { result } = renderHook(() => useFieldValid('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBeTruthy();
});

it('校验错误且touched为true时，返回false', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();
    formState.setErrors({
      userName: '必填',
    });
    formState.setTouched({ userName: true });
    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(() => useFieldValid('userName'), {
    wrapper: Wrapper,
  });

  expect(result.current).toBeFalsy();
});
