import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Wrapper from './FormTestWrapper';
import ReadonlyText from '../ReadonlyText';

afterEach(cleanup);

it('渲染children', () => {
  const { getByText } = render(
    <Wrapper>
      <ReadonlyText name="note">只读文本</ReadonlyText>
    </Wrapper>,
  );

  expect(getByText('只读文本')).toBeVisible();
});

it('渲染前缀元素', () => {
  const { getByText } = render(
    <Wrapper>
      <ReadonlyText name="note" prefix={<span>前缀图标</span>}></ReadonlyText>
    </Wrapper>,
  );

  expect(getByText('前缀图标')).toBeVisible();
});

it('渲染后缀元素', () => {
  const { getByText } = render(
    <Wrapper>
      <ReadonlyText name="note" subfix={<span>后缀图标</span>}></ReadonlyText>
    </Wrapper>,
  );

  expect(getByText('后缀图标')).toBeVisible();
});

it('渲染text元素', () => {
  const { getByText } = render(
    <Wrapper>
      <ReadonlyText name="note" text="文本内容"></ReadonlyText>
    </Wrapper>,
  );

  expect(getByText('文本内容')).toBeVisible();
});

it('自定义颜色', () => {
  const { getByText } = render(
    <Wrapper>
      <ReadonlyText
        name="note"
        text="文本内容"
        contentStyle={{ color: 'red' }}
      ></ReadonlyText>
    </Wrapper>,
  );

  expect(getByText('文本内容')).toHaveAttribute('style', 'color: red;');
});
