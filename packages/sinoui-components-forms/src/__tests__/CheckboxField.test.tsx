import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/no-unresolved
import { FormValueMonitor } from '@sinoui/rx-form-state';
import { Field } from '@sinoui/web-forms/src';
import Checkbox from '../CheckboxField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染复选框', () => {
  const { container } = render(
    <Wrapper>
      <Checkbox name="isAgree" value="同意" unCheckedValue="不同意" />
    </Wrapper>,
  );

  expect(
    container.querySelector('.sinoui-checkbox-button-input'),
  ).toBeInTheDOM();
});

it('改变复选框选中状态', () => {
  const { container, getByTestId } = render(
    <Wrapper>
      <Checkbox name="isAgree" value="同意" unCheckedValue="不同意" />
      <FormValueMonitor>
        {(values) => <div data-testid="result">是否同意：{values.isAgree}</div>}
      </FormValueMonitor>
    </Wrapper>,
  );

  const checkbox = container.querySelector(
    '.sinoui-checkbox-button-input',
  ) as any;

  fireEvent.click(checkbox);

  expect(getByTestId('result')).toHaveTextContent('同意');

  fireEvent.click(checkbox);

  expect(getByTestId('result')).toHaveTextContent('不同意');
});

it('改变其他表单域的值，不会引起Checkbox的变更', () => {
  let count = 0;

  function Child() {
    count += 1;

    return null;
  }

  const { getByTestId } = render(
    <Wrapper>
      <Checkbox name="isAgree" value="同意" unCheckedValue="不同意">
        <Child />
      </Checkbox>
      <Field as="input" name="userName" data-testid="userName" />
    </Wrapper>,
  );

  expect(count).toBe(1);
  fireEvent.change(getByTestId('userName'), { target: { value: 'xxx' } });
  expect(count).toBe(1);
});
