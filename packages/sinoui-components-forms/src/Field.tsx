/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react';
import {
  Field as RxField,
  FieldProps as RxFieldProps,
} from '@sinoui/rx-form-state';
import FormItemContext from './FormItem/FormItemContext';

/**
 * 表单域组件
 */
function Field(props: RxFieldProps & { readOnly?: boolean }) {
  const { name, required, readOnly, disabled } = props;
  const { id, addField, removeField } = useContext(FormItemContext);

  useEffect(() => {
    const fieldConfig = {
      name,
      required,
      readOnly,
      disabled,
    };
    if (addField) {
      addField(fieldConfig);

      return () => {
        removeField(name);
      };
    }
    return undefined;
  }, [name, addField, removeField, required, readOnly, disabled]);

  return (
    <div className="sinoui-form-field">
      <RxField {...(props as any)} id={`${id}`} />
    </div>
  );
}

export default Field;