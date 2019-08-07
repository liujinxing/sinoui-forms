import { get } from 'lodash';
import { FormStateModel } from './types';
import useFormSelect from './useFormSelect';

const getFieldsError = (fieldName?: string[]) => (
  formState: FormStateModel,
) => {
  if (fieldName) {
    const fieldError = fieldName.map((name) => {
      const error = get(formState.errors, name);
      const asyncError = get(formState.asyncErrors, name);
      return error || asyncError;
    }) as (string[]);

    if (fieldError.filter(Boolean).length > 0) {
      return fieldError;
    }
  }

  return undefined;
};

/**
 * 获取一组表单域校验错误
 */
function useFieldsError(fieldName?: string[]) {
  return useFormSelect(getFieldsError(fieldName));
}

export default useFieldsError;
