import React from 'react';
import { FormState } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormStateContext = React.createContext<FormState<any>>(null as any);

export default FormStateContext;
