/* eslint-disable import/no-unresolved */
import React from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import { RadioGroup, RadioGroupProps } from 'sinoui-components/Radio';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';
import classNames from 'classnames';

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
  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);

  return (
    <Field
      as={RadioGroup}
      className={classNames('sinoui-radio-group-field', className)}
      valueExtract={valueExtract}
      error={!!(fieldTouched && fieldError)}
      {...props}
    >
      {children}
    </Field>
  );
}

export default RadioGroupField;
