/* eslint-disable import/no-unresolved */
import React from 'react';
import {  FieldProps } from '@sinoui/web-forms';
import { SelectProps } from 'sinoui-components/Select';
import DatePicker from '@sinoui/datepicker';
import Field from './Field';
import useFieldValid from './useFieldValid';

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
  const isValid = useFieldValid(name);
  return (
    <Field
      as={DatePicker}
      onlyYearMonth={onlyYearMonth}
      hideIcon={readOnly || disabled}
      error={!isValid}
      valueExtract={valueExtract}
      {...props}
    />
  );
}

export default DatePickerField;
