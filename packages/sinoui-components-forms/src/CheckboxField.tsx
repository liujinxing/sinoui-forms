/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useContext, useCallback } from 'react';
import { FieldProps } from '@sinoui/web-forms';
import Checkbox, { CheckboxProps } from 'sinoui-components/Checkbox';
import {
  useFieldValue,
} from '@sinoui/rx-form-state';
import CheckboxGroupContext from './CheckboxGroupContext';
import Field from './Field';
import useFieldValid from './useFieldValid';

export type CheckboxFieldProps = CheckboxProps<any> &
  Omit<FieldProps, 'name'> & {
    dense?: boolean;
    unCheckedValue?: any;
    name?: string;
  };

function InnerCheckboxField(props: CheckboxFieldProps) {
  const { name = '', value, unCheckedValue } = props;

  const isValid = useFieldValid(name);
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
      error={!isValid}
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
