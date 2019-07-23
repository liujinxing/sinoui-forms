/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormStateContext from '../FormStateContext';
import FieldError from '../ui/FieldError';
import FormItemContext from '../FormItemContext';

const formState = {
  values: { userName: '张三' },
  errors: {},
  asyncErrors: {},
  isPending: {},
  isTouched: { userName: true },
  setValue: () => console.log('李四'),
  addField: () => {},
  removeField: () => {},
  setValues: (values: any) => console.log(values),
  setTouched: (touched: FormTouched) => console.log(touched),
  setErrors: (errors: any) => console.log(errors),
  setAsyncErrors: (asyncErrors: any) => console.log(asyncErrors),
  setPending: (pending: FormPending) => console.log(pending),
};

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: () => {},
  removeField: () => {},
};

afterEach(cleanup);

it('校验没有错误时，不渲染', () => {
  const { queryByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <FieldError />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(queryByTestId('fieldError')).toBeNull();
});

it('校验错误出错，但touched状态为false时，不渲染', () => {
  const { queryByTestId } = render(
    <FormStateContext.Provider
      value={{
        ...formState,
        values: {},
        errors: { userName: '必填' },
        isTouched: {},
      }}
    >
      <FormItemContext.Provider
        value={{ ...formItemState, name: '', fields: [] }}
      >
        <FieldError />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(queryByTestId('fieldError')).toBeNull();
});

it('校验出错，并且touched为true时，渲染组件', () => {
  const { getByTestId } = render(
    <FormStateContext.Provider
      value={{
        ...formState,
        values: {},
        errors: { userName: '必填' },
        isTouched: { userName: true },
      }}
    >
      <FormItemContext.Provider value={{ ...formItemState, name: undefined }}>
        <FieldError />
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByTestId('fieldError')).toHaveTextContent('必填');
});
