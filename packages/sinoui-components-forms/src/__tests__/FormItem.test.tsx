/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Label, TextInput } from '@sinoui/sinoui-components-forms';
import FormItem from '../FormItem/FormItem';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染item', () => {
  const { container } = render(
    <Wrapper>
      <FormItem>
        <Label>用户名</Label>
        <TextInput name="userName" />
      </FormItem>
    </Wrapper>,
  );

  expect(container.querySelector('.sinoui-form-item')).toHaveTextContent(
    '用户名',
  );
});

it('label为children时，渲染label', () => {
  const { container } = render(
    <Wrapper>
      <FormItem name="userName">
        <Label>标题</Label>
      </FormItem>
    </Wrapper>,
  );

  const label = container.querySelector('label');
  expect(label).toHaveTextContent('标题');
});

it('label为属性时，渲染label', () => {
  const { container } = render(
    <Wrapper>
      <FormItem name="userName" label="标题">
        <div />
      </FormItem>
    </Wrapper>,
  );

  const label = container.querySelector('label');
  expect(label).toHaveTextContent('标题');
});

it('既不指定label属性，也不写children时，不会渲染label', () => {
  const { container } = render(
    <Wrapper>
      <FormItem name="userName">
        <div />
      </FormItem>
    </Wrapper>,
  );

  expect(container.querySelector('label')).toBeNull();
});

it('从表单域组件中获取label的for指向', () => {
  const { container } = render(
    <Wrapper>
      <FormItem>
        <Label>用户名</Label>
        <TextInput name="userName" />
      </FormItem>
    </Wrapper>,
  );
  const label = container.querySelector('label');
  expect(label).toHaveAttribute('for', '5');
});

it('disabled属性', () => {
  const { container } = render(
    <Wrapper>
      <FormItem name="userName" label="标题">
        <TextInput name="userName" disabled />
      </FormItem>
    </Wrapper>,
  );

  const label = container.querySelector('label');

  expect(label).toHaveAttribute('disabled');
});
