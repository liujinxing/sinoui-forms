/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react';
import {
  Field as RxField,
  FieldProps as RxFieldProps,
} from '@sinoui/rx-form-state';
import FormItemContext from './FormItemContext';

type GenericFieldHTMLAttributes =
  | JSX.IntrinsicElements['input']
  | JSX.IntrinsicElements['select']
  | JSX.IntrinsicElements['textarea'];

/**
 * 表单域组件
 */
function Field<AsCompProps = GenericFieldHTMLAttributes, T = string>(
  props: RxFieldProps<AsCompProps, T>,
) {
  const { name } = props;
  const { id, addField, removeField } = useContext(FormItemContext);

  useEffect(() => {
    if (addField) {
      addField(name);

      return () => {
        removeField(name);
      };
    }
    return undefined;
  }, [name, addField, removeField]);

  return (
    <div className="sinoui-form-field">
      <RxField {...(props as any)} id={`${id}`} />
    </div>
  );
}

export default Field;
