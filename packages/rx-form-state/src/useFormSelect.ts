import { useRef } from 'react';
import { FormStateModel } from './types';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from './utils/useBehaviorSubject';

/**
 * 提取表单状态的hook
 *
 * ```tsx
 * const values = useFormSelect(formStateModel => formStateModel.values);
 * ```
 */
function useFormSelect<T, M>(
  selector: (formStateModel: FormStateModel<T>) => M,
) {
  const formState = useFormStateContext();
  const selectorRef = useRef(selector);
  return useBehaviorSubject(formState.formState$, selectorRef.current);
}

export default useFormSelect;
