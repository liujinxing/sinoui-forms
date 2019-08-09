import { useRef } from 'react';
import { FormStateModel, FormState } from './types';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from './utils/useBehaviorSubject';

function useFormSelect<T, M>(
  formState: FormState<T>,
  selector: (FormStateModel: FormStateModel<T>) => M,
): M;
function useFormSelect<T, M>(
  selector: (FormStateModel: FormStateModel<T>) => M,
): M;

/**
 * 提取表单状态的hook
 *
 * ```tsx
 * const values = useFormSelect(formStateModel => formStateModel.values);
 * ```
 *
 * 或者：
 *
 * ```ts
 * const values = useFormSelect(formState, formStateModel => formStateModel.values);
 * ```
 */
function useFormSelect<T, M>(
  formState: FormState<T> | ((formStateModel: FormStateModel<T>) => M),
  selector?: (formStateModel: FormStateModel<T>) => M,
) {
  const formStateFromContext = useFormStateContext();
  const currentFormState =
    typeof formState === 'object' ? formState : formStateFromContext;
  const currentSelector = typeof formState === 'object' ? selector : formState;
  const selectorRef = useRef(currentSelector);
  return useBehaviorSubject(currentFormState.formState$, selectorRef.current);
}

export default useFormSelect;
