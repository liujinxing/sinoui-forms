/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef } from 'react';
import {
  Field as RxField,
  FieldProps as RxFieldProps,
} from '@sinoui/rx-form-state';
import shallowEqual from 'shallowequal';
import FormItemContext from './FormItem/FormItemContext';
import { FieldConfig } from './FormItem/types';

function useField(props: RxFieldProps & { readOnly?: boolean }) {
  const { addField, removeField, useFormItemProps } = useContext(
    FormItemContext,
  );
  const formItemProps = useFormItemProps();

  const {
    name,
    required,
    readOnly = formItemProps.readOnly,
    disabled = formItemProps.disabled,
  } = props;

  const addedFieldRef = useRef<FieldConfig | null>(null);
  const fieldConfig = {
    name,
    required,
    readOnly,
    disabled,
  };
  if (name && addField && !shallowEqual(addedFieldRef.current, fieldConfig)) {
    addField(fieldConfig);
    addedFieldRef.current = fieldConfig;
  }

  useEffect(() => {
    if (removeField) {
      return () => {
        addedFieldRef.current = null;
        removeField(name);
      };
    }
    return undefined;
  }, [name, removeField]);
}

/**
 * 表单域组件
 */
function Field(props: RxFieldProps & { readOnly?: boolean }) {
  const formItemProps = useContext(FormItemContext).useFormItemProps();

  useField(props);

  return (
    <div className="sinoui-form-field">
      <RxField {...(props as any)} id={`${formItemProps.id}`} />
    </div>
  );
}

export default Field;
