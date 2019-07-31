/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Label from './Label';
import FormItemContext from './FormItemContext';
import Field from './Field';
import Wrapper from './FormTestWrapper';

const formItemState = {
  name: 'userName',
  fields: ['userName', 'password'],
  id: 1,
  addField: jest.fn(),
  removeField: jest.fn(),
};

afterEach(cleanup);

it('渲染Label1', () => {
  const { getByText } = render(
    <Wrapper>
      <FormItemContext.Provider value={formItemState}>
        <Label>姓名</Label>
      </FormItemContext.Provider>
    </Wrapper>,
  );

  expect(getByText('姓名')).toBeVisible();
});

it('校验出错，且touched为true时，Label为红色', () => {
  const { getByText, getByTestId } = render(
    <Wrapper>
      <FormItemContext.Provider value={{ ...formItemState, name: 'userName' }}>
        <Label>姓名</Label>
        <Field as="input" name="userName" required data-testid="field" />
      </FormItemContext.Provider>
    </Wrapper>,
  );

  fireEvent.blur(getByTestId('field'));

  expect(getByText('姓名')).toHaveStyle('color: red');
});
