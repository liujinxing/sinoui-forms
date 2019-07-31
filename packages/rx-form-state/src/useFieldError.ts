import { memoize, get } from 'lodash';
import { FormStateModel } from './types';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubjectSelect from './utils/useBehaviorSubjectSelect';

const getFieldError = memoize(
  (fieldName?: string) => (formState: FormStateModel) => {
    if (fieldName) {
      const fieldError = get(formState.errors, fieldName) as (
        | string
        | undefined);
      if (fieldError) {
        return fieldError;
      }
    }
    if (fieldName) {
      return get(formState.asyncErrors, fieldName) as (string | undefined);
    }
    return undefined;
  },
);

/**
 * 获取表单域校验错误
 */
function useFieldError(fieldName?: string) {
  const formState = useFormStateContext();
  return useBehaviorSubjectSelect<FormStateModel, string | undefined>(
    formState.formState$,
    getFieldError(fieldName),
  );
}

export default useFieldError;
