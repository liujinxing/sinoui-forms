import useBehaviorSubject from './utils/useBehaviorSubject';
import useFormStateContext from './useFormStateContext';

/**
 * 获取表单域值
 *
 * @param fieldName 表单域名称
 */
function useFieldValue<Value>(fieldName: string): Value {
  const formState = useFormStateContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useBehaviorSubject<any, Value>(formState.values$, fieldName);
}

export default useFieldValue;
