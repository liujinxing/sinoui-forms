import React from 'react';

interface FormItemContextInterface {
  id: number;
  name?: string;
  fields: string[];
  addField: (fieldName: string) => void;
  removeField: (fieldName: string) => void;
}

const FormItemContext = React.createContext<FormItemContextInterface>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as any,
);

export default FormItemContext;
