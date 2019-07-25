import React from 'react';
import { FormState } from './types';

const FormStateContext = React.createContext<FormState | null>(null);

export default FormStateContext;
