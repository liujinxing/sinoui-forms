import React from 'react';
import { FormItemContextModel } from './types';

const FormItemContext = React.createContext<FormItemContextModel>({
  useFormItem: () => ({}),
  useFormItemProps: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

export default FormItemContext;
