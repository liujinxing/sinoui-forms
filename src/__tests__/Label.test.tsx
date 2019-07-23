/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormStateContext from '../FormStateContext';
import Label from '../ui/Label';
import FormItemContext from '../FormItemContext';

const formState = {
  values: { userName: '张三' },
  errors: {},
  asyncErrors: {},
  isPending: {},
  isTouched: { userName: true },
  setValue: jest.fn(),
  addField: jest.fn(),
  removeField: jest.fn(),
  setValues: jest.fn(),
  setTouched: jest.fn(),
  setErrors: jest.fn(),
  setAsyncErrors: jest.fn(),
  setPending: jest.fn(),
};

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('渲染Label', () => {
  const { getByText } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <Label>姓名</Label>
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByText('姓名')).toBeVisible();
});

it('校验出错，且touched为true时，Label为红色', () => {
  const { getByText } = render(
    <FormStateContext.Provider
      value={{
        ...formState,
        errors: { userName: '必填' },
        values: {},
        isTouched: { userName: true },
      }}
    >
      <FormItemContext.Provider value={{ ...formItemState, name: '' }}>
        <Label>姓名</Label>
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByText('姓名')).toHaveStyle('color: red');
});
