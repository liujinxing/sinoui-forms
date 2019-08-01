import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Checkbox from 'sinoui-components/Checkbox';
// eslint-disable-next-line import/no-unresolved
import { FormValueMonitor } from '@sinoui/rx-form-state';
import Wrapper from './FormTestWrapper';
import CheckboxGroup from '../CheckboxGroupField';

afterEach(cleanup);

it('渲染CheckboxGroup', () => {
  const { container } = render(
    <Wrapper>
      <CheckboxGroup name="fav">
        <Checkbox value="足球">足球</Checkbox>
        <Checkbox value="篮球">篮球</Checkbox>
        <Checkbox value="排球">排球</Checkbox>
        <Checkbox value="乒乓球">乒乓球</Checkbox>
      </CheckboxGroup>
    </Wrapper>,
  );

  expect(
    container.querySelector('.sinoui-checkbox-group-field'),
  ).toBeInTheDOM();
});

it('值变更', () => {
  const { container, getByTestId } = render(
    <Wrapper>
      <CheckboxGroup name="fav">
        <Checkbox value="足球">足球</Checkbox>
        <Checkbox value="篮球">篮球</Checkbox>
        <Checkbox value="排球">排球</Checkbox>
        <Checkbox value="乒乓球">乒乓球</Checkbox>
      </CheckboxGroup>
      <FormValueMonitor>
        {(values) => (
          <div data-testid="checked-value">{JSON.stringify(values)}</div>
        )}
      </FormValueMonitor>
    </Wrapper>,
  );

  const checkbox1 = container.querySelectorAll(
    '.sinoui-checkbox-button-input',
  )[0];
  const checkbox2 = container.querySelectorAll(
    '.sinoui-checkbox-button-input',
  )[2];

  fireEvent.click(checkbox1);
  fireEvent.click(checkbox2);

  expect(getByTestId('checked-value')).toHaveTextContent(
    JSON.stringify({
      fav: ['足球', '排球'],
    }),
  );
});

it('stringValue属性下的值变更', () => {
  const { container, getByTestId } = render(
    <Wrapper>
      <CheckboxGroup name="fav" stringValue>
        <Checkbox value="足球">足球</Checkbox>
        <Checkbox value="篮球">篮球</Checkbox>
        <Checkbox value="排球">排球</Checkbox>
        <Checkbox value="乒乓球">乒乓球</Checkbox>
      </CheckboxGroup>
      <FormValueMonitor>
        {(values) => (
          <div data-testid="checked-value">{JSON.stringify(values)}</div>
        )}
      </FormValueMonitor>
    </Wrapper>,
  );

  const checkbox1 = container.querySelectorAll(
    '.sinoui-checkbox-button-input',
  )[0];
  const checkbox2 = container.querySelectorAll(
    '.sinoui-checkbox-button-input',
  )[2];

  fireEvent.click(checkbox1);
  fireEvent.click(checkbox2);

  expect(getByTestId('checked-value')).toHaveTextContent(
    JSON.stringify({
      fav: '足球,排球',
    }),
  );
});
