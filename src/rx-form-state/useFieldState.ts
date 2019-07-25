import useBehaviorSubject from '../utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

/**
 * 获取表单域状态
 *
 * @param fieldName 表单域名称
 */
function useFieldState(fieldName: string) {
  const formState = useFormStateContext();
  return useBehaviorSubject(formState.getFieldState$(fieldName));
}

export default useFieldState;
