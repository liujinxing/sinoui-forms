/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from 'lodash';
import { useMemo } from 'react';
import useFormStateContext from './useFormStateContext';
import useBehaviorSubject from './utils/useBehaviorSubject';

interface Props<T> {
  /**
   * 对象属性访问路径。指定此属性，可摘取表单值的指定字段值。
   */
  path?: string;
  /**
   * 表单值选择器
   */
  selector?: (values: any) => T;
  /**
   * 指定表单值渲染器。当表单值发生变化时，就会调用此函数
   */
  children: (values: T) => React.ReactElement | null;
}

/**
 * 表单值变化监听器
 */
function FormValueMonitor<T = any>({ path, selector, children }: Props<T>) {
  const currentSelector = useMemo(
    () =>
      path
        ? (values: any) => get(values, path)
        : selector || ((values: any) => values),
    [path, selector],
  );
  const formState = useFormStateContext();
  const value = useBehaviorSubject<any, T>(formState.values$, currentSelector);

  return children(value);
}

export default FormValueMonitor;
