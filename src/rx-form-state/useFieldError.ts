import { memoize } from 'lodash';
import { FormStateModel } from './types';
import useBehaviorSubject from '../utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

const getFieldError = memoize(
  (fieldName: string) => (formState: FormStateModel) => {
    if (fieldName && formState.errors[fieldName]) {
      return formState.errors[fieldName];
    }
    if (fieldName) {
      return formState.asyncErrors[fieldName];
    }
    return null;
  },
);

/**
 * 获取表单域校验错误
 */
function useFieldError(fieldName: string) {
  const formState = useFormStateContext();
  return useBehaviorSubject<FormStateModel, string>(
    formState.formState$,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getFieldError as any)(fieldName),
  );
}

export default useFieldError;
