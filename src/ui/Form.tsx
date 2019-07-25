/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormState } from '../types';
import FormStateContext from '../FormStateContext';

interface Props {
  formState: FormState<any>;
  children?: React.ReactNode;
  onSubmit?: (values: any) => void;
}

export default function Form(props: Props) {
  const { formState, children, ...others } = props;
  return (
    <FormStateContext.Provider value={formState}>
      <form {...others}>{children}</form>
    </FormStateContext.Provider>
  );
}
