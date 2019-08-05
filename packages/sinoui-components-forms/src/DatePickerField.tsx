/* eslint-disable import/no-unresolved */
import React from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import { SelectProps } from 'sinoui-components/Select';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';
import DatePicker from '@sinoui/datepicker';

export type DatePickerFieldProps = SelectProps &
  FieldProps & { onlyYearMonth?: boolean; hideIcon?: boolean };

const valueExtract = (_event: React.MouseEvent<HTMLElement>, value: string) => {
  return value;
};

/**
 * 日期选择组件
 */
function DatePickerField(props: DatePickerFieldProps) {
  const { name, onlyYearMonth, readOnly, disabled } = props;
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);
  return (
    <Field
      as={DatePicker}
      onlyYearMonth={onlyYearMonth}
      hideIcon={readOnly || disabled}
      error={!!(fieldTouched && fieldError)}
      valueExtract={valueExtract}
      {...props}
    />
  );
}

export default DatePickerField;