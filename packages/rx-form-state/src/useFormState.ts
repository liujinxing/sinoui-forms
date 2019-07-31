/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { FormStateErrors } from './types';
import createFormState from './createFormState';
import useValueRef from './utils/useValueRef';

interface Options<T> {
  validate?: (values: T) => FormStateErrors | undefined;
  onSubmit?: (values: T) => Promise<any> | void;
}

function useFormState<T = any>(initialValues?: T, options?: Options<T>) {
  const optionsRef = useValueRef(options);
  const initialValuesRef = useValueRef(initialValues);

  const formState = useMemo(
    () => createFormState(initialValuesRef.current, optionsRef.current),
    [initialValuesRef, optionsRef],
  );

  return formState;
}

export default useFormState;
