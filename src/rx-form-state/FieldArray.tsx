import React from 'react';
import { FieldArrayHelpers } from './types';
import useFieldArray from './useFieldArray';

interface Props<T> {
  name: string;
  children: (props: FieldArrayHelpers<T>) => React.ReactNode;
}

/**
 * 数组类型的表单域辅助组件。提供了对数组表单域的增删改查方法。
 * 
 * ```
 * <FieldArray name>{
    helpers => helpers.map(item => <div>
      <Field as="input" name={helpers.getFieldName('name')} />
    </div>)
 * }</FieldArray>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldArray<T = any>(props: Props<T>) {
  return props.children(useFieldArray(props.name)) as JSX.Element;
}

export default FieldArray;
