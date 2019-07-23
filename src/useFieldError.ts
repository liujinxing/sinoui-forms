/* eslint-disable no-new-wrappers */
import { useContext, useMemo } from 'react';
import { get } from 'lodash';
import FormStateContext from './FormStateContext';

function useFieldError(name?: string) {
  const { errors, asyncErrors } = useContext(FormStateContext);

  const errorResult = useMemo(() => {
    return name ? get(errors, name) || get(asyncErrors, name) : undefined;
  }, [errors, asyncErrors, name]);

  return errorResult ? new String(errorResult) : undefined;
}

export default useFieldError;
