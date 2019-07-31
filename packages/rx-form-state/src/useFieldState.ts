import useBehaviorSubject from './utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

/**
 * 获取表单域状态
 *
 * @param fieldName 表单域名称
 */
function useFieldState<T>(fieldName: string) {
  const formState = useFormStateContext();
  return useBehaviorSubject(formState.getFieldState$<T>(fieldName));
}

export default useFieldState;
