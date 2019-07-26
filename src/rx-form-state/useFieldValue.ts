import useBehaviorSubject from '../utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

/**
 * 获取表单域值
 *
 * @param fieldName 表单域名称
 */
function useFieldValue(fieldName: string) {
  const formState = useFormStateContext();
  return useBehaviorSubject(formState.values$, fieldName);
}

export default useFieldValue;
