import { useContext, useMemo } from 'react';
import { get } from 'lodash';
import FormStateContext from './FormStateContext';

function useFieldTouched(name?: string) {
  const { isTouched } = useContext(FormStateContext);

  const touchedResult = useMemo(() => {
    return name ? get(isTouched, name) : undefined;
  }, [isTouched, name]);

  return touchedResult;
}

export default useFieldTouched;
