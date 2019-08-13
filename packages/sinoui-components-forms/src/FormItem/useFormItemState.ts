/* eslint-disable import/no-unresolved */
import { useMemo, useRef, useContext } from 'react';
import shallowEqual from 'shallowequal';
import useId from './useId';
import createFormItemContext from './createFormItemContext';
import SinouiFormStateContext from '../SinouiFormStateContext';

interface Options {
  name?: string;
  inline?: boolean;
  vertical?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

/**
 * 处理表单域的hook
 * @param name 表单域名称
 */
function useFormItemState(options: Options = {}) {
  const { inline = options.inline, vertical = options.vertical } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useContext(SinouiFormStateContext) || ({} as any);
  const id = useId();
  const newOptions = {
    ...options,
    inline,
    vertical,
  };
  const optionsRef = useRef(newOptions);

  const context = useMemo(
    () =>
      createFormItemContext({
        id,
        fields: [],
        ...optionsRef.current,
      }),
    [id],
  );

  if (options && !shallowEqual(optionsRef.current, newOptions)) {
    context.setFormItemProps(newOptions);
    optionsRef.current = newOptions;
  }

  return context;
}

export default useFormItemState;
