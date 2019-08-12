/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { useMemo } from 'react';
import { FieldProps } from '@sinoui/web-forms';
import { CheckboxGroup, CheckboxGroupProps } from 'sinoui-components/Checkbox';
import { useFieldValue } from '@sinoui/rx-form-state';
import CheckboxGroupContext from './CheckboxGroupContext';
import Field from './Field';
import useFieldValid from './useFieldValid';

export type CheckboxGroupFieldProps = CheckboxGroupProps<any> &
  FieldProps & { stringValue?: boolean };

const stringValueExtract = (value: string[]) => {
  return (value || []).join(',');
};

const valueExtract = (value: string[]) => {
  return value;
};

const checkboxGroupContext = { checkboxGroup: true };
/**
 * 渲染一组复选框组件
 */
function CheckboxGroupField(props: CheckboxGroupFieldProps) {
  const { name, stringValue } = props;
  const isValid = useFieldValid(name);
  const fieldValue = useFieldValue<string | string[]>(name);
  const value = useMemo(() => {
    return stringValue && fieldValue && typeof fieldValue === 'string'
      ? fieldValue.split(',')
      : fieldValue || [];
  }, [stringValue, fieldValue]);

  return (
    <CheckboxGroupContext.Provider value={checkboxGroupContext}>
      <Field
        as={CheckboxGroup}
        error={!isValid}
        className="sinoui-checkbox-group-field"
        value={value}
        valueExtract={stringValue ? stringValueExtract : valueExtract}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  );
}

export default CheckboxGroupField;
