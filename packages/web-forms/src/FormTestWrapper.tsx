import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useFormState, FormStateContext } from '@sinoui/rx-form-state';

const FormTestWrapper: React.SFC<{ defaultValues?: any }> = ({
  children,
  defaultValues,
}) => {
  const formState = useFormState(defaultValues);
  return (
    <FormStateContext.Provider value={formState}>
      {children}
    </FormStateContext.Provider>
  );
};

export default FormTestWrapper;
