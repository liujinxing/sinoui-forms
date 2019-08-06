/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useContext } from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import Checkbox, { CheckboxProps } from 'sinoui-components/Checkbox';
import {
  useFieldError,
  useFieldTouched,
  useFieldValue,
} from '@sinoui/rx-form-state';
import CheckboxGroupContext from './CheckboxGroupContext';

export type CheckboxFieldProps = CheckboxProps<any> &
  Omit<FieldProps, 'name'> & {
    dense?: boolean;
    unCheckedValue?: any;
    name?: string;
  };

const valueExtract = (
  event: React.ChangeEvent<HTMLInputElement>,
  props: CheckboxFieldProps,
) => {
  const { checked } = event.target;
  return checked ? props.value : props.unCheckedValue;
};

/**
 * 复选框组件
 */
function CheckboxField(props: CheckboxFieldProps) {
  const { checkboxGroup = false } = useContext(CheckboxGroupContext) || {};
  const { name = '', value } = props;

  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);
  const fieldValue = useFieldValue(name);

  if (checkboxGroup) {
    return <Checkbox {...props} className="sinoui-checkbox-field" />;
  }

  return (
    <Field
      dense
      as={Checkbox}
      checked={fieldValue === value}
      error={!!(fieldTouched && fieldError)}
      valueExtract={(event) => valueExtract(event, props)}
      defaultValue=""
      {...(props as any)}
    />
  );
}

export default CheckboxField;
