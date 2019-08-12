/* eslint-disable import/no-unresolved */
import React from 'react';
import { FieldProps } from '@sinoui/web-forms';
import { RadioGroup, RadioGroupProps } from 'sinoui-components/Radio';
import classNames from 'classnames';
import Field from './Field';
import useFieldValid from './useFieldValid';

export type RadioGroupFieldProps = RadioGroupProps & FieldProps;

const valueExtract = (
  _event: React.ChangeEvent<HTMLSelectElement>,
  value: string | string[],
) => {
  return value;
};

/**
 * 一组单选框表单组件
 */
function RadioGroupField(props: RadioGroupFieldProps) {
  const { children, className, name } = props;
  const isValid = useFieldValid(name);

  return (
    <Field
      as={RadioGroup}
      className={classNames('sinoui-radio-group-field', className)}
      valueExtract={valueExtract}
      error={!isValid}
      defaultValue=""
      {...props}
    >
      {children}
    </Field>
  );
}

export default RadioGroupField;
