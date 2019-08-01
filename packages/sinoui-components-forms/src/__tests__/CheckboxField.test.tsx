import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/no-unresolved
import { FormValueMonitor } from '@sinoui/rx-form-state';
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

  fireEvent.change(checkbox, { target: { checked: true } });

  expect(getByTestId('result')).toHaveTextContent('同意');
});
