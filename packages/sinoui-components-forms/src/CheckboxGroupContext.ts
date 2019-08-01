import React from 'react';

export interface CheckboxGroupState {
  checkboxGroup: boolean;
}

const CheckboxGroupContext = React.createContext<CheckboxGroupState>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);

export default CheckboxGroupContext;
