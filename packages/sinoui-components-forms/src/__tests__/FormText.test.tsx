import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Wrapper from './FormTestWrapper';
import FormText from '../FormText';

afterEach(cleanup);

it('渲染children', () => {
  const { getByText } = render(
    <Wrapper>
      <FormText name="note">展示文本</FormText>
    </Wrapper>,
  );

  expect(getByText('展示文本')).toBeVisible();
});

it('渲染前缀元素', () => {
  const { getByText } = render(
    <Wrapper>
      <FormText name="note" prefix={<span>前缀图标</span>}></FormText>
    </Wrapper>,
  );

  expect(getByText('前缀图标')).toBeVisible();
});

it('渲染后缀元素', () => {
  const { getByText } = render(
    <Wrapper>
      <FormText name="note" subfix={<span>后缀图标</span>}></FormText>
    </Wrapper>,
  );

  expect(getByText('后缀图标')).toBeVisible();
});

it('渲染text元素', () => {
  const { getByText } = render(
    <Wrapper>
      <FormText name="note" text="文本内容"></FormText>
    </Wrapper>,
  );

  expect(getByText('文本内容')).toBeVisible();
});

it('自定义颜色', () => {
  const { getByText } = render(
    <Wrapper>
      <FormText
        name="note"
        text="文本内容"
        contentStyle={{ color: 'red' }}
      ></FormText>
    </Wrapper>,
  );

  expect(getByText('文本内容')).toHaveAttribute('style', 'color: red;');
});
