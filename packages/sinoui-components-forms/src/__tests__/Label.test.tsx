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

it('从上下文中获取required状态', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <Label>用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByText('用户名')).toHaveAttribute('required');
});
