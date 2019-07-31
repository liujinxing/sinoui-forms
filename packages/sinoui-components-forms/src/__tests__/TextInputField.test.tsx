import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextInputField from '../TextInputField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染输入框', () => {
  const { getByPlaceholderText } = render(
    <Wrapper>
      <TextInputField name="userName" placeholder="请输入用户名" />
    </Wrapper>,
  );

  expect(getByPlaceholderText('请输入用户名')).toBeVisible();
});

it('改变输入框的值', () => {
  const { getByPlaceholderText, getByDisplayValue } = render(
    <Wrapper>
      <TextInputField name="userName" placeholder="请输入用户名" />
    </Wrapper>,
  );

  fireEvent.change(getByPlaceholderText('请输入用户名'), {
    target: { value: '张三' },
  });

  expect(getByDisplayValue('张三')).toBeVisible();
});

it('渲染多行输入框', () => {
  const { container } = render(
    <Wrapper>
      <TextInputField
        name="note"
        placeholder="请填写备注"
        defaultValue="这是备注"
        multiline
      />
    </Wrapper>,
  );

  expect(container.querySelector('textarea')).toHaveValue('这是备注');
});
