/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormItemError from '../FormItem/FormItemError';
import FormItemContext from '../FormItem/FormItemContext';
import Wrapper from './FormTestWrapper';
import Field from '../Field';

const context = {
  id: 1,
  name: 'userName',
  fields: [{ name: 'userName', required: true }, { name: 'password' }],
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('校验没有错误时，不渲染', () => {
  const { queryByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={context}>
        <FormItemError />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(queryByTestId('fieldError')).toBeNull();
});

it('校验错误出错，但touched状态为false时，不渲染', () => {
  const { queryByTestId, getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider
        value={{ ...context, name: 'userName', fields: [] }}
      >
        <Field as="input" name="userName" required data-testid="field" />
        <FormItemError />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.change(getByTestId('field'), {
    target: {
      value: '',
    },
  });

  expect(queryByTestId('fieldError')).toBeNull();
});

it('校验出错，并且touched为true时，渲染组件', () => {
  const { getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={{ ...context, name: 'userName' }}>
        <Field as="input" name="userName" required data-testid="field" />
        <FormItemError />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.change(getByTestId('field'), {
    target: {
      value: '',
    },
  });
  fireEvent.blur(getByTestId('field'));

  expect(getByTestId('fieldError')).toHaveTextContent('必填');
});
