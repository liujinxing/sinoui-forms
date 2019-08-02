/* eslint-disable import/no-unresolved */
import React from 'react';
import { Field, FieldProps } from '@sinoui/web-forms';
import TextInput, { TextInputProps } from 'sinoui-components/TextInput';
import { useFieldError, useFieldTouched } from '@sinoui/rx-form-state';

export type TextInputFieldProps = TextInputProps & Omit<FieldProps, 'ref'>;

function TextInputField(props: TextInputFieldProps) {
  const { name } = props;

  const fieldError = useFieldError(name);
  const fieldTouched = useFieldTouched(name);

  return (
    <Field
      as={TextInput}
      autoComplete="off"
      error={!!(fieldTouched && fieldError)}
      {...props}
    />
  );
}

export default TextInputField;
