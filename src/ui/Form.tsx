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
  const { formState, children, onSubmit, ...others } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formState.values);
    }
  };

  return (
    <FormStateContext.Provider value={formState}>
      <form onSubmit={handleSubmit} {...others}>
        {children}
      </form>
    </FormStateContext.Provider>
  );
}
