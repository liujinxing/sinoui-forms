/* eslint-disable no-new-wrappers */
import { useContext, useMemo } from 'react';
import { get } from 'lodash';
import FormStateContext from './FormStateContext';

/**
 * 获取表单域校验结果的hook
 * @param name 表单域名称
 */
function useFieldError(name?: string) {
  const { errors, asyncErrors } = useContext(FormStateContext);

  const errorResult = useMemo(() => {
    return name ? get(errors, name) || get(asyncErrors, name) : undefined;
  }, [errors, asyncErrors, name]);

  return errorResult ? new String(errorResult) : undefined;
}

export default useFieldError;
