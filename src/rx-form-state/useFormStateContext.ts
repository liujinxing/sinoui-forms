/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import FormStateContext from './FormStateContext';
import { FormState } from './types';

/**
 * 获取表单状态上下文
 *
 * @template T
 * @returns
 */
function useFormStateContext<T = any>() {
  return useContext<FormState<T>>(FormStateContext as any);
}

export default useFormStateContext;
