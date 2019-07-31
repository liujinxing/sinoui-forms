import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useFormState, FormStateContext } from '@sinoui/rx-form-state';
import { ThemeProvider } from 'sinoui-components/styles';
import defaultTheme from 'sinoui-components/styles/defaultTheme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormTestWrapper: React.SFC<{ defaultValues?: any }> = ({
  children,
  defaultValues,
}) => {
  const formState = useFormState(defaultValues);
  return (
    <ThemeProvider theme={defaultTheme}>
      <FormStateContext.Provider value={formState}>
        {children}
      </FormStateContext.Provider>
    </ThemeProvider>
  );
};

export default FormTestWrapper;
