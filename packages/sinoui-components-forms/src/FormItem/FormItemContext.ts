import React from 'react';
import { FieldConfig } from '@sinoui/rx-form-state/src';

export interface FormItemState {
  id: number;
  name?: string;
  fields: Partial<FieldConfig>[];
  addField: (field: Partial<FieldConfig>) => void;
  removeField: (fieldName: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormItemContext = React.createContext<FormItemState>({} as any);

export default FormItemContext;
