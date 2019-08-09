import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from '../Label';
import Wrapper from './FormTestWrapper';
import FormItemContext from '../FormItem/FormItemContext';

afterEach(cleanup);

const context = {
  id: 1,
  name: 'userName',
  fields: [{ name: 'userName', required: true }],
  addField: jest.fn(),
  removeField: jest.fn(),
};

it('渲染Label', () => {
  const { getByText } = render(
    <Wrapper>
      <Label>标签1</Label>
    </Wrapper>,
  );

  expect(getByText('标签1')).toBeVisible();
});

it('如果第一个field存在必填校验，则Label会有必填样式', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <Label>用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByText('用户名')).toHaveAttribute('required');
});

it('包含多个表单域时，第一个field没有required属性时，Label没有required属性', () => {
  const newContext = {
    id: 1,
    name: 'userName',
    fields: [{ name: 'userName' }, { name: 'password', required: true }],
    addField: jest.fn(),
    removeField: jest.fn(),
  };
  const { getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={newContext}>
        <Label>用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByText('用户名')).not.toHaveAttribute('required');
});

it('如果label属性指定了htmlFor属性，则采用label元素的for应为htmlFor指定的值', () => {
  const { container } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <Label htmlFor="123">用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(container.querySelector('label')).toHaveAttribute('for', '123');
});
