import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from '../ui/Label';
import Field from '../ui/Field';
import FormStateContext from '../FormStateContext';
import FormItem from '../ui/FormItem';
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
  onBlur: jest.fn(),
};

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('无校验状态下FormItem的渲染', () => {
  const { getByTestId } = render(
    <FormStateContext.Provider value={formState}>
      <FormItemContext.Provider value={formItemState}>
        <FormItem>
          <Label>用户名</Label>
          <Field as="input" name="userName" />
        </FormItem>
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByTestId('formItem')).toBeVisible();
});

it('校验出错时，会渲染错误信息', () => {
  const { getByTestId, getByText } = render(
    <FormStateContext.Provider
      value={{ ...formState, values: {}, errors: { userName: '必填' } }}
    >
      <FormItemContext.Provider value={formItemState}>
        <FormItem>
          <Label>用户名</Label>
          <Field as="input" name="userName" />
        </FormItem>
      </FormItemContext.Provider>
    </FormStateContext.Provider>,
  );

  expect(getByTestId('fieldError')).toBeVisible();
  expect(getByText('用户名')).toHaveStyle('color:red');
});
