/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormItemContent from '../FormItem/FormItemContent';
import TextInput from '../TextInputField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染组件', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContent>这是表单项内容</FormItemContent>
    </Wrapper>,
  );

  expect(getByText('这是表单项内容')).toBeVisible();
});

it('处理子组件', () => {
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContent readOnly>
        <TextInput name="userName" />
      </FormItemContent>
    </Wrapper>,
  );

  expect(getByTestId('field-comp')).toHaveAttribute('readonly');
});
