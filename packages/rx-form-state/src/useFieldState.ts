import useBehaviorSubject from './utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';
import { FieldModel } from './types';

/**
 * 获取表单域状态
 *
 * @param fieldName 表单域名称
 */
function useFieldState<T>(fieldName: string): FieldModel<T> {
  const formState = useFormStateContext();
  return useBehaviorSubject(formState.getFieldState$<T>(fieldName));
}

export default useFieldState;
