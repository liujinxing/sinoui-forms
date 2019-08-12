import { useMemo } from 'react';
import useFormStateContext from './useFormStateContext';
import { FieldStateModel, FieldModel } from './types';
import useFieldState from './useFieldState';

/**
 * 使用表单域
 *
 * @template T
 * @param {string} fieldName
 * @returns
 */
function useField<T>(fieldName: string): FieldModel<T> {
  const formState = useFormStateContext();
  const fieldState = useFieldState<T>(fieldName);
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
