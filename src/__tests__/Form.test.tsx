import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

it('测试表单提交', () => {
  const onSubmit = jest.fn();

  const { getByText } = render(
    <Form formState={formState} onSubmit={onSubmit}>
      <button type="submit">提交</button>
    </Form>,
  );

  fireEvent.click(getByText('提交'));

  expect(onSubmit).toHaveBeenCalled();
});
