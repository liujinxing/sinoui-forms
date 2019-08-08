import React from 'react';

export interface FormItemContentState {
  inFormItemContent: boolean;
}

const FormItemContentContext = React.createContext<FormItemContentState>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);

export default FormItemContentContext;
