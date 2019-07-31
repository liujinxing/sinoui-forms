import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import useFormState from './useFormState';
import FormStateContext from './FormStateContext';
import FormValueMonitor from './FormValueMonitor';
import Field from './Field';

const Wrapper: React.SFC = ({ children }) => {
  const formState = useFormState();

  return (
    <FormStateContext.Provider value={formState}>
      {children}
    </FormStateContext.Provider>
  );
};

afterEach(cleanup);

it('监听表单值变化', () => {
  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="userName" data-testid="input"></Field>
      <FormValueMonitor>
        {(value) => <div data-testid="monitor">{JSON.stringify(value)}</div>}
      </FormValueMonitor>
    </Wrapper>,
  );

  expect(getByTestId('monitor')).toHaveTextContent(JSON.stringify({}));

  const input = getByTestId('input');

  fireEvent.change(input, {
    target: {
      value: '紫诺',
    },
  });

  expect(getByTestId('monitor')).toHaveTextContent(
    JSON.stringify({ userName: '紫诺' }),
  );
});

it('监听部分表单字段值的变化', () => {
  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="userName" data-testid="userNameInput" />
      <Field as="input" name="address.city" data-testid="addressCityInput" />
      <Field
        as="input"
        name="address.district"
        data-testid="addressDistrictInput"
      />
      <FormValueMonitor path="address">
        {(value = {}) => (
          <div data-testid="addressOutput">
            地址：{value.city}
            {value.district}
          </div>
        )}
      </FormValueMonitor>
    </Wrapper>,
  );

  expect(getByTestId('addressOutput').textContent).toBe('地址：');

  fireEvent.change(getByTestId('userNameInput'), {
    target: {
      value: '紫诺',
    },
  });

  expect(getByTestId('addressOutput').textContent).toBe('地址：');

  fireEvent.change(getByTestId('addressCityInput'), {
    target: {
      value: '北京',
    },
  });

  fireEvent.change(getByTestId('addressDistrictInput'), {
    target: {
      value: '海淀',
    },
  });

  expect(getByTestId('addressOutput')).toHaveTextContent('地址：北京海淀');
});

it('通过selector属性自定义监听范围', () => {
  const selector = (values: any) =>
    `${values.userName || ''}@${values.address ? values.address.city : ''}`;

  const { getByTestId } = render(
    <Wrapper>
      <Field as="input" name="userName" data-testid="userNameInput" />
      <Field as="input" name="address.city" data-testid="addressCityInput" />
      <Field
        as="input"
        name="address.district"
        data-testid="addressDistrictInput"
      />
      <FormValueMonitor selector={selector}>
        {(value) => <div data-testid="output">{value}</div>}
      </FormValueMonitor>
    </Wrapper>,
  );

  expect(getByTestId('output').textContent).toBe('@');

  fireEvent.change(getByTestId('userNameInput'), {
    target: {
      value: '紫诺',
    },
  });

  expect(getByTestId('output').textContent).toBe('紫诺@');

  fireEvent.change(getByTestId('addressCityInput'), {
    target: {
      value: '北京',
    },
  });

  expect(getByTestId('output').textContent).toBe('紫诺@北京');
});
