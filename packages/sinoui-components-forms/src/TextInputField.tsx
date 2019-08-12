/* eslint-disable import/no-unresolved */
import React from 'react';
import { FieldProps } from '@sinoui/web-forms';
import TextInput, { TextInputProps } from 'sinoui-components/TextInput';
import Field from './Field';
import useFieldValid from './useFieldValid';

export type TextInputFieldProps = TextInputProps & Omit<FieldProps, 'ref'>;

function TextInputField(props: TextInputFieldProps) {
  const { name } = props;

  const isValid = useFieldValid(name);

  return (
    <Field
      as={TextInput}
      autoComplete="off"
      error={!isValid}
      defaultValue=""
      {...props}
    />
  );
}

export default TextInputField;
