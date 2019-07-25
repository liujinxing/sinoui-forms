import { useMemo } from 'react';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from '../utils/useBehaviorSubject';
import { FieldStateModel } from './types';

/**
 * 使用表单域
 *
 * @template T
 * @param {string} fieldName
 * @returns
 */
function useField<T>(fieldName: string) {
  const formState = useFormStateContext();
  const fieldState = useBehaviorSubject<FieldStateModel<T>>(
    formState.getFieldState$(fieldName),
  );
  const fieldActions = useMemo(() => {
    return {
      addField: formState.addField,
      removeField: formState.removeField,
      setFieldValue: (value: T) => formState.setFieldValue(fieldName, value),
      blur: () => formState.blur(fieldName),
      validateField: () => formState.validateField(fieldName),
      setFieldState: (producer: (draft: FieldStateModel<T>) => void) =>
        formState.setFieldState(fieldName, producer),
      setFieldTouched: (isTouched = true) =>
        formState.setFieldTouched(fieldName, isTouched),
      setError: (error?: string) => formState.setFieldError(fieldName, error),
      setAsyncError: (asyncError?: string) =>
        formState.setFieldAsyncError(fieldName, asyncError),
      setFieldPending: (isPending: boolean) =>
        formState.setFieldPending(fieldName, isPending),
    };
  }, [fieldName, formState]);

  return useMemo(
    () => ({
      formState,
      ...fieldState,
      ...fieldActions,
    }),
    [fieldActions, fieldState, formState],
  );
}

export default useField;
