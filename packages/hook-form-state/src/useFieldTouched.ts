import { useContext, useMemo } from 'react';
import { get } from 'lodash';
import FormStateContext from './FormStateContext';

/**
 * 获取表单域的touched状态的hook
 * @param name 表单域名称
 */
function useFieldTouched(name?: string) {
  const { isTouched } = useContext(FormStateContext);

  const touchedResult = useMemo(() => {
    return name ? get(isTouched, name) : undefined;
  }, [isTouched, name]);

  return touchedResult;
}

export default useFieldTouched;
