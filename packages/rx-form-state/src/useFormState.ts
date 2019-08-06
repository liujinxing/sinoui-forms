/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { FormStateOptions } from './types';
import createFormState from './createFormState';
import useValueRef from './utils/useValueRef';

interface Options<T> extends FormStateOptions<T> {
  /**
   * 是否监听初始化值变化。默认为true
   */
  enableReinitialize?: boolean;
}

/**
 * 创建表单状态的hook
 *
 * @param initialValues 表单初始值
 * @param options 表单配置
 */
function useFormState<T = any>(
  initialValues: T = {} as any,
  options?: Options<T>,
) {
  const optionsRef = useValueRef(options);
  const initialValuesRef = useValueRef(initialValues);

  const formState = useMemo(
    () => createFormState(initialValuesRef.current, optionsRef.current),
    [initialValuesRef, optionsRef],
  );

  if (
    !(options && options.enableReinitialize !== false) &&
    initialValues !== formState.values$.value &&
    !isEqual(initialValues, formState.values$.value)
  ) {
    formState.setValues(initialValues);
  }

  return formState;
}

export default useFormState;
