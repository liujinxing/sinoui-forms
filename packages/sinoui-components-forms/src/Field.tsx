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
import useFieldValid from './useFieldValid';

type FieldProps<AsCompProps, T> = Omit<RxFieldProps<AsCompProps, T>, 'as'> & {
  readOnly?: boolean;
  as?: React.ReactType<AsCompProps>;
};

function useField(props: FieldProps<any, any>) {
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

type GenericFieldHTMLAttributes =
  | JSX.IntrinsicElements['input']
  | JSX.IntrinsicElements['select']
  | JSX.IntrinsicElements['textarea'];

/**
 * 表单域组件
 */
function Field<AsCompProps = GenericFieldHTMLAttributes, T = string>(
  props: FieldProps<AsCompProps, T>,
) {
  const { name } = props;
  const formItemProps = useContext(FormItemContext).useFormItemProps();
  const isValid = useFieldValid(name);

  useField(props);

  return (
    <div className="sinoui-form-field">
      <RxField
        {...(props as any)}
        id={`${formItemProps.id}`}
        error={!isValid}
      />
    </div>
  );
}

export default Field;
