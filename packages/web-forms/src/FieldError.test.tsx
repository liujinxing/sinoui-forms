/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FieldError from './FieldError';
import FormItemContext from './FormItemContext';
import Wrapper from './FormTestWrapper';
import Field from './Field';

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('校验没有错误时，不渲染', () => {
  const { queryByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <FieldError />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(queryByTestId('fieldError')).toBeNull();
});

it('校验错误出错，但touched状态为false时，不渲染', () => {
  const { queryByTestId, getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider
        value={{ ...formItemState, name: 'userName', fields: [] }}
      >
        <Field as="input" name="userName" required data-testid="field" />
        <FieldError />
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
      <FormItemContext.Provider value={{ ...formItemState, name: 'userName' }}>
        <Field as="input" name="userName" required data-testid="field" />
        <FieldError />
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
