import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from '../ui/Form';

afterEach(cleanup);

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

it('渲染Form', () => {
  const { getByText } = render(
    <Form formState={formState}>
      <div>测试表单渲染</div>
    </Form>,
  );

  expect(getByText('测试表单渲染')).toBeVisible();
});
