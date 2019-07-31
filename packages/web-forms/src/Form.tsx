/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormState, FormStateContext } from '@sinoui/rx-form-state';

interface Props {
  formState: FormState<any>;
  children?: React.ReactNode;
}

export default function Form(props: Props) {
  const { formState, children, ...others } = props;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formState.submit();
  };

  return (
    <FormStateContext.Provider value={formState}>
      <form onSubmit={handleSubmit} {...others}>
        {children}
      </form>
    </FormStateContext.Provider>
  );
}
