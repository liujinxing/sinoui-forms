/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormItemContainer from '../FormItem/FormItemContainer';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染组件', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContainer labelWidth="120px">表单项容器组件</FormItemContainer>
    </Wrapper>,
  );

  expect(getByText('表单项容器组件')).toHaveStyle('display:grid');
});

it('属性vertical存在时，不再是grid布局', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContainer labelWidth="120px" vertical>
        表单项容器组件
      </FormItemContainer>
    </Wrapper>,
  );

  expect(getByText('表单项容器组件')).not.toHaveStyle('display:grid');
});
