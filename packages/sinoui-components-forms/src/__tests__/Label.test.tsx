import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from '../Label';
import Wrapper from './FormTestWrapper';
import FormItemContext from '../FormItem/FormItemContext';
import createFormItemContext from '../FormItem/createFormItemContext';
import Field from '../Field';
import FormItem from '../FormItem/FormItem';

afterEach(cleanup);

it('渲染Label', () => {
  const { getByText } = render(
    <Wrapper>
      <Label>标签1</Label>
    </Wrapper>,
  );

  expect(getByText('标签1')).toBeVisible();
});

it('如果第一个field存在必填校验，则Label会有必填样式', () => {
  const context = createFormItemContext({
    id: 1,
    fields: [{ name: 'userName', required: true }],
  });

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
  const context = createFormItemContext({
    id: 1,
    name: 'userName',
    fields: [{ name: 'userName' }, { name: 'password', required: true }],
  });
  const { getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <Label>用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByText('用户名')).not.toHaveAttribute('required');
});

it('如果label属性指定了htmlFor属性，则采用label元素的for应为htmlFor指定的值', () => {
  const context = createFormItemContext({
    id: 1,
    fields: [{ name: 'userName', required: true }],
  });

  const { container } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <Label htmlFor="123">用户名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(container.querySelector('label')).toHaveAttribute('for', '123');
});

it('避免PureLabel二次渲染', () => {
  let count = 0;
  function Child() {
    count += 1;
    return null;
  }

  render(
    <Wrapper>
      <FormItem>
        <Label>
          <Child />
        </Label>
        <Field name="test" as="input" />
      </FormItem>
    </Wrapper>,
  );

  expect(count).toBe(1);
});
