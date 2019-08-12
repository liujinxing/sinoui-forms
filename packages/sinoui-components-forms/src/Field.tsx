/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef } from 'react';
import {
  Field as RxField,
  FieldProps as RxFieldProps,
} from '@sinoui/rx-form-state';
import FormItemContext from './FormItem/FormItemContext';

/**
 * 表单域组件
 */
function Field(props: RxFieldProps & { readOnly?: boolean }) {
  const { name, required } = props;
  const {
    id,
    addField,
    removeField,
    readOnly: readOnlyFromFormItem,
    disabled: disabledFromFormItem,
  } = useContext(FormItemContext);

  const {
    readOnly = readOnlyFromFormItem,
    disabled = disabledFromFormItem,
  } = props;

  const isFieldExitRef = useRef([]);
  const fieldConfig = {
    name,
    required,
    readOnly,
    disabled,
  };

  if (name) {
    if (isFieldExitRef.current.indexOf(name as never) === -1) {
      if (addField) {
        addField(fieldConfig);
        isFieldExitRef.current.push(name as never);
      }
    }
  }

  useEffect(() => {
    if (removeField) {
      return () => {
        removeField(name);
      };
    }
    return undefined;
  }, [name, removeField]);

  return (
    <div className="sinoui-form-field">
      <RxField {...(props as any)} id={`${id}`} />
    </div>
  );
}

export default Field;
