import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Radio from 'sinoui-components/Radio';
import '@testing-library/jest-dom/extend-expect';
// eslint-disable-next-line import/no-unresolved
import { FormValueMonitor } from '@sinoui/rx-form-state';
import RadioGroupField from '../RadioGroupField';
import Wrapper from './FormTestWrapper';

afterEach(cleanup);

it('渲染RadioGroup', () => {
  const { container } = render(
    <Wrapper defaultValues={{ sex: '女' }}>
      <RadioGroupField name="sex">
        <Radio value="男">男</Radio>
        <Radio value="女">女</Radio>
      </RadioGroupField>
    </Wrapper>,
  );

  expect(container.querySelector('.sinoui-radio-group-field')).toBeVisible();
});

it('改变RadioGroup的值', () => {
  const { getByTestId, getByDisplayValue } = render(
    <Wrapper defaultValues={{ sex: '女' }}>
      <>
        <RadioGroupField name="sex">
          <Radio value="男">男</Radio>
          <Radio value="女">女</Radio>
        </RadioGroupField>
        <FormValueMonitor>
          {(values) => <div data-testid="sex-value">性别：{values.sex}</div>}
        </FormValueMonitor>
      </>
    </Wrapper>,
  );

  fireEvent.click(getByDisplayValue('女'));
  expect(getByTestId('sex-value')).toHaveTextContent('女');

  fireEvent.click(getByDisplayValue('男'));
  expect(getByTestId('sex-value')).toHaveTextContent('男');
});
