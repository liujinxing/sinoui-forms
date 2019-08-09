import React from 'react';

export interface FormItemContentState {
  inFormItemContent: boolean;
}

const FormItemContentContext = React.createContext<FormItemContentState>({
  inFormItemContent: false,
});

export default FormItemContentContext;
