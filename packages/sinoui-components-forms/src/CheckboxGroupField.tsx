/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import { CheckboxGroup, CheckboxGroupProps } from 'sinoui-components/Checkbox';
import {
  useFieldError,
  useFieldTouched,
  useFieldValue,
} from '@sinoui/rx-form-state';
import CheckboxGroupContext from './CheckboxGroupContext';

export type CheckboxGroupFieldProps = CheckboxGroupProps<any> &
  FieldProps & { stringValue?: boolean };

const valueExtract = (value: string[], props: CheckboxGroupFieldProps) => {
  const { stringValue } = props;
  if (stringValue) {
    return (value || []).join(',');
  }

  return value;
};

/**
 * 渲染一组复选框组件
 */
function CheckboxGroupField(props: CheckboxGroupFieldProps) {
  const { name, stringValue } = props;
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);
  const fieldValue = useFieldValue(name);
  return (
    <CheckboxGroupContext.Provider value={{ checkboxGroup: true }}>
      <Field
        as={CheckboxGroup}
        error={!!(fieldTouched && fieldError)}
        className="sinoui-checkbox-group-field"
        value={
          stringValue && fieldValue ? fieldValue.split(',') : fieldValue || []
        }
        valueExtract={(value) => valueExtract(value, props)}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  );
}

export default CheckboxGroupField;
