/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useContext, useCallback } from 'react';
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

function InnerCheckboxField(props: CheckboxFieldProps) {
  const { name = '', value, unCheckedValue } = props;

  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);
  const fieldValue = useFieldValue(name);
  const valueExtract = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      return checked ? value : unCheckedValue;
    },
    [value, unCheckedValue],
  );

  return (
    <Field
      dense
      as={Checkbox}
      checked={fieldValue === value}
      error={!!(fieldTouched && fieldError)}
      valueExtract={valueExtract}
      defaultValue=""
      {...(props as any)}
    />
  );
}

/**
 * 复选框组件
 */
function CheckboxField(props: CheckboxFieldProps) {
  const { checkboxGroup = false } = useContext(CheckboxGroupContext) || {};
  const { name } = props;

  if (checkboxGroup || !name) {
    return <Checkbox {...props} className="sinoui-checkbox-field" />;
  }

  return <InnerCheckboxField {...props} />;
}

export default CheckboxField;
