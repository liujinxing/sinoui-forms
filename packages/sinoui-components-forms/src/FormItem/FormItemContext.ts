import React from 'react';
import { FieldConfig, FieldValidateProps } from '@sinoui/rx-form-state/src';

export interface FormItemState {
  id: number;
  name?: string;
  fields: (Partial<FieldConfig> & FieldValidateProps)[];
  addField: (field: Partial<FieldConfig> & FieldValidateProps) => void;
  removeField: (fieldName: string) => void;
  inline?: boolean;
  vertical?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormItemContext = React.createContext<FormItemState>({} as any);

export default FormItemContext;
