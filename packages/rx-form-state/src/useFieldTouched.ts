import useBehaviorSubject from './utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

/**
 * 获取表单域的被操作状态
 */
function useFieldTouched(fieldName?: string) {
  const formState = useFormStateContext();
  return useBehaviorSubject(formState.isTouched$, fieldName);
}

export default useFieldTouched;
