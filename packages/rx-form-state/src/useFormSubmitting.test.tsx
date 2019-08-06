import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useFormSubmitting from './useFormSubmitting';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';

it('获取submitting状态', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    const formState = useFormState();

    formState.setSubmitting(true);

    return (
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    );
  };

  const { result } = renderHook(() => useFormSubmitting(), {
    wrapper: Wrapper,
  });

  expect(result.current).toBe(true);
});

it('从已知的formState中获取submitting状态', () => {
  const { result } = renderHook(() => {
    const formState = useFormState();
    formState.setSubmitting(true);

    return useFormSubmitting(formState);
  });

  expect(result.current).toBe(true);
});
